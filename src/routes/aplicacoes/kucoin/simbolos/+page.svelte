<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

QUANTIDADE TOTAL DE SÍMBOLOS: {data.dados.length}
<br />
<br />
{#each data.dados as simbolo, i (i)}
	<div>
		{simbolo.symbol}
	</div>
{/each}
