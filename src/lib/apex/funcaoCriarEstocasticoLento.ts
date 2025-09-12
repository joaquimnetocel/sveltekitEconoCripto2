import type { typePonto } from '$lib/apex/typePonto';
import type { typeVela } from '$lib/apex/typeVela';
import { funcaoEstocasticoLento } from '$lib/indicadores/funcaoEstocasticoLento';

export function funcaoCriarEstocasticoLento({ velas }: { velas: typeVela[] }): typePonto[] {
	if (velas === undefined) return [];
	const fechamentos = velas.map((current) => current.y[3]);
	const estocastico = funcaoEstocasticoLento({
		close: velas.map((corrente) => corrente.y[3]),
		high: velas.map((corrente) => corrente.y[1]),
		low: velas.map((corrente) => corrente.y[2]),
	});

	const aa = velas.map((current, i) => {
		if (i < 17) {
			return {
				x: current.x,
				y: null,
			};
		}
		return {
			x: current.x,
			y: estocastico[i - 17].k,
		};
	});
	return aa;
}
