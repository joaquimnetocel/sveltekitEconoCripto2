import type { typePonto } from '$lib/apex/typePonto';

export type typeOperacao = {
	ponto: typePonto;
	tipo: 'enumComprar' | 'enumVender' | 'enumNaoOperar' | 'enumAguardar';
};
