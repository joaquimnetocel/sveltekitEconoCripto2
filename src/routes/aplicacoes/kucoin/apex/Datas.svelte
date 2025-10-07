<script lang="ts">
	import { funcaoKucoinParaApex } from '$lib/conversoes/funcaoKucoinParaApex';
	import type { typePeriodo } from '$lib/kucoin/typePeriodo';
	import type { typeSimbolo } from '$lib/kucoin/typeSimbolo';
	import { funcaoFetchDaApi } from './funcaoFetchDaApi';

	let {
		agora,
		simbolo,
		periodo = '1day',
		quantidade,
		atualizacao = true,
		datas = $bindable(),
	}: {
		datas: Date[];
		agora: Date;
		simbolo: typeSimbolo;
		periodo?: typePeriodo;
		quantidade: number;
		atualizacao?: boolean;
	} = $props();

	async function funcaoPreencherVelas() {
		const dados_sem_tipagem = await funcaoFetchDaApi({
			periodo,
			quantidade,
			simbolo,
		});
		const arrayDadosAlpaca = dados_sem_tipagem as string[][];
		const arrayVelasApex = await funcaoKucoinParaApex(arrayDadosAlpaca);

		datas = arrayVelasApex.map((corrente) => corrente.x);
	}

	let minuto = $derived(agora.getMinutes());
	let hora = $derived(agora.getHours());

	$effect(() => {
		if (atualizacao === false) {
			return;
		}
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

{#await funcaoPreencherVelas()}
	<div>CARREGANDO DATAS...</div>
{:then}
	<div>DATAS CARREGADAS!</div>
{/await}
