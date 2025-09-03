export type typeTrade = {
	dateBuy: Date;
	dateSell: Date;
	numberBuyPrice: number;
	numberSellPrice: number;
	numberProfit: number;
	numberProfitFactor: number;
	enumGainOrLoss: 'enumGain' | 'enumLoss' | 'enumNotFinished';
	numberDuration: number;
};
