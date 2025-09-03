import type { typeOperacao } from '$lib/apex/typeOperacao';
import type { typeTrade } from '$lib/apex/typeTrade';

export const funcaoTrades = function (
	operacoes: typeOperacao[],
	parLastPrice: number,
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
					dateBuy: currentTrade.ponto.x,
					numberBuyPrice: numberBuyPrice,
					dateSell: currentTrade.ponto.x,
					numberSellPrice: currentTrade.ponto.y,
					numberProfit: 0,
					enumGainOrLoss: 'enumNotFinished',
					numberProfitFactor: 1,
					numberDuration: 0,
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
				dateBuy: dateBuy,
				numberBuyPrice: numberBuyPrice,
				dateSell: currentTrade.ponto.x,
				numberSellPrice: currentTrade.ponto.y,
				numberProfit: numberProfit,
				enumGainOrLoss: numberProfit > 0 ? 'enumGain' : 'enumLoss',
				numberProfitFactor: currentTrade.ponto.y / numberBuyPrice,
				numberDuration: numberCounter - numberBuyCounter,
			});
		}
		if (currentTrade.tipo === 'enumAguardar') {
			const numberProfit = parLastPrice - numberBuyPrice;
			arrayTradeResults.push({
				dateBuy: dateBuy,
				numberBuyPrice: numberBuyPrice,
				dateSell: currentTrade.ponto.x,
				numberSellPrice: parLastPrice,
				numberProfit: numberProfit,
				enumGainOrLoss: 'enumNotFinished',
				numberProfitFactor: parLastPrice / numberBuyPrice,
				numberDuration: numberCounter - numberBuyCounter,
			});
		}
	});
	return arrayTradeResults;
};
