import type { typeVela } from '$lib/apex/typeVela';
import { ATR } from 'technicalindicators';

export function funcaoAverageTrueRangeApex({
	velas,
	periodo,
}: {
	velas: typeVela[];
	periodo: number;
}) {
	return ATR.calculate({
		close: velas.map((corrente) => corrente.y[3]),
		high: velas.map((corrente) => corrente.y[1]),
		low: velas.map((corrente) => corrente.y[2]),
		period: periodo,
	});
}
