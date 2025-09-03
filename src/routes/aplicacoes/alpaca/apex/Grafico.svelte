<script lang="ts">
	import type { typeDado } from '$lib/alpaca/typeDado';
	import type { typePeriodo } from '$lib/alpaca/typePeriodo';
	import Linhas from '$lib/apex/Linhas.svelte';
	import Velas from '$lib/apex/Velas.svelte';
	import { funcaoAlpacaParaApex } from '$lib/apex/funcaoAlpacaParaApex';
	import { funcaoCriarMediaMovel } from '$lib/apex/funcaoCriarMediaMovel';
	import { funcaoCriarRsi } from '$lib/apex/funcaoCriarRsi';
	import { funcaoOperacoes } from '$lib/apex/funcaoOperacoes';
	import { funcaoPossiveisCompras } from '$lib/apex/funcaoPossiveisCompras';
	import { funcaoPossiveisVendas } from '$lib/apex/funcaoPossiveisVendas';
	import { funcaoTrades } from '$lib/apex/funcaoTrades';
	import type { typeLinha } from '$lib/apex/typeLinha';
	import type { typeTrade } from '$lib/apex/typeTrade';
	import type { typeVela } from '$lib/apex/typeVela';
	import { funcaoFetchDaApi } from './funcaoFetchDaApi';

	let {
		agora,
		simbolo,
		periodo = '1Day',
		quantidade,
	}: {
		agora: Date;
		simbolo: string;
		periodo?: typePeriodo;
		quantidade: number;
	} = $props();

	let velas = $state<typeVela[]>();
	let mediasmoveis = $state<typeLinha[]>([]);
	let rsi = $state<typeLinha[]>([]);
	let trades = $state<typeTrade[]>([]);

	function funcaoCalcularMediasMoveis() {
		if (velas === undefined) return;
		mediasmoveis[0] = {
			opcoes: {
				descricao: 'MÉDIA MÓVEL SIMPLES (5)',
				cor: 'blue',
			},
			dados: funcaoCriarMediaMovel({
				velas,
				periodo: 5,
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

	function funcaoCalcularTrades() {
		if (velas === undefined) return;
		const rsiSomentePontos = rsi.map((corrente) => corrente.dados);
		const possiveisCompras = funcaoPossiveisCompras(velas, rsiSomentePontos);
		const possiveisVendas = funcaoPossiveisVendas(velas, rsiSomentePontos);
		const operacoes = funcaoOperacoes(possiveisCompras, possiveisVendas);
		const ultimoFechamento = velas[velas.length - 1].y[3];
		trades = [];
		trades = funcaoTrades(operacoes, ultimoFechamento);
		console.log($state.snapshot(trades));
	}

	async function funcaoPreencherVelas() {
		const dados_sem_tipagem = await funcaoFetchDaApi({
			periodo,
			quantidade,
			simbolo,
		});
		const arrayDadosAlpaca = dados_sem_tipagem as typeDado[];
		const arrayVelasApex = await funcaoAlpacaParaApex(arrayDadosAlpaca);
		velas = arrayVelasApex;
		funcaoCalcularMediasMoveis();
		funcaoCalcularRsi();
		funcaoCalcularTrades();
	}

	let minuto = $derived(agora.getMinutes());
	let hora = $derived(agora.getHours());

	$effect(() => {
		if (periodo === '1Min') {
			void minuto;
			funcaoPreencherVelas();
			console.log(`ATINGIU PERIODO DE 1 MINUTO`);
		} else if (periodo === '5Min') {
			if (minuto % 5 !== 1) return;
			funcaoPreencherVelas();
			console.log('ATINGIU PERIODO DE 5 MINUTOS');
		} else if (periodo === '15Min') {
			if (minuto % 15 !== 1) return;
			funcaoPreencherVelas();
			console.log('ATINGIU PERIODO DE 15 MINUTOS');
		} else if (periodo === '1Hour') {
			if (minuto !== 1) return;
			funcaoPreencherVelas();
			console.log('ATINGIU PERIODO DE 1 HORA');
		} else if (periodo === '1Day') {
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
		<Velas velas={velas as typeVela[]} linhas={mediasmoveis} {trades} />
		<Linhas linhas={rsi} />
	{/await}
</div>
