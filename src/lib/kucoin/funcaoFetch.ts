function intervaloEmSegundos(intervalo: string) {
	const n = parseInt(intervalo);
	if (intervalo.endsWith('min')) return n * 60;
	if (intervalo.endsWith('hour')) return n * 3600;
	if (intervalo.endsWith('day')) return n * 86400;
	if (intervalo.endsWith('week')) return n * 604800;
	if (intervalo.endsWith('month')) return n * 2592000; // aproximado
	throw new Error('Intervalo desconhecido');
}

export async function funcaoFetch({
	simbolo,
	intervalo,
	quantidade,
	fetch,
}: {
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
	simbolo: string;
	intervalo:
		| '3min'
		| '5min'
		| '15min'
		| '30min'
		| '1hour'
		| '2hour'
		| '4hour'
		| '6hour'
		| '8hour'
		| '12hour'
		| '1day'
		| '1week'
		| '1month';
	quantidade: number;
}) {
	const velas = [];
	let restantes = quantidade;

	const agora = Math.floor(Date.now() / 1000); // timestamp atual em segundos
	let endAt = agora;

	const MAXIMO_POR_REQUISICAO = 300;

	while (restantes > 0) {
		const limit = Math.min(restantes, MAXIMO_POR_REQUISICAO);
		const startAt = endAt - limit * intervaloEmSegundos(intervalo);

		const url = `https://api.kucoin.com/api/v1/market/candles?symbol=${symbol}&type=${interval}&startAt=${startAt}&endAt=${endAt}`;

		const res = await fetch(url);
		const data = await res.json();

		if (!data.data || data.data.length === 0) break;

		velas.unshift(...data.data); // adiciona no início para manter a ordem cronológica
		restantes -= data.data.length;
		endAt = startAt - 1; // ajusta o próximo intervalo
	}

	return velas;
}

// // Exemplo de uso:
// (async () => {
// 	const velas = await pegarVelas('BTC-USDT', '1min', 500);
// 	console.log(velas.length); // 500
// 	console.log(velas[0]); // vela mais antiga
// 	console.log(velas[velas.length - 1]); // vela mais recente
// })();
