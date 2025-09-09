<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

QUANTIDADE TOTAL DE SÍMBOLOS: {data.todos.length}
<br />
<br />
{#each data.todos as simbolo, i (i)}
	<div>
		{simbolo.c} - {simbolo.n} - {simbolo.t}
	</div>
{/each}
