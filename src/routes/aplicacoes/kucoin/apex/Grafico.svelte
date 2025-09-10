<script lang="ts">
	import { funcaoCalcularTrades } from '$lib/apex/funcaoCalcularTrades';
	import { funcaoCriarMediaMovel } from '$lib/apex/funcaoCriarMediaMovel';
	import { funcaoCriarRsi } from '$lib/apex/funcaoCriarRsi';
	import Linhas from '$lib/apex/Linhas.svelte';
	import type { typeLinha } from '$lib/apex/typeLinha';
	import type { typeTrade } from '$lib/apex/typeTrade';
	import type { typeVela } from '$lib/apex/typeVela';
	import Velas from '$lib/apex/Velas.svelte';
	import { funcaoKucoinParaApex } from '$lib/conversoes/funcaoKucoinParaApex';
	import type { typePeriodo } from '$lib/kucoin/typePeriodo';
	import type { typeSimbolo } from '$lib/kucoin/typeSimbolo';
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
	let mediasmoveis = $state<typeLinha[]>([]);
	let rsi = $state<typeLinha[]>([]);
	let trades = $state<typeTrade[]>([]);
	let exibirVelas = $state(false);
	let exibirLinhas = $state(false);

	function funcaoCalcularMediasMoveis() {
		if (velas === undefined) return;
		mediasmoveis[0] = {
			opcoes: {
				descricao: 'MÉDIA MÓVEL SIMPLES (100)',
				cor: 'blue',
			},
			dados: funcaoCriarMediaMovel({
				velas,
				periodo: 100,
			}),
		};
		mediasmoveis[1] = {
			opcoes: {
				descricao: 'MÉDIA MÓVEL SIMPLES (10)',
				cor: 'red',
			},
			dados: funcaoCriarMediaMovel({ velas, periodo: 10 }),
		};
	}

	function funcaoCalcularRsi() {
		if (velas === undefined) return;
		rsi[0] = {
			opcoes: {
				cor: 'blue',
				descricao: 'RSI (5)',
			},
			dados: funcaoCriarRsi({
				velas,
				periodo: 5,
			}),
		};
		rsi[1] = {
			opcoes: {
				cor: 'red',
				descricao: 'RSI (10)',
			},
			dados: funcaoCriarRsi({ velas, periodo: 10 }),
		};
	}

	async function funcaoPreencherVelas() {
		const dados_sem_tipagem = await funcaoFetchDaApi({
			periodo,
			quantidade,
			simbolo,
		});
		const arrayDadosAlpaca = dados_sem_tipagem as string[][];
		const arrayVelasApex = await funcaoKucoinParaApex(arrayDadosAlpaca);

		velas = arrayVelasApex;
		funcaoCalcularMediasMoveis();
		funcaoCalcularRsi();

		const pontosRsi = rsi.map((corrente) => corrente.dados);
		const pontosMediasMoveis = mediasmoveis.map((corrente) => corrente.dados);
		const linhas = [...pontosMediasMoveis, ...pontosRsi];
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
		<Velas velas={velas as typeVela[]} linhas={mediasmoveis} {trades} exibir={exibirVelas} />
		<Linhas linhas={rsi} exibir={exibirLinhas} />
	{/await}
</div>
