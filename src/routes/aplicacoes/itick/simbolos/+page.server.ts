import { PRIVATE_ALPACA_KEY, PRIVATE_ALPACA_SECRET } from '$env/static/private';
import type { PageServerLoad } from './$types';

const BASE_URL = 'https://api.itick.org';
const type = 'crypto';
const region = 'ba';
const code = '';
const TOKEN = '124629c96d6f47a09e27f0fc0e34fdbd8c3ba193c4ca49eaab8ce2c3ab4c96a1';

export const load: PageServerLoad = async ({ fetch }) => {
	const url = `${BASE_URL}/symbol/list?type=${encodeURIComponent(type)}&region=${encodeURIComponent(region)}${code ? `&code=${encodeURIComponent(code)}` : ''}`;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			token: TOKEN,
		},
	});

	if (!response.ok) {
		throw new Error(`Erro: ${response.status} ${response.statusText}`);
	}

	const json = await response.json();
	const todos = json.data;
	return {
		todos,
	};
};
