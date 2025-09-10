import type { typePeriodo } from '$lib/kucoin/typePeriodo';
import type { typeSimbolo } from '$lib/kucoin/typeSimbolo';

function intervaloEmSegundos(periodo: string) {
	const n = parseInt(periodo);
	if (periodo.endsWith('min')) return n * 60;
	if (periodo.endsWith('hour')) return n * 3600;
	if (periodo.endsWith('day')) return n * 86400;
	if (periodo.endsWith('week')) return n * 604800;
	if (periodo.endsWith('month')) return n * 2592000; // aproximado
	throw new Error('Intervalo desconhecido');
}

export async function funcaoFetch({
	simbolo,
	periodo,
	quantidade,
	fetch,
}: {
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
	simbolo: typeSimbolo;
	periodo: typePeriodo;
	quantidade: number;
}) {
	const velas = [];
	let restantes = quantidade;

	const agora = Math.floor(Date.now() / 1000); // timestamp atual em segundos
	let endAt = agora;

	const MAXIMO_POR_REQUISICAO = 300;

	while (restantes > 0) {
		const limit = Math.min(restantes, MAXIMO_POR_REQUISICAO);
		const startAt = endAt - limit * intervaloEmSegundos(periodo);

		const url = `https://api.kucoin.com/api/v1/market/candles?symbol=${simbolo}&type=${periodo}&startAt=${startAt}&endAt=${endAt}`;
		const res = await fetch(url);
		const data = await res.json();

		if (!data.data || data.data.length === 0) break;

		velas.push(...data.data); // mantém a ordem cronológica
		restantes -= data.data.length;
		endAt = startAt; // sem lacunas
	}

	return velas.reverse(); // já está em ordem cronológica
}

// // Exemplo de uso:
// (async () => {
// 	const velas = await pegarVelas('BTC-USDT', '1min', 500);
// 	console.log(velas.length); // 500
// 	console.log(velas[0]); // vela mais antiga
// 	console.log(velas[velas.length - 1]); // vela mais recente
// })();
