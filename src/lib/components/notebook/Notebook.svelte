<script lang="ts">
	import type { Notebook, Section } from '$lib/types/notebook';
	import SectionInk from './SectionInk.svelte';
	import { generateUUID } from '$lib/utils/uuid';
	import { tick } from 'svelte';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	let { notebookData }: { notebookData: Notebook } = $props();
	let editorSecret = $state<string | null>(null); // Store secret locally for API calls

	// Create reactive state from the initial prop data
	let notebook = $state<Notebook>({ ...notebookData });

	// Refs for section components to call methods like getCurrentContent
	let sectionRefs = $state<Record<string, any>>({});

	let saveTimeout: ReturnType<typeof setTimeout> | null = null;
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');

	function scheduleSave(immediate = false) {
		saveStatus = 'saving';
		if (saveTimeout) {
			clearTimeout(saveTimeout);
		}

		const saveAction = async () => {
			if (!editorSecret) {
				console.warn('Editor secret not set. Cannot save.');
				const secretFromStorage = localStorage.getItem(`notebook_${notebook.id}_secret`);
				if (secretFromStorage) {
					editorSecret = secretFromStorage;
				} else {
					saveStatus = 'error';
					return;
				}
			}

			console.log('Saving changes...');
			// Collect current content from all sections
			const updatedSections = notebook.sections.map((section) => {
				const ref = sectionRefs[section.id];
				if (ref && typeof ref.getCurrentContent === 'function') {
					const currentContent = ref.getCurrentContent();

					const latestVersion = section.versions[section.versions.length - 1];
					if (JSON.stringify(latestVersion.content) !== JSON.stringify(currentContent)) {
						const newVersion = {
							versionId: generateUUID(),
							changedAt: new Date().toISOString(),
							changeType: 'edit' as const,
							content: currentContent
						};
						return {
							...section,
							versions: [...section.versions, newVersion]
						};
					}
				}
				return section;
			});

			const payload = {
				title: notebook.title,
				sections: updatedSections
			};

			try {
				const response = await fetch(`/api/notebooks/${notebook.id}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${editorSecret}`
					},
					body: JSON.stringify(payload)
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
				}

				const savedNotebook: Notebook = await response.json();
				// Sync state from server response
				notebook.sections = savedNotebook.sections;
				notebook.title = savedNotebook.title;

				saveStatus = 'saved';
				// Reset status after a short delay
				setTimeout(() => {
					if (saveStatus === 'saved') saveStatus = 'idle';
				}, 2000);
				console.log('Save successful!');
			} catch (error: any) {
				console.error('Save failed:', error);
				saveStatus = 'error';
			}
		};

		if (immediate) {
			saveAction();
		} else {
			saveTimeout = setTimeout(saveAction, 2000); // 2 second debounce
		}
	}

	// --- THIS IS THE FIX ---
	// This $effect will now ONLY auto-save the title.
	// Changes to sections are handled by the `onchange` prop in the template.
	$effect(() => {
		// This effect tracks notebook.title
		const title = notebook.title;

		// This check is important to prevent saving on the initial load
		if (notebookData && title !== notebookData.title) {
			// Don't autosave in dev, only on explicit save button click
			if (!dev) {
				scheduleSave();
			}
		}
	});
	// --- END FIX ---

	// Check local storage for secret on mount
	onMount(() => {
		const secretFromStorage = localStorage.getItem(`notebook_${notebook.id}_secret`);
		if (secretFromStorage) {
			editorSecret = secretFromStorage;
		} else {
			if (dev) {
				const promptedSecret = prompt('Enter editor secret to save/edit:');
				if (promptedSecret) {
					editorSecret = promptedSecret;
					localStorage.setItem(`notebook_${notebook.id}_secret`, promptedSecret);
				}
			}
		}
	});

	function addInkSection() {
		const newSection: Section = {
			id: generateUUID(),
			type: 'ink',
			orderIndex: (notebook.sections.length + 1) * 1000,
			createdAt: new Date().toISOString(),
			versions: [
				{
					versionId: generateUUID(),
					changedAt: new Date().toISOString(),
					changeType: 'create',
					content: { strokes: [] }
				}
			]
		};
		notebook.sections = [...notebook.sections, newSection];
	}

	function getSaveStatusText() {
		switch (saveStatus) {
			case 'saving':
				return 'Saving...';
			case 'saved':
				return 'Saved!';
			case 'error':
				return 'Save Failed';
			default:
				return 'Save Notebook';
		}
	}
</script>

<div class="notebook p-4 space-y-4">
	<input
		type="text"
		bind:value={notebook.title}
		class="text-3xl font-bold bg-transparent border-b border-neutral-300 dark:border-neutral-700 p-2 w-full focus:ring-0 focus:outline-none focus:border-gold text-neutral-800 dark:text-neutral-300 placeholder-neutral-500"
		placeholder="Untitled Notebook"
	/>

	<div class="controls space-x-2 flex items-center">
		<button onclick={addInkSection} class="">Add Ink Section</button>
		<button onclick={() => scheduleSave(true)} disabled={saveStatus === 'saving'} class="">
			{getSaveStatusText()}
		</button>
		{#if saveStatus === 'error'}
			<span class="text-red-500 text-sm">Error saving. Check console.</span>
		{/if}
	</div>

	{#each notebook.sections as section (section.id)}
		<div class="section-container border-t pt-4">
			<h2 class="text-xs uppercase text-neutral-500 mb-2">
				Section: {section.type} (ID: {section.id.substring(0, 4)})
			</h2>
			{#if section.type === 'ink'}
				<SectionInk
					bind:this={sectionRefs[section.id]}
					content={section.versions[section.versions.length - 1]
						.content as import('$lib/types/notebook').InkContent}
					onchange={() => scheduleSave(false)}
				/>
			{:else if section.type === 'markdown'}
				<p class="text-neutral-400 italic">(Markdown section stub)</p>
			{:else if section.type === 'code'}
				<p class="text-neutral-400 italic">(Code section stub)</p>
			{:else if section.type === 'title'}
				<p class="text-neutral-400 italic">(Title section stub)</p>
			{/if}
		</div>
	{/each}

	{#if !editorSecret}
		<div class="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-sm">
			No editor secret found. Saving is disabled.
		</div>
	{/if}
</div>