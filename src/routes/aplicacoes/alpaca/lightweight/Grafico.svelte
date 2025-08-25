<script lang="ts">
	import type { typeDado } from '$lib/alpaca/typeDado';
	import { funcaoAlpacaParaLightweight } from '$lib/lightweight/funcaoAlpacaParaLightweight';
	import { funcaoCriarMediaMovelLightweight } from '$lib/lightweight/funcaoCriarMediaMovel';
	import { funcaoCriarRsiLightweight } from '$lib/lightweight/funcaoCriarRsi';
	import { funcaoVelas } from '$lib/lightweight/funcaoVelas';
	import Linhas from '$lib/lightweight/Linhas.svelte';
	import type { typeLinha } from '$lib/lightweight/typeLinha';
	import type { typeVela } from '$lib/lightweight/typeVela';
	import Velas from '$lib/lightweight/Velas.svelte';
	import { funcaoFetchDaApi } from './funcaoFetchDaApi';

	let {
		agora,
		simbolo,
		periodo,
		quantidade,
	}: {
		agora: Date;
		simbolo: string;
		periodo: string;
		quantidade: number;
	} = $props();

	let velas = $state<typeVela[]>();
	let mediasmoveis = $state<typeLinha[]>([]);
	let rsi = $state<typeLinha[]>([]);

	function funcaoCalcularMediasMoveis() {
		if (velas === undefined) return;
		mediasmoveis[0] = {
			opcoes: {
				color: 'red',
				lineStyle: 2,
				lineWidth: 2,
			},
			dados: funcaoCriarMediaMovelLightweight({
				velas,
				periodo: 5,
			}),
		};
		mediasmoveis[1] = {
			opcoes: {
				color: 'orange',
				lineStyle: 2,
				lineWidth: 2,
			},
			dados: funcaoCriarMediaMovelLightweight({ velas, periodo: 10 }),
		};
	}

	function funcaoCalcularRsi() {
		if (velas === undefined) return;
		rsi[0] = {
			opcoes: {
				color: 'red',
				lineStyle: 2,
				lineWidth: 2,
			},
			dados: funcaoCriarRsiLightweight({
				velas,
				periodo: 5,
			}),
		};
		rsi[1] = {
			opcoes: {
				color: 'orange',
				lineStyle: 2,
				lineWidth: 2,
			},
			dados: funcaoCriarRsiLightweight({ velas, periodo: 10 }),
		};
	}

	async function funcaoDados() {
		const dados_sem_tipagem = await funcaoFetchDaApi({
			periodo,
			quantidade,
			simbolo,
		});
		const arrayDadosAlpaca = dados_sem_tipagem as typeDado[];
		const arrayDadosLightWeight = await funcaoAlpacaParaLightweight(arrayDadosAlpaca);
		const arrayVelasLightweigth = funcaoVelas(arrayDadosLightWeight);
		velas = arrayVelasLightweigth;
		funcaoCalcularMediasMoveis();
		funcaoCalcularRsi();
	}

	let minuto = $derived(agora.getMinutes());
	let hora = $derived(agora.getHours());

	$effect(() => {
		if (periodo === '1Min') {
			void minuto;
			funcaoDados();
			console.log(`ATINGIU PERIODO DE 1 MINUTO`);
		} else if (periodo === '5Min') {
			if (minuto % 5 !== 1) return;
			funcaoDados();
			console.log('ATINGIU PERIODO DE 5 MINUTOS');
		} else if (periodo === '15Min') {
			if (minuto % 15 !== 1) return;
			funcaoDados();
			console.log('ATINGIU PERIODO DE 15 MINUTOS');
		} else if (periodo === '1Hour') {
			if (minuto !== 1) return;
			funcaoDados();
			console.log('ATINGIU PERIODO DE 1 HORA');
		} else if (periodo === '1Day') {
			if (hora !== 21 || minuto !== 1) return;
			funcaoDados();
			console.log('ATINGIU PERIODO DE 1 HORA');
		}
	});
</script>

<div>
	{simbolo} ({periodo})
</div>

{#await funcaoDados()}
	<div>CARREGANDO...</div>
{:then}
	<Velas velas={velas as typeVela[]} linhas={mediasmoveis} />
	RSI:
	<Linhas linhas={rsi} />
{/await}
