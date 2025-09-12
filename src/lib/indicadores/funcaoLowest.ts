import { Lowest } from 'technicalindicators';

export function funcaoLowest({ valores, periodo }: { valores: number[]; periodo: number }) {
	return Lowest.calculate({ period: periodo, values: valores });
}
