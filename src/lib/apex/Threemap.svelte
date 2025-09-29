<script lang="ts">
	import type ApexCharts from 'apexcharts';
	import { untrack } from 'svelte';
	import type { typeThreemap } from './typeThreemap';

	let {
		dados = [],
		exibir = true,
	}: {
		dados?: typeThreemap[];
		exibir?: boolean;
	} = $props();

	let elemento = $state<HTMLDivElement>();
	let grafico = $state<ApexCharts>();

	const opcoes: ApexCharts.ApexOptions = {
		series: [
			{
				data: [],
			},
		],
		legend: {
			show: false,
		},
		chart: {
			height: 350,
			type: 'treemap',
		},
		// title: {
		// 	text: 'Treemap with Color scale',
		// },
		dataLabels: {
			enabled: true,
			style: {
				fontSize: '12px',
			},
			formatter: function (text, op) {
				return [text, op.value];
			},
			offsetY: -4,
		},
		plotOptions: {
			treemap: {
				enableShades: true,
				shadeIntensity: 0.5,
				reverseNegativeShade: true,
				colorScale: {
					ranges: [
						{
							from: Math.min(...dados.map((corrente) => corrente.y)),
							to: 0.999,
							color: '#CD363A',
						},
						{
							from: 1,
							to: Math.max(...dados.map((corrente) => corrente.y)),
							color: '#52B12C',
						},
					],
				},
			},
		},
	};

	async function funcaoAsyncEffect() {
		const apex = await import('apexcharts');
		if (exibir) {
			grafico = new apex.default(elemento, opcoes);
			grafico.render();
		}
	}

	$effect(() => {
		void exibir;
		untrack(() => {
			funcaoAsyncEffect();
		});
	});

	$effect(() => {
		if (grafico) {
			const arraySeries: ApexCharts.ApexOptions['series'] = [];
			arraySeries[0] = {
				data: dados,
			};
			grafico.updateSeries(arraySeries);
		}
	});
</script>

{#if exibir}
	<div bind:this={elemento} style="width:100%;"></div>
{/if}
