import { criterios } from './criterios/criterioDoCara';
import { funcaoOperacoes } from './funcaoOperacoes';
import { funcaoTrades } from './funcaoTrades';
import type { typeFuncaoStop } from './typeFuncaoStop';
import type { typePonto } from './typePonto';
import type { typeVela } from './typeVela';

export function funcaoCalcularTrades({
	velas,
	linhas,
	funcaoStop,
}: {
	velas: typeVela[];
	linhas: typePonto[][];
	funcaoStop?: typeFuncaoStop;
}) {
	if (velas === undefined) throw Error;
	const aa = criterios.compras(velas, linhas);
	console.log(aa.map((ca) => ca.y));
	const operacoes = funcaoOperacoes({
		pontosDeCompra: aa,
		pontosDeVenda: criterios.vendas(velas, linhas),
		velas,
		funcaoStop,
	});
	const ultimoFechamento = velas[velas.length - 1].y[3];
	return funcaoTrades(operacoes, ultimoFechamento);
}
