export type typeTrade = {
	dataDaCompra: Date;
	dataDaVenda: Date;
	precoDeCompra: number;
	precoDeVenda: number;
	lucro: number;
	fatorDeLucro: number;
	enumGanhoOuPerda: 'enumGanho' | 'enumPerda' | 'enumNaoRealizado';
	duracao: number;
};
