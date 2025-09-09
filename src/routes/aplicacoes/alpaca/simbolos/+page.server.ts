import { PRIVATE_ALPACA_KEY, PRIVATE_ALPACA_SECRET } from '$env/static/private';
import type { PageServerLoad } from './$types';

const BASE_URL = 'https://paper-api.alpaca.markets'; // troque para https://api.alpaca.markets se for conta live

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${BASE_URL}/v2/assets`, {
		method: 'GET',
		headers: {
			'APCA-API-KEY-ID': PRIVATE_ALPACA_KEY,
			'APCA-API-SECRET-KEY': PRIVATE_ALPACA_SECRET,
		},
	});

	if (!response.ok) {
		throw new Error(`Erro: ${response.status} ${response.statusText}`);
	}

	const todos = await response.json();

	const ativos = todos.filter(
		(asset: { status: string; tradable: any }) => asset.status === 'active' && asset.tradable,
	);

	const acoes = ativos
		.filter((a: { class: string }) => a.class === 'us_equity')
		.map((a: { symbol: any }) => a.symbol);

	const criptos = ativos
		.filter((a: { class: string }) => a.class === 'crypto')
		.map((a: { symbol: any }) => a.symbol);

	// const simbolos = ativos.map((asset: { symbol: any }) => asset.symbol);

	return {
		criptos,
		acoes,
	};
};
