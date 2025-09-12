<script lang="ts">
	import type { typeLinha } from '$lib/apex/typeLinha';
	import type { typeVela } from '$lib/apex/typeVela';
	import { colors } from '$lib/colors';
	import type ApexCharts from 'apexcharts';
	import { untrack } from 'svelte';
	import type { typeTrade } from './typeTrade';

	let {
		velas,
		linhas = [],
		trades = [],
		exibir = true,
	}: {
		velas: typeVela[];
		linhas?: typeLinha[];
		trades?: typeTrade[];
		exibir?: boolean;
	} = $props();

	let elemento = $state<HTMLDivElement>();
	let grafico = $state<ApexCharts>();

	const opcoes: ApexCharts.ApexOptions = {
		series: [],
		chart: {
			type: 'candlestick',
			height: 350,
			group: 'social',
			id: 'candles',
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
			labels: {
				formatter: function (value: number | null) {
					if (value !== null) {
						return value.toFixed(2);
					}
					return (0).toFixed(2);
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
				data: velas,
				type: 'candlestick',
				name: 'COTAÇÕES',
				color: 'black',
			};
			for (let i = 1; i < linhas.length + 1; i++) {
				arraySeries[i] = {
					type: 'line',
					name: linhas[i - 1].opcoes.descricao,
					data: linhas[i - 1].dados,
					color: linhas[i - 1].opcoes.cor,
				};
			}
			grafico.updateSeries(arraySeries);
		}
	});

	$effect(() => {
		if (trades !== undefined) {
			type typeApexAnnotations = Exclude<ApexCharts.ApexOptions['annotations'], undefined>;
			type typeApexXaxis = Exclude<typeApexAnnotations['xaxis'], undefined>;
			const stringGreenColor = colors.green;
			const stringRedColor = colors.red;
			const stringYellowColor = colors.yellow;
			const stringBlackColor = colors.black;
			const stringWhiteColor = colors.white;
			if (grafico) {
				grafico.clearAnnotations();
			}
			trades.forEach((tradeCorrente) => {
				const stringColor =
					tradeCorrente.enumGanhoOuPerda === 'enumGanho'
						? stringGreenColor
						: tradeCorrente.enumGanhoOuPerda === 'enumPerda'
							? stringRedColor
							: stringYellowColor;
				const objectXAxisAnnotation: typeApexXaxis[number] = {
					x: tradeCorrente.dataDaCompra.getTime().toString(),
					x2: tradeCorrente.dataDaVenda.getTime().toString(),
					fillColor: stringColor,
					opacity: 0.4,
					label: {
						borderColor: stringColor,
						style: {
							fontSize: '10px',
							color: stringColor === stringRedColor ? stringWhiteColor : stringBlackColor,
							background: stringColor,
						},
						offsetY: -10,
						text: `${tradeCorrente.duracao} (${tradeCorrente.fatorDeLucro > 1 ? ((tradeCorrente.fatorDeLucro - 1) * 100).toFixed(2) : ((tradeCorrente.fatorDeLucro - 1) * 100).toFixed(2)})`,
					},
				};
				if (grafico) {
					grafico.addXaxisAnnotation(objectXAxisAnnotation);
				}
			});
		}
	});
</script>

{#if exibir}
	<div bind:this={elemento} style="width:100%;"></div>
{/if}
