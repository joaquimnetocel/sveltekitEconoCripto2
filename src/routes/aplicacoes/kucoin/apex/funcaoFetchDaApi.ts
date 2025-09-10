import type { typePeriodo } from '$lib/kucoin/typePeriodo';
import type { typeSimbolo } from '$lib/kucoin/typeSimbolo';

export async function funcaoFetchDaApi({
	simbolo,
	periodo,
	quantidade,
}: {
	simbolo: typeSimbolo;
	periodo: typePeriodo;
	quantidade: number;
}) {
	const resposta = await fetch(
		`/aplicacoes/kucoin/api?simbolo=${simbolo}&periodo=${periodo}&quantidade=${quantidade}`,
	);
	return await resposta.json();
}
