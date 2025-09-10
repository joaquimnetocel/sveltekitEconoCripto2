<script lang="ts">
	import Hora from '$lib/componentes/Hora.svelte';
	import OpcoesDoGrafico from '$lib/componentes/OpcoesDoGrafico.svelte';
	import { periodos } from '$lib/kucoin/periodos';
	import { simbolos } from '$lib/kucoin/simbolos';
	import type { typePeriodo } from '$lib/kucoin/typePeriodo';
	import type { typeSimbolo } from '$lib/kucoin/typeSimbolo';
	import type { PageProps } from './$types';
	import Grafico from './Grafico.svelte';

	let { data }: PageProps = $props();

	let simbolo = $state<typeSimbolo>('BTC-USDT');
	let periodo = $state<typePeriodo>('1day');
	let agora = $state<Date>();
	let quantidade = $state(10);
</script>

<div class="p-5">
	<a class="classButton mb-2" href="/">VOLTAR</a>

	<div>
		RELÓGIO: <Hora inicio={data.dataKucoin} bind:agora />
	</div>
	<OpcoesDoGrafico
		bind:periodo
		bind:simbolo
		bind:quantidade
		periodos={[...periodos] as string[]}
		simbolos={[...simbolos] as string[]}
	/>
	<div>
		{#if agora}
			<!-- {#each simbolos as simbolo, i (i)} -->
			<!-- <Grafico {simbolo} {periodo} {agora} {quantidade} /> -->
			<!-- {/each} -->
			<Grafico {simbolo} {periodo} {agora} {quantidade} />
		{/if}
	</div>
</div>
