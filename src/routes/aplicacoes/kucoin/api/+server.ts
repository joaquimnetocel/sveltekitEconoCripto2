import { funcaoFetch } from '$lib/kucoin/funcaoFetch.server';
import type { typePeriodo } from '$lib/kucoin/typePeriodo';
import type { typeSimbolo } from '$lib/kucoin/typeSimbolo';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const simbolo = (url.searchParams.get('simbolo') ?? 'BTC-USDT') as typeSimbolo;
	const periodo = (url.searchParams.get('periodo') ?? '1day') as typePeriodo;
	const quantidade = url.searchParams.get('quantidade') ?? '30';
	const dados = await funcaoFetch({
		simbolo,
		periodo,
		quantidade: parseInt(quantidade),
		fetch,
	});
	return json(dados);
};
