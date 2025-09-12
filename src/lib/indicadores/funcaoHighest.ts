import { Highest } from 'technicalindicators';

export function funcaoHighest({ valores, periodo }: { valores: number[]; periodo: number }) {
	return Highest.calculate({ period: periodo, values: valores });
}
