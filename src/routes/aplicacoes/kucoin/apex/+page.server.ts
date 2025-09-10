import { funcaoHorario } from '$lib/kucoin/funcaoHorario';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	return {
		dataKucoin: await funcaoHorario({ fetch }),
	};
};
