import { funcaoCriarEstocasticoLento } from '$lib/apex/funcaoCriarEstocasticoLento';
import { funcaoCriarMediaMovel } from '$lib/apex/funcaoCriarMediaMovel';
import { funcaoCriarRsi } from '$lib/apex/funcaoCriarRsi';
import type { typeLinha } from '$lib/apex/typeLinha';
import type { typeVela } from '$lib/apex/typeVela';

function mediaMovel({
	velas,
	estado,
	periodo,
	cores,
}: {
	velas: typeVela[];
	estado: typeLinha[];
	periodo: number[];
	cores: string[];
}) {
	if (velas === undefined) return;
	for (let contador = 0; contador < periodo.length; contador++) {
		estado[contador] = {
			opcoes: {
				descricao: `MÉDIA MÓVEL SIMPLES (${periodo[contador]})`,
				cor: cores[contador],
			},
			dados: funcaoCriarMediaMovel({
				velas,
				periodo: periodo[contador],
			}),
		};
	}
}

function rsi({
	velas,
	estado,
	periodo,
	cores,
}: {
	velas: typeVela[];
	estado: typeLinha[];
	periodo: number[];
	cores: string[];
}) {
	if (velas === undefined) return;
	for (let contador = 0; contador < periodo.length; contador++) {
		estado[contador] = {
			opcoes: {
				cor: cores[contador],
				descricao: `RSI (${periodo[contador]})`,
			},
			dados: funcaoCriarRsi({
				velas,
				periodo: periodo[contador],
			}),
		};
	}
}

function estocastico({ velas, estado }: { velas: typeVela[]; estado: typeLinha[] }) {
	if (velas === undefined) return;
	const k = funcaoCriarEstocasticoLento({
		velas,
	});

	estado[0] = {
		opcoes: {
			cor: 'black',
			descricao: 'ESTOCÁSTICO',
		},
		dados: k,
	};
}

export const estados = {
	mediaMovel,
	rsi,
	estocastico,
};
