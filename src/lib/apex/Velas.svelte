<script lang="ts">
	import type { typeLinhaApex } from '$lib/types/apex/typeLinhaApex';
	import type { typeVelaApex } from '$lib/types/apex/typeVelaApex';
	import type ApexCharts from 'apexcharts';
	import { untrack } from 'svelte';

	let {
		velas,
		linhas = [],
	}: {
		velas: typeVelaApex[];
		linhas?: typeLinhaApex[];
	} = $props();

	let elemento = $state<HTMLDivElement>();
	let grafico = $state<ApexCharts>();

	const opcoes: ApexCharts.ApexOptions = {
		series: [],
		chart: {
			type: 'candlestick',
			height: 350,
		},
		stroke: {
			width: [2, ...linhas.map(() => 2)],
			dashArray: [0, ...linhas.map(() => 5)], // candlestick (0 = sólido), linha (5 = tracejada)
		},
		// title: {
		// text: 'CandleStick Chart',
		// align: 'left',
		// },
		xaxis: {
			type: 'datetime',
			labels: {
				datetimeUTC: false, // <- Isso impede a conversão para horário local
			},
		},
		yaxis: {
			tooltip: {
				enabled: true,
			},
		},
	};

	async function funcaoAsyncEffect() {
		const apex = await import('apexcharts');
		grafico = new apex.default(elemento, opcoes);
		grafico.render();
	}

	$effect(() => {
		untrack(() => {
			funcaoAsyncEffect();
		});
	});

	$effect(() => {
		if (grafico) {
			const arraySeries: ApexCharts.ApexOptions['series'] = [];
			arraySeries[0] = {
				data: velas,
				type: 'candlestick',
				name: 'COTAÇÕES',
				color: 'black',
			};
			for (let i = 1; i < linhas.length + 1; i++) {
				arraySeries[i] = {
					type: 'line',
					name: linhas[i - 1].descricao,
					data: linhas[i - 1].pontos,
					color: linhas[i - 1].cor,
				};
			}
			grafico.updateSeries(arraySeries);
		}
	});
</script>

<div bind:this={elemento} style="width:100%;"></div>
