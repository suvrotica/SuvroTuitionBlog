<script lang="ts">
	import { onMount } from 'svelte';
	
	let secret = $state('');
	let status = $state('');

	onMount(() => {
		// Check if we are already logged in
		const existing = localStorage.getItem('site_editor_secret');
		if (existing) secret = existing;
	});

	function save() {
		localStorage.setItem('site_editor_secret', secret);
		status = 'Saved! You can now edit notebooks.';
	}

	function clear() {
		localStorage.removeItem('site_editor_secret');
		secret = '';
		status = 'Cleared. You are now in read-only mode.';
	}
</script>

<div class="container mx-auto max-w-md py-20">
	<h1 class="text-2xl font-bold mb-4">Editor Access</h1>
	<div class="flex flex-col gap-4">
		<input 
			type="password" 
			bind:value={secret} 
			placeholder="Enter Editor Secret"
			class="p-2 border border-neutral-300 rounded dark:bg-neutral-800 dark:border-neutral-700"
		/>
		<div class="flex gap-2">
			<button onclick={save} class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
				Save Credentials
			</button>
			<button onclick={clear} class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
				Logout
			</button>
		</div>
		{#if status}
			<p class="text-sm text-green-600 dark:text-green-400">{status}</p>
		{/if}
	</div>
</div>