<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="p-5">
	<a class="classButton mb-2" href="/">VOLTAR</a>
	<br />
	QUANTIDADE TOTAL DE SÍMBOLOS: {data.dados.length}
	<br />
	<br />
	{#each data.dados as simbolo, i (i)}
		<div>
			{simbolo.symbol}
		</div>
	{/each}
</div>
