<script lang="ts">
	// import Threemap from '$lib/apex/Threemap.svelte';
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
	import Datas from './Datas.svelte';
	import Grafico from './Grafico.svelte';

	let { data }: PageProps = $props();

	const quantidadeDeSimbolos = 80;
	const atualizacao = false;

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
	let datas = $state<Date[]>([]);

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

	let aaa = $derived.by(() => {
		if (todosConcluidos === false || datas.length === 0) {
			return;
		}
		const flatTrades = $state.snapshot(trades).flat();
		let capitalInicial = 1000;
		let capital = capitalInicial;
		const porcentagemDeInvestimento = 0.1;
		const investimentos: { trade: typeTrade; capital: number }[] = [];
		let ontem: Date | undefined = undefined;
		datas.forEach((dataDeHoje) => {
			if (ontem !== undefined) {
				const quaisManter = investimentos.map((investimentoCorrente) => {
					if (ontem === undefined) return true;
					if (investimentoCorrente.trade.dataDaVenda.getTime() === ontem.getTime()) {
						capital =
							capital + investimentoCorrente.capital * investimentoCorrente.trade.fatorDeLucro;
						return false;
					}
					return true;
				});
				const investimentosParaManter = investimentos.filter(
					(_, contador) => quaisManter[contador],
				);
				investimentos.length = 0;
				investimentos.push(...investimentosParaManter);
			}

			const tradesComCompraHoje = flatTrades.filter((currentTrade) => {
				return currentTrade.dataDaCompra.getTime() === dataDeHoje.getTime();
			});
			if (tradesComCompraHoje.length > 0) {
				const investimentosHoje = tradesComCompraHoje.map((corrente) => {
					return {
						trade: corrente,
						capital: (capital * porcentagemDeInvestimento) / tradesComCompraHoje.length,
					};
				});
				investimentos.push(...investimentosHoje);
				capital = capital * (1 - porcentagemDeInvestimento);
			}
			console.log(capital + funcaoSoma(investimentos.map((aa) => aa.capital)));
			ontem = dataDeHoje;
		});

		investimentos.forEach((investimentoCorrente) => {
			capital = capital + investimentoCorrente.capital * investimentoCorrente.trade.fatorDeLucro;
		});
		investimentos.length = 0;

		console.log(investimentos);
		return capital / capitalInicial;
	});
</script>

{JSON.stringify(aaa)}

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
						{atualizacao}
						bind:concluido={concluidos[i]}
						bind:trades={trades[i]}
					/>
				{/if}
			{/each}
			<Datas simbolo="BTC-USDT" {periodo} {agora} {quantidade} {atualizacao} bind:datas />
			<!-- <Grafico simbolo="AI3-USDT" {periodo} {agora} {quantidade} /> -->
		{/if}
	</div>
</div>

<!-- {#if todosConcluidos}
	<Threemap dados={fatoresDeLucroMensal} />
{/if} -->

<!-- {JSON.stringify(trades)} -->
