import { SMA, Stochastic } from 'technicalindicators';

interface SlowStochasticParams {
	high: number[];
	low: number[];
	close: number[];
	period?: number; // período para %K rápido
	signalPeriod?: number; // período para %D rápido
	slowKPeriod?: number; // suavização da %K rápida
	slowDPeriod?: number; // suavização da %K lenta
}

interface SlowStochasticResult {
	k: number;
	d: number;
}

/**
 * Calcula o Estocástico Lento (Slow Stochastic) a partir dos dados OHLC.
 */
export function funcaoEstocasticoLento({
	high,
	low,
	close,
	period = 14,
	signalPeriod = 3,
	slowKPeriod = 3,
	slowDPeriod = 3,
}: SlowStochasticParams): SlowStochasticResult[] {
	// 1. Calcular estocástico rápido (%K e %D)
	const kdFast = Stochastic.calculate({
		high,
		low,
		close,
		period,
		signalPeriod,
	});

	// 2. Extrair somente a linha %K rápida
	const kFast = kdFast.map((item) => item.k);

	// 3. Aplicar SMA sobre %K rápida para obter %K Lento
	const kSlow = SMA.calculate({ period: slowKPeriod, values: kFast });

	// 4. Aplicar SMA sobre %K Lento para obter %D Lento
	const dSlow = SMA.calculate({ period: slowDPeriod, values: kSlow });

	// 5. Alinhar índices (mantendo apenas valores válidos)
	const result: SlowStochasticResult[] = [];
	for (let i = 0; i < dSlow.length; i++) {
		result.push({
			k: kSlow[i],
			d: dSlow[i],
		});
	}

	return result;
}

// const resultSlow = funcaoEstocasticoLento({
//   high: [...],     // array de máximas
//   low: [...],      // array de mínimas
//   close: [...],    // array de fechamentos
// });
