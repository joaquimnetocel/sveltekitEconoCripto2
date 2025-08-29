<script lang="ts">
	import type { typeLinha } from '$lib/apex/typeLinha';
	import type ApexCharts from 'apexcharts';
	import { untrack } from 'svelte';

	let {
		linhas = [],
	}: {
		linhas?: typeLinha[];
	} = $props();

	let elemento = $state<HTMLDivElement>();
	let grafico = $state<ApexCharts>();

	const opcoes: ApexCharts.ApexOptions = {
		series: [],
		chart: {
			type: 'line',
			height: 150,
			group: 'social',
			id: 'lines',
		},
		stroke: {
			width: [...linhas.map(() => 2)],
			dashArray: [...linhas.map(() => 5)], // candlestick (0 = sólido), linha (5 = tracejada)
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
		// yaxis: {
		// 	tooltip: {
		// 		enabled: true,
		// 	},
		// },
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
			for (let i = 0; i < linhas.length; i++) {
				arraySeries[i] = {
					type: 'line',
					name: linhas[i].opcoes.descricao,
					data: linhas[i].dados,
					color: linhas[i].opcoes.cor,
					group: 'social',
				};
			}
			grafico.updateSeries(arraySeries);
		}
	});
</script>

<div bind:this={elemento} style="width:100%;"></div>
