import type { typeOperacao } from '$lib/apex/typeOperacao';
import type { typePonto } from '$lib/apex/typePonto';
import type { typeFuncaoStop } from './typeFuncaoStop';
import type { typeVela } from './typeVela';

export const funcaoOperacoes = function ({
	pontosDeCompra,
	pontosDeVenda,
	velas,
	funcaoStop,
}: {
	pontosDeCompra: typePonto[];
	pontosDeVenda: typePonto[];
	velas?: typeVela[];
	funcaoStop?: typeFuncaoStop;
}): typeOperacao[] {
	let pesquisandoPor: 'enumCompra' | 'enumVenda' = 'enumCompra';
	let stopAtual: number = 12345;
	return pontosDeCompra.map((pontoDeCompraCorrente, contador): typeOperacao => {
		const pontodeVendaCorrente = pontosDeVenda[contador];
		const deveComprar = pontoDeCompraCorrente.y !== null;
		const deveVender = pontodeVendaCorrente.y !== null;
		const objetoNaoOperar: typeOperacao = {
			ponto: {
				x: pontoDeCompraCorrente.x,
				y: null,
			},
			tipo: 'enumNaoOperar',
		};

		if (pesquisandoPor === 'enumCompra') {
			if (!deveComprar) {
				return objetoNaoOperar;
			}
			if (funcaoStop && velas) {
				stopAtual = funcaoStop({
					velas,
					agora: contador,
				});

				// console.log(pontoDeCompraCorrente.x);
			}
			pesquisandoPor = 'enumVenda';
			return {
				tipo: 'enumComprar',
				ponto: pontoDeCompraCorrente,
			};
		}

		if (pesquisandoPor === 'enumVenda') {
			// console.log(pontodeVendaCorrente.x);

			if (velas && funcaoStop) {
				if (velas[contador].y[3] < stopAtual) {
					pesquisandoPor = 'enumCompra';
					return {
						tipo: 'enumVender',
						ponto: {
							// AQUI FOI NECESSÁRIO RESTITUIR O PREÇO A PARTIR DA VELA, POIS NÃO É UM PONTO DE VENDA OFICIAL (A VENDA SE DEVE AO STOP)
							x: velas[contador].x,
							y: velas[contador].y[3],
						},
					};
				}
			}

			if (!deveVender) {
				if (contador === pontosDeCompra.length - 1) {
					return {
						tipo: 'enumAguardar',
						ponto: {
							x: pontoDeCompraCorrente.x,
							y: null,
						},
					};
				}
				return objetoNaoOperar;
			}
			pesquisandoPor = 'enumCompra';
			return {
				tipo: 'enumVender',
				ponto: pontodeVendaCorrente,
			};
		}
		return objetoNaoOperar; // NUNCA CHEGA AQUI
	});
};
