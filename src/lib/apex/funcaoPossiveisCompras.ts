import type { typePonto } from '$lib/apex/typePonto';
import type { typeVela } from '$lib/apex/typeVela';

export const funcaoPossiveisCompras = function (
	velas: typeVela[],
	linhas: typePonto[][],
): typePonto[] {
	return velas.map((velaCorrente, contador): typePonto => {
		const rsiCorrente = linhas[0][contador].y;
		if (rsiCorrente === null) {
			return {
				x: velaCorrente.x,
				y: null,
			};
		}
		if (rsiCorrente < 30) {
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
