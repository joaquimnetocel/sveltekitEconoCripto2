import type { typePonto } from '$lib/apex/typePonto';
import type { typeVela } from '$lib/apex/typeVela';

const compras = function (velas: typeVela[], linhas: typePonto[][]): typePonto[] {
	return velas.map((velaCorrente, contador): typePonto => {
		const mediaMovelCorrente = linhas[0][contador].y;
		const mediaMovelAnterior = contador === 0 ? mediaMovelCorrente : linhas[0][contador - 1].y;
		const estocastico = linhas[1][contador].y;

		if (mediaMovelCorrente === null || mediaMovelAnterior === null || estocastico === null) {
			return {
				x: velaCorrente.x,
				y: null,
			};
		}

		// const inclinacao = mediaMovelCorrente - mediaMovelAnterior;

		// console.log(contador, velaCorrente.y[3] > mediaMovelCorrente && estocastico < 30);

		// if (contador === 504) {
		// 	console.log(velaCorrente.x);
		// 	console.log(velaCorrente.y[3]);
		// 	console.log(mediaMovelCorrente);
		// 	console.log(estocastico);
		// 	console.log(velaCorrente.y[3] > mediaMovelCorrente && estocastico < 30);
		// }

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
		const mediaMovelAnterior = contador === 0 ? mediaMovelCorrente : linhas[0][contador - 1].y;
		const estocastico = linhas[1][contador].y;

		if (mediaMovelCorrente === null || mediaMovelAnterior === null || estocastico === null) {
			return {
				x: velaCorrente.x,
				y: null,
			};
		}

		// const inclinacao = mediaMovelCorrente - mediaMovelAnterior;

		if (velaCorrente.y[3] < mediaMovelCorrente) {
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
};
