<script lang="ts">
	import type { Notebook, Section } from '$lib/types/notebook';
	import SectionInk from './SectionInk.svelte';
	import { generateUUID } from '$lib/utils/uuid';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';

	let { notebookData }: { notebookData: Notebook } = $props();
	
	let editorSecret = $state<string | null>(null);
	let notebook = $state<Notebook>({ ...notebookData });
	let sectionRefs = $state<Record<string, any>>({}); // To access getCurrentContent
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;

	// Drag & Drop State
	let draggingSectionId = $state<string | null>(null);

	// Derived read-only state: If we don't have a secret, we can't edit.
	let isReadOnly = $derived(!editorSecret);

	onMount(() => {
		// 1. Check for the Global Admin Secret (The Master Key)
		const globalSecret = localStorage.getItem('site_editor_secret');
		
		// 2. Check for notebook specific secret (Legacy/Fallback)
		const specificSecret = localStorage.getItem(`notebook_${notebook.id}_secret`);

		// Prefer global, fallback to specific
		if (globalSecret) {
			editorSecret = globalSecret;
		} else if (specificSecret) {
			editorSecret = specificSecret;
		}
	});

	function scheduleSave(immediate = false) {
		if (isReadOnly) return; 
		
		saveStatus = 'saving';
		if (saveTimeout) clearTimeout(saveTimeout);

		const saveAction = async () => {
			// Gather content from child components
			const updatedSections = notebook.sections.map((section) => {
				// If it's an ink section, ask the component for latest strokes
				if (section.type === 'ink' && sectionRefs[section.id]) {
					const currentContent = sectionRefs[section.id].getCurrentContent();
					
					// Get the latest version to compare
					const latestVer = section.versions[section.versions.length - 1];
					
					// Very basic dirty check to avoid spamming versions if nothing changed
					if (JSON.stringify(latestVer.content) !== JSON.stringify(currentContent)) {
						return {
							...section,
							versions: [
								...section.versions,
								{
									versionId: generateUUID(),
									changedAt: new Date().toISOString(),
									changeType: 'edit' as const,
									content: currentContent
								}
							]
						};
					}
				}
				return section;
			});

			// Update local state with the gathered changes before sending
			notebook.sections = updatedSections;

			// API Call
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
				
				if (!res.ok) throw new Error('Failed');
				
				saveStatus = 'saved';
				setTimeout(() => saveStatus = 'idle', 2000);
			} catch (e) {
				console.error('Save failed', e);
				saveStatus = 'error';
			}
		};

		if (immediate) saveAction();
		else saveTimeout = setTimeout(saveAction, 2000);
	}

	// --- Drag & Drop Handlers ---
	function handleDragStart(e: DragEvent, id: string) {
		if (isReadOnly) return;
		draggingSectionId = id;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
		}
	}

	function handleDragOver(e: DragEvent, targetId: string) {
		if (isReadOnly || !draggingSectionId || draggingSectionId === targetId) return;
		e.preventDefault(); // Essential to allow dropping

		// Reorder state immediately for visual feedback
		const fromIdx = notebook.sections.findIndex(s => s.id === draggingSectionId);
		const toIdx = notebook.sections.findIndex(s => s.id === targetId);

		if (fromIdx !== -1 && toIdx !== -1) {
			const sections = [...notebook.sections];
			const [moved] = sections.splice(fromIdx, 1);
			sections.splice(toIdx, 0, moved);
			
			// Update order indexes
			notebook.sections = sections.map((s, i) => ({ ...s, orderIndex: i }));
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		draggingSectionId = null;
		scheduleSave(true); // Save new order immediately
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
					{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'All changes saved' : saveStatus === 'error' ? 'Error saving' : ''}
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
					<div class="absolute -left-8 top-4 p-2 cursor-move opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-600 transition-opacity">
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
		<div class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-4 py-2 rounded-full shadow-xl flex gap-4 z-50">
			<button onclick={() => addSection('ink')} class="hover:text-gold font-medium flex items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
				Add Page
			</button>
		</div>
	{/if}
</div>