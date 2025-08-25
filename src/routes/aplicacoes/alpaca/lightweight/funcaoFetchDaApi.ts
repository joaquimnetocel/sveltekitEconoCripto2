export async function funcaoFetchDaApi({
	simbolo,
	periodo,
	quantidade,
}: {
	simbolo: string;
	periodo: string;
	quantidade: number;
}) {
	// const resposta = await fetch(`?/?simbolo=${simbolo}&periodo=${periodo}&quantidade=${quantidade}`);
	const resposta = await fetch(
		`/aplicacoes/alpaca/api?simbolo=${simbolo}&periodo=${periodo}&quantidade=${quantidade}`,
	);
	return await resposta.json();
}
