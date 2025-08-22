import { RSI } from 'technicalindicators';

export function funcaoRsi({ valores, periodo }: { valores: number[]; periodo: number }) {
	return RSI.calculate({ period: periodo, values: valores });
}
