<script lang="ts">
	import { cityPopulations } from '$lib/data/city-populations';
	import D3LineChart, { type Series } from '$lib/components/D3/D3LineChart.svelte';

	// --- STATE ---
	let selectedCityNames = $state<string[]>(['Kolkata', 'Tokyo']);
	// --- REMOVED --- The global doublingPeriod state is no longer needed.
	// let doublingPeriod = $state(50);
	let projectionYears = 500;

	// --- DERIVED LOGIC ---
	let projectionData: Series[] = $state([]);
	
	// --- NEW: Derived state to easily display info about selected cities ---
	let selectedCitiesDetails = $derived(
		cityPopulations.filter((city) => selectedCityNames.includes(city.name))
	);

	$effect(() => {
		// Use the derived state to avoid re-filtering
		const selectedCitiesData = selectedCitiesDetails;

		projectionData = selectedCitiesData.map((city) => {
			const values = [];
			// --- CHANGE: Use the city-specific doubling period from the data ---
			const T_double = city.doublingPeriod < 2 ? 2 : city.doublingPeriod;

			for (let i = 0; i <= projectionYears; i++) {
				const targetYear = city.year0 + i;
				const t = targetYear - city.year0;
				const population = city.p0 * Math.pow(2, t / T_double);

				values.push({ year: targetYear, population });
			}
			return { name: city.name, values };
		});
	});
</script>

<div class="interactive-component-wrapper">
	<div class="grid md:grid-cols-2 gap-6">
		<div>
			<label for="city-select" class="block mb-2 font-semibold text-neutral-700 dark:text-neutral-300">
                Select Cities (Ctrl/Cmd+Click)
            </label>
			<select
				id="city-select"
				multiple
				bind:value={selectedCityNames}
				class="w-full h-48 p-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
			>
				{#each cityPopulations as city (city.name)}
					<option value={city.name}>{city.name}</option>
				{/each}
			</select>
		</div>

		<div>
			<h4 class="mb-2 font-semibold text-neutral-700 dark:text-neutral-300">
                City Doubling Periods
            </h4>
			{#if selectedCitiesDetails.length > 0}
				<ul class="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
					{#each selectedCitiesDetails as city (city.name)}
						<li class="flex justify-between">
							<span>{city.name}:</span>
							<span class="font-mono">{city.doublingPeriod} years</span>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-neutral-500">Select a city to see its data.</p>
			{/if}
		</div>
	</div>

	{#if projectionData.length > 0}
		<div class="mt-6">
			<D3LineChart data={projectionData} />
		</div>
	{:else}
		<p class="text-center p-8 text-neutral-500">
			Please select at least one city to see the projection.
		</p>
	{/if}
</div>