import { criterios } from './criterios/criterioMediaMovel120';
import { funcaoOperacoes } from './funcaoOperacoes';
import { funcaoTrades } from './funcaoTrades';
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
	const possiveisCompras = criterios.compras(velas, linhas);
	const possiveisVendas = criterios.vendas(velas, linhas);
	const operacoes = funcaoOperacoes(possiveisCompras, possiveisVendas);
	const ultimoFechamento = velas[velas.length - 1].y[3];
	return funcaoTrades(operacoes, ultimoFechamento);
}
