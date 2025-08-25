import { funcaoFetch } from '$lib/alpaca/funcaoFetch.server';
import { simbolos } from '$lib/alpaca/simbolos';
import type { typePeriodo } from '$lib/alpaca/typePeriodo';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const stringSimbolo = url.searchParams.get('simbolo') ?? 'BTC/USD';
	const simbolosEncontrado = simbolos.find((corrente) => corrente.simbolo === stringSimbolo);
	if (simbolosEncontrado === undefined) {
		throw 'ERRO: SÍMBOLO NÃO ENCONTRADO';
	}
	const periodo = url.searchParams.get('periodo') ?? '1Day';
	const quantidade = url.searchParams.get('quantidade') ?? '30';
	const dados = await funcaoFetch({
		simbolos: simbolosEncontrado,
		periodo: periodo as typePeriodo,
		quantidade: parseInt(quantidade),
		fetch,
	});
	return json(dados);
};
