import { PRIVATE_ALPACA_KEY, PRIVATE_ALPACA_SECRET } from '$env/static/private';
import type { typeDado } from './typeDado';
import type { typePeriodo } from './typePeriodo';
import type { typeSimbolos } from './typeSimbolos';

export async function funcaoFetch({
	simbolos,
	periodo,
	quantidade,
	fetch,
}: {
	simbolos: typeSimbolos;
	periodo: typePeriodo;
	quantidade: number;
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}) {
	let url = '';
	if (periodo === '1Day') {
		const now = new Date();
		const startDate = new Date(now);
		startDate.setDate(now.getDate() - quantidade);
		const startISO = startDate.toISOString();
		url = `${simbolos.url}${encodeURIComponent(simbolos.simbolo)}&timeframe=${periodo}&start=${encodeURIComponent(startISO)}&sort=asc`;
	} else if (periodo === '1Min') {
		const now = new Date();
		now.setMinutes(now.getMinutes() - quantidade);
		const timestamp = now.toISOString().split('.')[0] + 'Z'; // Formato correto
		url = `${simbolos.url}${encodeURIComponent(simbolos.simbolo)}&timeframe=${periodo}&start=${timestamp}`;
	} else if (periodo === '5Min') {
		const now = new Date();
		now.setMinutes(now.getMinutes() - quantidade * 5);
		const timestamp = now.toISOString().split('.')[0] + 'Z'; // Formato correto
		url = `${simbolos.url}${encodeURIComponent(simbolos.simbolo)}&timeframe=${periodo}&start=${timestamp}`;
	} else if (periodo === '15Min') {
		const now = new Date();
		now.setMinutes(now.getMinutes() - quantidade * 15);
		const timestamp = now.toISOString().split('.')[0] + 'Z'; // Formato correto
		url = `${simbolos.url}${encodeURIComponent(simbolos.simbolo)}&timeframe=${periodo}&start=${timestamp}`;
	} else if (periodo === '1Hour') {
		const now = new Date();
		now.setHours(now.getHours() - quantidade);
		const timestamp = now.toISOString().split('.')[0] + 'Z'; // Formato correto
		url = `${simbolos.url}${encodeURIComponent(simbolos.simbolo)}&timeframe=${periodo}&start=${timestamp}`;
	}
	const headers = {
		'Apca-Api-Key-Id': PRIVATE_ALPACA_KEY,
		'Apca-Api-Secret-Key': PRIVATE_ALPACA_SECRET,
	};
	const result = await fetch(url, { headers });
	const json = await result.json();
	const velas = json.bars[simbolos.simbolo] as typeDado[];
	return velas;
}
