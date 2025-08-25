import type { typePonto } from '$lib/apex/typePonto';
import type { typeVela } from '$lib/apex/typeVela';
import { funcaoRsi } from '$lib/indicadores/funcaoRsi';

export function funcaoCriarRsi({
	velas,
	periodo,
}: {
	velas: typeVela[];
	periodo: number;
}): typePonto[] {
	if (velas === undefined) return [];
	const fechamentos = velas.map((current) => current.y[3]);
	const rsi = funcaoRsi({
		periodo,
		valores: fechamentos,
	});

	const aa = velas.map((current, i) => {
		if (i < periodo) {
			return {
				x: current.x,
				y: null,
			};
		}
		return {
			x: current.x,
			y: rsi[i - periodo],
		};
	});
	return aa;
}
