export async function funcaoHorario({
	fetch,
}: {
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}) {
	const resposta = await fetch('https://api.kucoin.com/api/v1/timestamp', {
		method: 'GET',
		redirect: 'follow',
	});
	const data = await resposta.json();
	const hora = new Date(data.data);

	return hora;
}
