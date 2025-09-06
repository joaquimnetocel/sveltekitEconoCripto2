import type { typePonto } from '$lib/apex/typePonto';
import type { typeVela } from '$lib/apex/typeVela';

const compras = function (velas: typeVela[], linhas: typePonto[][]): typePonto[] {
	return velas.map((velaCorrente, contador): typePonto => {
		const mediaMovelCorrente = linhas[0][contador].y;

		if (mediaMovelCorrente === null) {
			return {
				x: velaCorrente.x,
				y: null,
			};
		}
		if (velaCorrente.y[3] > mediaMovelCorrente) {
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
		const mediaMovelCorrente = linhas[0][contador].y;
		if (mediaMovelCorrente === null) {
			return {
				x: velaCorrente.x,
				y: null,
			};
		}
		if (velaCorrente.y[3] < mediaMovelCorrente) {
			return {
				x: velaCorrente.x,
				y: velaCorrente.y[3], // 3 É O FECHAMENTO DA VELA
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
};
