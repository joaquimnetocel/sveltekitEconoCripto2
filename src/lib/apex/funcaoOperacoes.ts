import type { typeOperacao } from '$lib/apex/typeOperacao';
import type { typePonto } from '$lib/apex/typePonto';

export const funcaoOperacoes = function (
	pontosDeCompra: typePonto[],
	pontosDeVenda: typePonto[],
): typeOperacao[] {
	let pesquisandoPor: 'enumCompra' | 'enumVenda' = 'enumCompra';
	return pontosDeCompra.map((pontoDeCompraCorrente, contador): typeOperacao => {
		const pontodeVendaCorrente = pontosDeVenda[contador];
		const objetoNaoOperar: typeOperacao = {
			ponto: {
				x: pontoDeCompraCorrente.x,
				y: null,
			},
			tipo: 'enumNaoOperar',
		};
		if (pontoDeCompraCorrente.y === null && pontodeVendaCorrente.y === null) {
			return objetoNaoOperar;
		}
		if (pesquisandoPor === 'enumCompra') {
			if (pontoDeCompraCorrente.y === null) {
				return objetoNaoOperar;
			}
			pesquisandoPor = 'enumVenda';
			return {
				tipo: 'enumComprar',
				ponto: pontoDeCompraCorrente,
			};
		}
		if (pesquisandoPor === 'enumVenda') {
			if (pontodeVendaCorrente.y === null) {
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
