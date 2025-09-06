import { criterios } from './criterios/criterioRsi';
import { funcaoOperacoes } from './funcaoOperacoes';
import { funcaoTrades } from './funcaoTrades';
import type { typePonto } from './typePonto';
import type { typeVela } from './typeVela';

export function funcaoCalcularTrades({
	velas,
	pontos,
}: {
	velas: typeVela[];
	pontos: typePonto[][];
}) {
	if (velas === undefined) throw Error;
	const possiveisCompras = criterios.compras(velas, pontos);
	const possiveisVendas = criterios.vendas(velas, pontos);
	const operacoes = funcaoOperacoes(possiveisCompras, possiveisVendas);
	const ultimoFechamento = velas[velas.length - 1].y[3];
	const aa = funcaoTrades(operacoes, ultimoFechamento);
	return aa;
}
