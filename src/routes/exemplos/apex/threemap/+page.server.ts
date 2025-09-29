import type { PageServerLoad } from '../$types';
import { dados } from './dados';

export const load: PageServerLoad = async function () {
	return {
		dados,
	};
};
