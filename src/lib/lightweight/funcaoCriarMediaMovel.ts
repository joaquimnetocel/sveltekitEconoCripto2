import { funcaoMediaMovel } from '$lib/indicadores/funcaoMediaMovel';
import type { typeLinha } from '$lib/lightweight/typeLinha';
import type { typeVela } from '$lib/lightweight/typeVela';

export function funcaoCriarMediaMovelLightweight({
	velas,
	periodo,
}: {
	velas: typeVela[];
	periodo: number;
}): typeLinha['dados'] {
	if (velas === undefined) return [];
	const fechamentos = velas.map((current) => current.close);
	const mediasmoveis = funcaoMediaMovel({
		periodo,
		valores: fechamentos,
	});

	const velasnaoqueimadas = velas.slice(periodo - 1);
	return velasnaoqueimadas.map((current, i) => {
		return {
			time: current.time,
			value: mediasmoveis[i],
		};
	});
}
