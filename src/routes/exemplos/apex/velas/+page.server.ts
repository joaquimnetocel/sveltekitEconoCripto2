import type { PageServerLoad } from '../$types';
import { velas } from './velas';

export const load: PageServerLoad = async function () {
	return {
		velas,
	};
};
