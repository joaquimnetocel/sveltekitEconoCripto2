import { EMA } from 'technicalindicators';

export function funcaoMediaMovelExponencial({
	valores,
	periodo,
}: {
	valores: number[];
	periodo: number;
}) {
	return EMA.calculate({ period: periodo, values: valores });
}
