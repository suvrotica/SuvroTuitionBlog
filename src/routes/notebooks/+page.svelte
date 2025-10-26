<script lang="ts">
	import { goto } from '$app/navigation';

	let { data } = $props();
	let isCreating = $state(false);

	async function createNewNotebook() {
		if (isCreating) return;
		isCreating = true;
		try {
			const response = await fetch('/api/notebooks', { method: 'POST' });
			if (!response.ok) {
				throw new Error(`Failed to create notebook: ${response.statusText}`);
			}
			const { id, editToken } = await response.json();

			// Store the secret (token) in local storage for the editor
			localStorage.setItem(`notebook_${id}_secret`, editToken);

			// Navigate to the new notebook's edit page
			await goto(`/notebook/${id}`);
		} catch (error: any) {
			console.error('Error creating notebook:', error);
			alert(`Could not create notebook: ${error.message}`);
		} finally {
			isCreating = false;
		}
	}
</script>

<svelte:head>
	<title>My Notebooks - SuvroGhosh.Blog</title>
</svelte:head>

<section>
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-4xl md:text-5xl">My Notebooks</h1>
		<button onclick={createNewNotebook} disabled={isCreating} class="whitespace-nowrap">
			{isCreating ? 'Creating...' : 'New Notebook'}
		</button>
	</div>

	{#if data.notebooks.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each data.notebooks as notebook (notebook.id)}
				<a
					href={`/notebook/${notebook.id}`}
					class="card post-link no-underline block"
				>
					<h2 class="mt-0 mb-2 post-link">{notebook.title}</h2>
					<p class="text-sm text-tertiary">
						Created: {new Date(notebook.createdAt).toLocaleString()}
					</p>
				</a>
			{/each}
		</div>
	{:else}
		<div class="text-center py-12 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
			<p class="text-lg text-neutral-500">You haven't created any notebooks yet.</p>
			<button onclick={createNewNotebook} disabled={isCreating} class="mt-4">
				{isCreating ? 'Creating...' : 'Create your first notebook'}
			</button>
		</div>
	{/if}
</section>