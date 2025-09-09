import { PRIVATE_ALPACA_KEY, PRIVATE_ALPACA_SECRET } from '$env/static/private';
import type { PageServerLoad } from './$types';

const BASE_URL = 'https://api.kucoin.com/api/v2/symbols';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(BASE_URL, {
		method: 'GET',
		redirect: 'follow',
	});

	if (!response.ok) {
		throw new Error(`Erro: ${response.status} ${response.statusText}`);
	}

	const json = await response.json();
	const todos = json.data;

	const dados = todos.filter((corrente: { enableTrading: boolean; quoteCurrency: string }) => {
		return corrente.enableTrading === true && corrente.quoteCurrency === 'USDT';
	});

	return {
		dados,
	};
};
