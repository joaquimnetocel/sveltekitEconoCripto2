import type { typePonto } from '$lib/apex/typePonto';
import type { typeVela } from '$lib/apex/typeVela';

export const funcaoPossiveisVendas = function (
	velas: typeVela[],
	pontos: typePonto[],
): typePonto[] {
	return velas.map((velaCorrente, i): typePonto => {
		const pontoCorrente = pontos[i];
		if (pontoCorrente.y === null) {
			return {
				x: velaCorrente.x,
				y: null,
			};
			velaCorrente;
		}
		if (pontoCorrente.y > 70) {
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
