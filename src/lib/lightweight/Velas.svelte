<script lang="ts">
	import type { ISeriesApi } from 'lightweight-charts';
	import {
		CandlestickSeries,
		createChart,
		LineSeries,
		type CandlestickData,
		type ChartOptions,
		type DeepPartial,
		type IChartApi,
		type LineData,
		type Time,
	} from 'lightweight-charts';
	import { untrack } from 'svelte';
	import type { typeLinha } from './typeLinha';
	import type { typeVela } from './typeVela';

	let {
		velas,
		linhas = [],
	}: {
		velas: typeVela[];
		linhas?: typeLinha[];
	} = $props();

	let div = $state<HTMLDivElement>();

	const chartOptions: DeepPartial<ChartOptions> = {
		layout: {
			textColor: 'black',
			background: {
				color: 'white',
			},
		},
	};

	let chart: IChartApi;
	let candlestickSeries: ISeriesApi<'Candlestick'>;
	let lineSeries: ISeriesApi<'Line'>[] = [];

	$effect(() => {
		if (div) {
			chart = createChart(div, chartOptions);
			candlestickSeries = chart.addSeries(CandlestickSeries, {
				upColor: '#26a69a',
				downColor: '#ef5350',
				borderVisible: false,
				wickUpColor: '#26a69a',
				wickDownColor: '#ef5350',
			});

			untrack(() => {
				// NÃO SEI SE O UNTRACK É NECESSÁRIO
				lineSeries = linhas.map((linha) => {
					const serie = chart.addSeries(LineSeries, linha.opcoes);
					return serie;
				});
			});

			chart.timeScale().fitContent();
		}
		return () => {
			if (chart) chart.remove();
		};
	});

	$effect(() => {
		candlestickSeries.setData(velas as CandlestickData<Time>[]);
		lineSeries.forEach((serie, i) => {
			serie.setData(linhas[i].dados as LineData<Time>[]);
		});
	});
</script>

<div bind:this={div} style="width: 100%; height: 300px;"></div>
