<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

QUANTIDADE TOTAL DE SÍMBOLOS: {data.criptos.length}
<br />
<br />
{#each data.criptos as simbolo, i (i)}
	<div>
		{simbolo}
	</div>
{/each}
