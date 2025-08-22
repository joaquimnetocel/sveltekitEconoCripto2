import { funcaoRsi } from '$lib/indicadores/funcaoRsi';

import type { typeLinha } from '$lib/lightweight/typeLinha';
import type { typeVela } from '$lib/lightweight/typeVela';

export function funcaoCriarRsiLightweight({
	velas,
	periodo,
}: {
	velas: typeVela[];
	periodo: number;
}): typeLinha['dados'] {
	if (velas === undefined) return [];
	const fechamentos = velas.map((current) => current.close);
	const rsi = funcaoRsi({
		periodo,
		valores: fechamentos,
	});

	return velas.map((current, i) => {
		if (i < periodo) {
			return {
				time: current.time,
				value: undefined,
			};
		}
		return {
			time: current.time,
			value: rsi[i - periodo],
		};
	});
}
