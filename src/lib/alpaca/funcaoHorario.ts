import { PRIVATE_ALPACA_KEY, PRIVATE_ALPACA_SECRET, PRIVATE_ALPACA_URL } from '$env/static/private';

export async function funcaoHorarioAlpaca({
	fetch,
}: {
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}) {
	const resposta = await fetch(PRIVATE_ALPACA_URL, {
		headers: {
			'APCA-API-KEY-ID': PRIVATE_ALPACA_KEY,
			'APCA-API-SECRET-KEY': PRIVATE_ALPACA_SECRET,
		},
	});
	const data = await resposta.json();
	const hora = new Date(data.timestamp);

	return hora;
}
