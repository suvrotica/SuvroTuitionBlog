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
	
	// --- FIX: Save Queue Logic ---
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let isSaving = $state(false);
	let hasPendingChanges = $state(false);
	let saveTimer: ReturnType<typeof setTimeout> | null = null;
	// -----------------------------

	let draggingSectionId = $state<string | null>(null);

	let isReadOnly = $derived(!editorSecret);

	onMount(() => {
		const globalSecret = localStorage.getItem('site_editor_secret');
		const specificSecret = localStorage.getItem(`notebook_${notebook.id}_secret`);
		if (globalSecret) editorSecret = globalSecret;
		else if (specificSecret) editorSecret = specificSecret;
	});

	// This function just signals that data has changed and starts the queue if idle
	function scheduleSave(immediate = false) {
		if (isReadOnly) return;
		
		hasPendingChanges = true;
		saveStatus = 'saving'; // UI feedback immediately

		if (immediate) {
			if (saveTimer) clearTimeout(saveTimer);
			processSaveQueue();
		} else if (!saveTimer && !isSaving) {
			// Only start a timer if one isn't running and we aren't currently saving
			saveTimer = setTimeout(processSaveQueue, 1000); 
		}
	}

	async function processSaveQueue() {
		if (saveTimer) {
			clearTimeout(saveTimer);
			saveTimer = null;
		}

		if (isSaving) {
			// If already saving, do nothing. The loop in the 'finally' block will catch the pending changes.
			return;
		}

		if (!hasPendingChanges) {
			saveStatus = 'saved';
			setTimeout(() => { if (saveStatus === 'saved') saveStatus = 'idle'; }, 2000);
			return;
		}

		isSaving = true;
		hasPendingChanges = false; // Reset flag, capturing current state

		// 1. Gather content from child components
		// We do this INSIDE the async queue to ensure we get the absolute latest state 
		// right before the network request starts.
		const updatedSections = notebook.sections.map((section) => {
			if (section.type === 'ink' && sectionRefs[section.id]) {
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

		// Update local state reference
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
				saveStatus = 'error';
				alert("Session invalid. Switched to Read-Only mode.");
				return; // Stop queue
			}

			if (!res.ok) throw new Error('Failed');
			
			// We don't set 'saved' here yet, we wait for the queue to empty
		} catch (e) {
			console.error('Save failed', e);
			saveStatus = 'error';
			// If it failed, we might want to keep hasPendingChanges true to retry? 
			// For now, let's leave it, user will trigger another save by editing.
		} finally {
			isSaving = false;
			
			// If changes happened while we were awaiting fetch, process them immediately
			if (hasPendingChanges) {
				processSaveQueue();
			} else if (saveStatus !== 'error') {
				saveStatus = 'saved';
				setTimeout(() => { if (saveStatus === 'saved') saveStatus = 'idle'; }, 2000);
			}
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
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		draggingSectionId = null;
		scheduleSave(true); // Immediate save on reorder
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
		scheduleSave();
	}
</script>

<div class="notebook max-w-4xl mx-auto p-4 pb-20">
	<div class="mb-8 border-b border-neutral-200 dark:border-neutral-700 pb-4">
		{#if !isReadOnly}
			<input
				type="text"
				bind:value={notebook.title}
				oninput={() => scheduleSave(false)}
				class="text-4xl font-serif font-bold bg-transparent w-full focus:outline-none placeholder-neutral-400 text-neutral-900 dark:text-neutral-100"
				placeholder="Notebook Title"
			/>
			<div class="flex gap-2 mt-2 text-sm">
				<span class="text-xs uppercase tracking-wider text-neutral-500 self-center">
					{#if saveStatus === 'saving'}
						Saving...
					{:else if saveStatus === 'saved'}
						All changes saved
					{:else if saveStatus === 'error'}
						<span class="text-red-500">Error saving</span>
					{/if}
				</span>
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
						onchange={() => scheduleSave(false)}
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