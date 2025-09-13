import type { typeOperacao } from '$lib/apex/typeOperacao';
import type { typeTrade } from '$lib/apex/typeTrade';

export const funcaoTrades = function (
	operacoes: typeOperacao[],
	ultimoFechamento: number,
): typeTrade[] {
	let dateBuy: Date;
	let numberBuyPrice: number;
	let numberBuyCounter: number;
	const arrayTradeResults: typeTrade[] = [];
	operacoes.forEach((operacaoCorrente, numberCounter) => {
		// console.log(operacaoCorrente.tipo);
		if (operacaoCorrente.tipo === 'enumNaoOperar') {
			if (numberCounter !== operacoes.length - 1) {
				return;
			}
		}
		if (operacaoCorrente.tipo === 'enumComprar' && operacaoCorrente.ponto.y !== null) {
			if (numberCounter === operacoes.length - 1) {
				arrayTradeResults.push({
					dataDaCompra: operacaoCorrente.ponto.x,
					precoDeCompra: numberBuyPrice,
					dataDaVenda: operacaoCorrente.ponto.x,
					precoDeVenda: operacaoCorrente.ponto.y,
					lucro: 0,
					enumGanhoOuPerda: 'enumNaoRealizado',
					fatorDeLucro: 1,
					duracao: 0,
				});
			}
			dateBuy = operacaoCorrente.ponto.x;
			numberBuyPrice = operacaoCorrente.ponto.y;
			numberBuyCounter = numberCounter;
			return;
		}
		if (operacaoCorrente.tipo === 'enumVender' && operacaoCorrente.ponto.y !== null) {
			const numberProfit = operacaoCorrente.ponto.y - numberBuyPrice;
			arrayTradeResults.push({
				dataDaCompra: dateBuy,
				precoDeCompra: numberBuyPrice,
				dataDaVenda: operacaoCorrente.ponto.x,
				precoDeVenda: operacaoCorrente.ponto.y,
				lucro: numberProfit,
				enumGanhoOuPerda: numberProfit > 0 ? 'enumGanho' : 'enumPerda',
				fatorDeLucro: operacaoCorrente.ponto.y / numberBuyPrice,
				duracao: numberCounter - numberBuyCounter,
			});
		}
		if (operacaoCorrente.tipo === 'enumAguardar') {
			const numberProfit = ultimoFechamento - numberBuyPrice;
			arrayTradeResults.push({
				dataDaCompra: dateBuy,
				precoDeCompra: numberBuyPrice,
				dataDaVenda: operacaoCorrente.ponto.x,
				precoDeVenda: ultimoFechamento,
				lucro: numberProfit,
				enumGanhoOuPerda: 'enumNaoRealizado',
				fatorDeLucro: ultimoFechamento / numberBuyPrice,
				duracao: numberCounter - numberBuyCounter,
			});
		}
	});
	return arrayTradeResults;
};
