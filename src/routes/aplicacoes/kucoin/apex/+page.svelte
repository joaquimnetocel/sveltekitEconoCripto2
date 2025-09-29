<script lang="ts">
	import Threemap from '$lib/apex/Threemap.svelte';
	import type { typeTrade } from '$lib/apex/typeTrade';
	import Hora from '$lib/componentes/Hora.svelte';
	import OpcoesDoGrafico from '$lib/componentes/OpcoesDoGrafico.svelte';
	import { funcaoProduto } from '$lib/estatisticas/funcaoProduto';
	import { funcaoSoma } from '$lib/estatisticas/funcaoSoma';
	import { periodos } from '$lib/kucoin/periodos';
	import { simbolos } from '$lib/kucoin/simbolos';
	import type { typePeriodo } from '$lib/kucoin/typePeriodo';
	import type { typeSimbolo } from '$lib/kucoin/typeSimbolo';
	import type { PageProps } from './$types';
	import Grafico from './Grafico.svelte';

	let { data }: PageProps = $props();

	const quantidadeDeSimbolos = 11;

	let simbolo = $state<typeSimbolo>('BTC-USDT');
	let periodo = $state<typePeriodo>('1day');
	let agora = $state<Date>();
	let quantidade = $state(500);
	let concluidos = $state<boolean[]>(simbolos.slice(0, quantidadeDeSimbolos).map(() => false));
	let trades = $state<typeTrade[][]>(
		simbolos.slice(0, quantidadeDeSimbolos).map(() => {
			return [];
		}),
	);

	let todosConcluidos = $derived(!concluidos.includes(false));

	let fatoresDeLucroMensal = $derived(
		trades.map((ativoCorrente, contador) => {
			const fatores = ativoCorrente.map((corrente) => corrente.fatorDeLucro);
			const fator = funcaoProduto(fatores);
			const arrayDiasInvestido = ativoCorrente.map((corrente) => corrente.duracao);
			const diasInvestido = funcaoSoma(arrayDiasInvestido);
			const mensal = diasInvestido === 0 ? 1 : Math.pow(fator, 30 / diasInvestido);
			return {
				x: simbolos.slice(0, quantidadeDeSimbolos)[contador],
				y: Number(((mensal - 1) * 100).toFixed(2)),
			};
		}),
	);
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
			{#each simbolos.slice(0, quantidadeDeSimbolos) as simbolo, i (i)}
				{#if trades[i] !== undefined}
					<Grafico
						{simbolo}
						{periodo}
						{agora}
						{quantidade}
						atualizacao={false}
						bind:concluido={concluidos[i]}
						bind:trades={trades[i]}
					/>
				{/if}
			{/each}
			<!-- <Grafico simbolo="AI3-USDT" {periodo} {agora} {quantidade} /> -->
		{/if}
	</div>
</div>

{#if todosConcluidos}
	<Threemap dados={fatoresDeLucroMensal} />
{/if}
