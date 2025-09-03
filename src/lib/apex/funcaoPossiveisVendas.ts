import type { typePonto } from '$lib/apex/typePonto';
import type { typeVela } from '$lib/apex/typeVela';

export const funcaoPossiveisVendas = function (
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
			velaCorrente;
		}
		if (rsiCorrente > 70) {
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
