import type { typePonto } from '$lib/apex/typePonto';
import type { typeVela } from '$lib/apex/typeVela';
import { funcaoMediaMovelExponencial } from '$lib/indicadores/funcaoMediaMovelExponencial';

export function funcaoCriarMediaMovelExponencial({
	velas,
	periodo,
}: {
	velas: typeVela[];
	periodo: number;
}): typePonto[] {
	if (velas === undefined) return [];
	const fechamentos = velas.map((current) => current.y[3]);
	const mediasmoveis = funcaoMediaMovelExponencial({
		periodo,
		valores: fechamentos,
	});

	// const velasnaoqueimadas = velas.slice(periodo - 1);
	// return velasnaoqueimadas.map((current, i) => {
	// 	return {
	// 		x: current.x,
	// 		y: mediasmoveis[i],
	// 	};
	// });

	return velas.map((current, i) => {
		if (i < periodo - 1) {
			return {
				x: current.x,
				y: null,
			};
		}
		return {
			x: current.x,
			y: mediasmoveis[i - periodo + 1],
		};
	});
}
