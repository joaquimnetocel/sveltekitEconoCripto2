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
	operacoes.forEach((currentTrade, numberCounter) => {
		currentTrade.ponto.x;
		if (currentTrade.tipo === 'enumNaoOperar') {
			if (numberCounter !== operacoes.length - 1) {
				return;
			}
		}
		if (currentTrade.tipo === 'enumComprar' && currentTrade.ponto.y !== null) {
			if (numberCounter === operacoes.length - 1) {
				arrayTradeResults.push({
					dataDaCompra: currentTrade.ponto.x,
					precoDeCompra: numberBuyPrice,
					dataDaVenda: currentTrade.ponto.x,
					precoDeVenda: currentTrade.ponto.y,
					lucro: 0,
					enumGanhoOuPerda: 'enumNaoRealizado',
					fatorDeLucro: 1,
					duracao: 0,
				});
			}
			dateBuy = currentTrade.ponto.x;
			numberBuyPrice = currentTrade.ponto.y;
			numberBuyCounter = numberCounter;
			return;
		}
		if (currentTrade.tipo === 'enumVender' && currentTrade.ponto.y !== null) {
			const numberProfit = currentTrade.ponto.y - numberBuyPrice;
			arrayTradeResults.push({
				dataDaCompra: dateBuy,
				precoDeCompra: numberBuyPrice,
				dataDaVenda: currentTrade.ponto.x,
				precoDeVenda: currentTrade.ponto.y,
				lucro: numberProfit,
				enumGanhoOuPerda: numberProfit > 0 ? 'enumGanho' : 'enumPerda',
				fatorDeLucro: currentTrade.ponto.y / numberBuyPrice,
				duracao: numberCounter - numberBuyCounter,
			});
		}
		if (currentTrade.tipo === 'enumAguardar') {
			const numberProfit = ultimoFechamento - numberBuyPrice;
			arrayTradeResults.push({
				dataDaCompra: dateBuy,
				precoDeCompra: numberBuyPrice,
				dataDaVenda: currentTrade.ponto.x,
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
