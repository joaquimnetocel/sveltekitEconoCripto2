<script lang="ts">
	import ApexCandleChart from '$lib/apex/Velas.svelte';
	import type { PageProps } from './$types.js';

	let { data }: PageProps = $props();
</script>

<div class="p-5">
	<div>
		<a class="classButton" href="/">VOLTAR</a>
	</div>

	<ApexCandleChart velas={data.velas} />
</div>
