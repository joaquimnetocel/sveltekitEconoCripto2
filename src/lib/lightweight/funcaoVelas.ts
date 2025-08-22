import type { typeDado } from '$lib/lightweight/typeDado';
import type { typeVela } from '$lib/lightweight/typeVela';

export function funcaoVelas(par: typeDado[]) {
	const arrayVelasLightweigth: typeVela[] = par.map((current) => {
		const { close, high, low, open, time } = current;
		return { close, high, low, open, time };
	});
	return arrayVelasLightweigth;
}
