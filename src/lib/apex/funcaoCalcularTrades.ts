import { criterios } from './criterios/criterioDoCara';
import { funcaoOperacoes } from './funcaoOperacoes';
import { funcaoTrades } from './funcaoTrades';
import type { typeFuncaoStop } from './typeFuncaoStop';
import type { typePonto } from './typePonto';
import type { typeVela } from './typeVela';

export function funcaoCalcularTrades({
	velas,
	linhas,
}: {
	velas: typeVela[];
	linhas: typePonto[][];
}) {
	if (velas === undefined) throw Error;
	const operacoes = funcaoOperacoes({
		pontosDeCompra: criterios.compras(velas, linhas),
		pontosDeVenda: criterios.vendas(velas, linhas),
		velas,
		funcaoStop: 'stop' in criterios ? criterios.stop : undefined,
	});
	const ultimoFechamento = velas[velas.length - 1].y[3];
	return funcaoTrades(operacoes, ultimoFechamento);
}
