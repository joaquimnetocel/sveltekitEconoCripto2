import type { typeDado } from '$lib/alpaca/typeDado';
import type { typeVela } from '$lib/apex/typeVela';

export async function funcaoAlpacaParaApex(par: typeDado[]) {
	return par.map((current) => {
		const retorno: typeVela = {
			x: new Date(current.t),
			y: [current.o, current.h, current.l, current.c],
		};
		return retorno;
	});
}
