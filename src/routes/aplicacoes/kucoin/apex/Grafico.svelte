<script lang="ts">
	import { funcaoCalcularTrades } from '$lib/apex/funcaoCalcularTrades';
	import Linhas from '$lib/apex/Linhas.svelte';
	import type { typeTrade } from '$lib/apex/typeTrade';
	import type { typeVela } from '$lib/apex/typeVela';
	import Velas from '$lib/apex/Velas.svelte';
	import { funcaoKucoinParaApex } from '$lib/conversoes/funcaoKucoinParaApex';
	import type { typePeriodo } from '$lib/kucoin/typePeriodo';
	import type { typeSimbolo } from '$lib/kucoin/typeSimbolo';
	import { estados } from './estados.svelte';
	import { funcaoFetchDaApi } from './funcaoFetchDaApi';

	let {
		agora,
		simbolo,
		periodo = '1day',
		quantidade,
	}: {
		agora: Date;
		simbolo: typeSimbolo;
		periodo?: typePeriodo;
		quantidade: number;
	} = $props();

	let velas = $state<typeVela[]>();
	let trades = $state<typeTrade[]>([]);
	let exibirVelas = $state(false);
	let exibirLinhas = $state(false);

	let lucroHolding = $state<number>(0);
	let lucroHoldingDiario = $state<number>(0);
	let lucroHoldingMensal = $state<number>(0);

	// let lucro = $derived(
	// 	trades.reduce((acumulado, corrente) => acumulado * corrente.fatorDeLucro, 1),
	// );

	let diasInvestido = $derived(
		trades.reduce((acumulado, corrente) => acumulado + corrente.duracao, 0),
	);

	let lucro = $derived(
		trades.reduce((acumulado, corrente) => acumulado * corrente.fatorDeLucro, 1),
	);

	let lucroDiario = $derived(Math.pow(lucro, 1 / diasInvestido));
	let lucroMensal = $derived(Math.pow(lucroDiario, 30));

	async function funcaoPreencherVelas() {
		const dados_sem_tipagem = await funcaoFetchDaApi({
			periodo,
			quantidade,
			simbolo,
		});
		const arrayDadosAlpaca = dados_sem_tipagem as string[][];
		const arrayVelasApex = await funcaoKucoinParaApex(arrayDadosAlpaca);

		velas = arrayVelasApex;

		lucroHolding = velas[velas.length - 1].y[3] / velas[0].y[3];
		lucroHoldingDiario = Math.pow(lucroHolding, 1 / quantidade);
		lucroHoldingMensal = Math.pow(lucroHoldingDiario, 30);

		estados.funcaoMediaMovelExponencial({
			velas,
			periodo: [50, 7],
			cores: ['pink', 'blue'],
		});
		estados.funcaoHighest({
			velas,
			periodo: [20],
			cores: ['green'],
		});
		estados.funcaoLowest({
			velas,
			periodo: [10],
			cores: ['purple'],
		});
		estados.funcaoRsi({
			velas,
			periodo: [50],
			cores: ['black'],
		});

		// const pontosRsi = estados.rsi.map((corrente) => corrente.dados);
		// const pontosMediasMoveis = estados.mediasmoveis.map((corrente) => corrente.dados);
		// const pontosEstocastico = estados.estocastico.map((corrente) => corrente.dados);
		const pontosHighest = estados.highest.map((corrente) => corrente.dados);
		const pontosLowest = estados.lowest.map((corrente) => corrente.dados);
		const linhas = [...pontosHighest, ...pontosLowest];
		trades = funcaoCalcularTrades({
			velas,
			linhas,
		});
		// console.log($state.snapshot(trades));
	}

	let minuto = $derived(agora.getMinutes());
	let hora = $derived(agora.getHours());

	$effect(() => {
		if (periodo === '1min') {
			void minuto;
			funcaoPreencherVelas();
			console.log(`ATINGIU PERIODO DE 1 MINUTO`);
		} else if (periodo === '5min') {
			if (minuto % 5 !== 1) return;
			funcaoPreencherVelas();
			console.log('ATINGIU PERIODO DE 5 MINUTOS');
		} else if (periodo === '15min') {
			if (minuto % 15 !== 1) return;
			funcaoPreencherVelas();
			console.log('ATINGIU PERIODO DE 15 MINUTOS');
		} else if (periodo === '1hour') {
			if (minuto !== 1) return;
			funcaoPreencherVelas();
			console.log('ATINGIU PERIODO DE 1 HORA');
		} else if (periodo === '1day') {
			if (hora !== 21 || minuto !== 1) return;
			funcaoPreencherVelas();
			console.log('ATINGIU PERIODO DE 1 HORA');
		}
	});
</script>

<div class="rounded-3xl border-2 p-2">
	<div class="text-center font-bold">
		{simbolo} ({periodo})
	</div>

	{#await funcaoPreencherVelas()}
		<div>CARREGANDO...</div>
	{:then}
		<div class="text-center">
			<button class="classButton" onclick={() => (exibirVelas = !exibirVelas)}>
				{#if exibirVelas}
					OCULTAR VELAS
				{:else}
					EXIBIR VELAS
				{/if}
			</button>
			<button class="classButton" onclick={() => (exibirLinhas = !exibirLinhas)}>
				{#if exibirLinhas}
					OCULTAR LINHAS
				{:else}
					EXIBIR LINHAS
				{/if}
			</button>
		</div>
		<Velas
			velas={velas as typeVela[]}
			linhas={[...estados.mediasmoveisexponenciais]}
			{trades}
			exibir={exibirVelas}
		/>
		<div class="text-center">
			<span class="font-extrabold" class:text-green-500={lucro > 1} class:text-red-500={lucro < 1}
				>{lucro > 1 ? 'LUCRO' : 'PREJUÍZO'}: {((lucro - 1) * 100).toFixed(2)}%</span
			>
		</div>
		<div class="text-center">
			<span
				class="font-extrabold"
				class:text-green-500={lucroHolding > 1}
				class:text-red-500={lucroHolding < 1}
				>{lucroHolding > 1 ? 'LUCRO HOLDING' : 'PREJUÍZO HOLDING'}: {(
					(lucroHolding - 1) *
					100
				).toFixed(2)}%</span
			>
		</div>

		{#if trades[trades.length - 1].enumGanhoOuPerda === 'enumNaoRealizado'}
			<div class="text-center font-bold text-yellow-500">
				EM ANDAMENTO HÁ {trades[trades.length - 1].duracao} PERÍODOS
			</div>
		{/if}
		<!-- <div class="text-center">
			RSI 1: {estados.rsi[0].dados[estados.rsi[0].dados.length - 1].y} / RSI 2: {estados.rsi[1]
				.dados[estados.rsi[1].dados.length - 1].y}
		</div> -->
		<Linhas linhas={estados.rsi} exibir={exibirLinhas} />
	{/await}
</div>
{lucroMensal}
{lucroHoldingMensal}
