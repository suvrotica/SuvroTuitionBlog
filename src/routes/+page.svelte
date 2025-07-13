<svelte:head>
	<title>Tutor Suvro - Home Tuition in Kolkata</title>
	<meta
		name="description"
		content="Personalized home tuition for Math, Science, and Computer subjects for classes 6-12 (CBSE, ICSE, WB) by Suvro Ghosh."
	/>
</svelte:head>

<script lang="ts">
	const name = 'Suvro Ghosh';
	const tutorAlias = 'Tutor Suvro';
	const phone = '+91 ----------';
	const address =
		'Kolkata, West Bengal, 70050, India';
</script>

<div class="min-h-screen bg-gray-50 dark:bg-neutral-800 p-6">
	<div
		class="max-w-3xl mx-auto bg-white dark:bg-neutral-900 shadow-xl rounded-2xl p-8 text-neutral-800 dark:text-neutral-200"
	>
		<div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
			<div
				class="w-32 h-32 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden flex-shrink-0"
			>
				<svg class="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
					<path
						d="M24 20.993V24H0v-2.993A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
				</div>
			<div class="text-center sm:text-left">
				<h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{tutorAlias}</h1>
				<p class="text-lg mt-1">Home Tuition | Math · Science · Computer · AI</p>
				<p class="text-md text-gray-600 dark:text-gray-400">
					Classes 6–12 | Boards: CBSE, ICSE, WB | Entrance Coaching
				</p>
				<p class="text-sm text-gray-500 mt-2">{address}</p>
			</div>
		</div>

		<div class="mt-8">
			<a
				href="/blog"
				class="block w-full text-center mt-4 rounded-lg bg-gold px-5 py-3 text-lg font-medium text-white transition-colors hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-800"
			>
				View My Engineering Blog
			</a>
		</div>

		<div class="mt-8 space-y-4">
			<h2 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
				Why Learn With {tutorAlias}?
			</h2>
			<ul class="list-disc list-inside space-y-2 text-neutral-700 dark:text-neutral-300">
				<li>Clear, concept-based explanations – no rote learning</li>
				<li>Small focused batches (max 6 students)</li>
				<li>One-on-one attention, personalized approach</li>
				<li>Support for board exams & competitive entrances (JEE, WBJEE)</li>
				<li>Special sessions for programming & AI foundations (optional)</li>
			</ul>
		</div>

		<div class="mt-8 pt-6 border-t border-neutral-300 dark:border-neutral-700">
			<h2 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Contact</h2>
			<p class="mt-2">
				Call/WhatsApp:
				<a class="text-gold hover:underline" href="https://wa.me/----------">{phone}</a>
			</p>
			<p>Email: <span class="text-gray-500 italic">(Your email address here)</span></p>
		</div>
	</div>
</div>