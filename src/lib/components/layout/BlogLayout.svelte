<script lang="ts">
  // Using $props() for Svelte 5 Runes mode and providing explicit types
  let { 
    title = '', 
    description = '', 
    date = '', 
    tags = [] as string[],
    children 
  } = $props<{
    title?: string;
    description?: string;
    date?: string;
    tags?: string[];
    children: any; // Using `any` for generic child content for now
  }>();
</script>

<article class="prose prose-lg dark:prose-invert mx-auto px-4 py-8">
  {#if title}
    <h1 class="text-4xl font-bold mb-2">{title}</h1>
  {/if}

  {#if description}
    <p class="text-gray-600 dark:text-gray-400 italic mb-2">{description}</p>
  {/if}

  {#if date}
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{new Date(date).toLocaleDateString()}</p>
  {/if}

  {#if tags.length > 0}
    <div class="flex flex-wrap gap-2 mb-6">
      {#each tags as tag}
        <span class="bg-gray-200 dark:bg-gray-700 text-xs font-medium px-2 py-1 rounded">{tag}</span>
      {/each}
    </div>
  {/if}

  {@render children()}
</article>