import { funcaoHorarioAlpaca } from '$lib/alpaca/funcaoHorario';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	return {
		dataAlpaca: await funcaoHorarioAlpaca({ fetch }),
	};
};
