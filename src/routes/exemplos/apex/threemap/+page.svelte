<script lang="ts">
	import ApexCandleChart from '$lib/apex/Threemap.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="p-5">
	<div>
		<a class="classButton" href="/">VOLTAR</a>
	</div>

	<ApexCandleChart dados={data.dados} />
</div>
