import type { typePonto } from '$lib/apex/typePonto';
import type { typeVela } from '$lib/apex/typeVela';
import { funcaoMedia } from '$lib/estatisticas/funcaoMedia';
import { funcaoAverageTrueRangeApex } from '$lib/indicadores/funcaoAverageTrueRangeApex';
import type { typeFuncaoStop } from '../typeFuncaoStop';

const stop: typeFuncaoStop = function ({ velas, agora }) {
	const velasQueimadas = velas.slice(0, agora + 1);
	const averageTrueRange = funcaoAverageTrueRangeApex({
		velas: velasQueimadas,
		periodo: 20,
	});
	const averageTrueRangeMedio = funcaoMedia(averageTrueRange);
	// console.log(velas[agora].y[3] - 1 * averageTrueRangeMedio);
	return velas[agora].y[3] - 1.5 * averageTrueRangeMedio;
};

const compras = function (velas: typeVela[], linhas: typePonto[][]): typePonto[] {
	return velas.map((velaCorrente, contador): typePonto => {
		const highest = linhas[0][contador].y;

		if (highest === null) {
			return {
				x: velaCorrente.x,
				y: null,
			};
		}
		if (velaCorrente.y[1] > highest) {
			return {
				x: velaCorrente.x,
				y: velaCorrente.y[3], // 3 É O PREÇO DE FECHAMENTO DA VELA
			};
		}
		return {
			x: velaCorrente.x,
			y: null,
		};
	});
};

const vendas = function (velas: typeVela[], linhas: typePonto[][]): typePonto[] {
	return velas.map((velaCorrente, contador): typePonto => {
		const lowest = linhas[1][contador].y;

		if (lowest === null) {
			return {
				x: velaCorrente.x,
				y: null,
			};
		}
		if (velaCorrente.y[2] < lowest) {
			return {
				x: velaCorrente.x,
				y: velaCorrente.y[3], // 3 É O PREÇO DE FECHAMENTO DA VELA
			};
		}
		return {
			x: velaCorrente.x,
			y: null,
		};
	});
};

export const criterios = {
	compras,
	vendas,
	stop,
};
