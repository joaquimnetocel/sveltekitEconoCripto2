import { SMA } from 'technicalindicators';

export function funcaoMediaMovel({ valores, periodo }: { valores: number[]; periodo: number }) {
	return SMA.calculate({ period: periodo, values: valores });
}
