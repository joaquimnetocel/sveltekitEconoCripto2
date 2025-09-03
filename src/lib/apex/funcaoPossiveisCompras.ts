import type { typePonto } from '$lib/apex/typePonto';
import type { typeVela } from '$lib/apex/typeVela';

export const funcaoPossiveisCompras = function (
	velas: typeVela[],
	pontos: typePonto[],
): typePonto[] {
	return velas.map((velaCorrente, contador): typePonto => {
		const pontoCorrente = pontos[contador];
		if (pontoCorrente.y === null) {
			return {
				x: velaCorrente.x,
				y: null,
			};
		}
		if (pontoCorrente.y < 30) {
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
