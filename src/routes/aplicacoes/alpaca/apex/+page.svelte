<script lang="ts">
	import { periodos } from '$lib/alpaca/periodos';
	import { simbolos } from '$lib/alpaca/simbolos';
	import type { typePeriodo } from '$lib/alpaca/typePeriodo';
	import type { typeSimbolo } from '$lib/alpaca/typeSimbolo';
	import Hora from '$lib/componentes/Hora.svelte';
	import OpcoesDoGrafico from '$lib/componentes/OpcoesDoGrafico.svelte';
	import type { PageProps } from './$types';
	import Grafico from './Grafico.svelte';

	let { data }: PageProps = $props();

	let simbolo = $state<typeSimbolo>('BTC/USD');
	let periodo = $state<typePeriodo>('1Day');
	let agora = $state<Date>();
	let quantidade = $state(30);
</script>

<div class="p-5">
	<a class="classButton mb-2" href="/">VOLTAR</a>

	<div>
		RELÓGIO: <Hora inicio={data.dateAlpaca} bind:agora />
	</div>
	<OpcoesDoGrafico
		bind:periodo
		bind:simbolo
		bind:quantidade
		{periodos}
		simbolos={simbolos.map((corrente) => corrente.simbolo)}
	/>
	<div>
		{#if agora}
			<Grafico {simbolo} {periodo} {agora} {quantidade} />
		{/if}
	</div>
</div>
