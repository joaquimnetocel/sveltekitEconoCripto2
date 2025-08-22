import type { typeDado as typeDadoAlpaca } from '$lib/alpaca/typeDado';
import type { typeDado } from './typeDado';

export async function funcaoAlpacaParaLightweight(par: typeDadoAlpaca[]) {
	return par.map((current) => {
		const retorno: typeDado = {
			time: Math.floor(new Date(current.t).getTime() / 1000),
			open: current.o,
			high: current.h,
			low: current.l,
			close: current.c,
			volume: current.v,
		};
		return retorno;
	});
}
