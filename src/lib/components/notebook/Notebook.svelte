<script lang="ts">
	import type { Notebook, Section } from '$lib/types/notebook';
	import SectionInk from './SectionInk.svelte';
	import { generateUUID } from '$lib/utils/uuid';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';

	let { notebookData }: { notebookData: Notebook } = $props();

	let editorSecret = $state<string | null>(null);
	let notebook = $state<Notebook>({ ...notebookData });
	let sectionRefs = $state<Record<string, any>>({});
	
	// --- Explicit Save State ---
	let isSaving = $state(false);
	let hasUnsavedChanges = $state(false);
	let lastSavedAt = $state<Date | null>(null);
	let draggingSectionId = $state<string | null>(null);

	let isReadOnly = $derived(!editorSecret);

	onMount(() => {
		const globalSecret = localStorage.getItem('site_editor_secret');
		const specificSecret = localStorage.getItem(`notebook_${notebook.id}_secret`);
		if (globalSecret) editorSecret = globalSecret;
		else if (specificSecret) editorSecret = specificSecret;
	});

	function onContentChange() {
		if (isReadOnly) return;
		hasUnsavedChanges = true;
	}

	async function saveNotebook() {
		if (isReadOnly || isSaving) return;
		
		isSaving = true;
		// Temporarily set to false. If the user draws *while* saving, 
		// onContentChange will flip it back to true, letting them save again.
		hasUnsavedChanges = false; 

		// 1. Capture the current state of all sections
		const updatedSections = notebook.sections.map((section) => {
			if (section.type === 'ink' && sectionRefs[section.id]) {
				// Get the snapshot of the current strokes
				const currentContent = sectionRefs[section.id].getCurrentContent();
				
				const versions = [...section.versions];
				if (versions.length > 0) {
					versions[versions.length - 1] = {
						...versions[versions.length - 1],
						content: currentContent,
						changedAt: new Date().toISOString()
					};
				} else {
					versions.push({
						versionId: generateUUID(),
						changedAt: new Date().toISOString(),
						changeType: 'create',
						content: currentContent
					});
				}

				return { ...section, versions };
			}
			return section;
		});

		// Update local state wrapper
		notebook.sections = updatedSections;

		try {
			const res = await fetch(`/api/notebooks/${notebook.id}`, {
				method: 'PATCH',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${editorSecret}`
				},
				body: JSON.stringify({ 
					title: notebook.title, 
					sections: updatedSections 
				})
			});

			if (res.status === 401 || res.status === 403) {
				editorSecret = null;
				localStorage.removeItem('site_editor_secret');
				alert("Session invalid. Switched to Read-Only mode.");
				return;
			}

			if (!res.ok) throw new Error('Failed');
			
			lastSavedAt = new Date();
		} catch (e) {
			console.error('Save failed', e);
			alert("Error saving notebook. Please try again.");
			hasUnsavedChanges = true; // Re-enable button so user can retry
		} finally {
			isSaving = false;
		}
	}

	function handleDragStart(e: DragEvent, id: string) {
		if (isReadOnly) return;
		draggingSectionId = id;
		e.dataTransfer?.setData('text/plain', id);
		if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
	}

	function handleDragOver(e: DragEvent, targetId: string) {
		if (isReadOnly || !draggingSectionId || draggingSectionId === targetId) return;
		e.preventDefault();
		const fromIdx = notebook.sections.findIndex(s => s.id === draggingSectionId);
		const toIdx = notebook.sections.findIndex(s => s.id === targetId);

		if (fromIdx !== -1 && toIdx !== -1) {
			const sections = [...notebook.sections];
			const [moved] = sections.splice(fromIdx, 1);
			sections.splice(toIdx, 0, moved);
			notebook.sections = sections.map((s, i) => ({ ...s, orderIndex: i }));
			onContentChange(); // Mark as unsaved on reorder
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		draggingSectionId = null;
	}

	function addSection(type: 'ink' | 'markdown') {
		const newSection: Section = {
			id: generateUUID(),
			type,
			orderIndex: notebook.sections.length,
			createdAt: new Date().toISOString(),
			versions: [{
				versionId: generateUUID(),
				changedAt: new Date().toISOString(),
				changeType: 'create',
				content: type === 'ink' ? { strokes: [] } : { text: '' }
			}]
		};
		notebook.sections = [...notebook.sections, newSection];
		onContentChange();
	}
</script>

<div class="notebook max-w-4xl mx-auto p-4 pb-20">
	<div class="mb-8 border-b border-neutral-200 dark:border-neutral-700 pb-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
		{#if !isReadOnly}
			<div class="flex-1">
				<input
					type="text"
					bind:value={notebook.title}
					oninput={onContentChange}
					class="text-4xl font-serif font-bold bg-transparent w-full focus:outline-none placeholder-neutral-400 text-neutral-900 dark:text-neutral-100"
					placeholder="Notebook Title"
				/>
			</div>
			
			<div class="flex items-center gap-4">
				{#if lastSavedAt}
					<span class="text-xs text-neutral-400">
						Saved {lastSavedAt.toLocaleTimeString()}
					</span>
				{/if}
				
				<button 
					onclick={saveNotebook} 
					disabled={!hasUnsavedChanges || isSaving}
					class="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all
						{hasUnsavedChanges 
							? 'bg-[var(--color-gold)] text-white hover:brightness-110 shadow-md cursor-pointer' 
							: 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'}"
				>
					{#if isSaving}
						<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Saving...
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
						Save
					{/if}
				</button>
			</div>
		{:else}
			<h1 class="text-4xl font-serif font-bold text-neutral-900 dark:text-neutral-100">
				{notebook.title}
			</h1>
			<p class="text-sm text-neutral-500 mt-1">Read-only View</p>
		{/if}
	</div>

	<div class="space-y-8">
		{#each notebook.sections as section (section.id)}
			<div
				animate:flip={{ duration: 300 }}
				class="section-wrapper relative group"
				draggable={!isReadOnly}
				role="listitem" 
				ondragstart={(e) => handleDragStart(e, section.id)}
				ondragover={(e) => handleDragOver(e, section.id)}
				ondrop={handleDrop}
			>
				{#if !isReadOnly}
					<div class="absolute -left-8 top-4 p-2 cursor-move opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-600 transition-opacity" aria-hidden="true">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
					</div>
				{/if}

				{#if section.type === 'ink'}
					<SectionInk
						bind:this={sectionRefs[section.id]}
						content={section.versions[section.versions.length - 1].content as import('$lib/types/notebook').InkContent}
						readOnly={isReadOnly}
						onchange={onContentChange}
					/>
				{:else if section.type === 'markdown'}
					<div class="p-4 border border-dashed rounded text-neutral-500">Markdown Section (Coming Soon)</div>
				{/if}
			</div>
		{/each}
	</div>

	{#if !isReadOnly}
		<div class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white 
px-4 py-2 rounded-full shadow-xl flex gap-4 z-50">
			<button onclick={() => addSection('ink')} class="hover:text-[var(--color-gold)] font-medium flex items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
				Add Page
			</button>
		</div>
	{/if}
</div>