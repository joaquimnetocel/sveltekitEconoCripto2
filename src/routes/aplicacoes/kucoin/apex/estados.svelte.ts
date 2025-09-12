import { funcaoCriarEstocasticoLento } from '$lib/apex/funcaoCriarEstocasticoLento';
import { funcaoCriarHighest } from '$lib/apex/funcaoCriarHighest';
import { funcaoCriarLowest } from '$lib/apex/funcaoCriarLowest';
import { funcaoCriarMediaMovel } from '$lib/apex/funcaoCriarMediaMovel';
import { funcaoCriarRsi } from '$lib/apex/funcaoCriarRsi';
import type { typeLinha } from '$lib/apex/typeLinha';
import type { typeVela } from '$lib/apex/typeVela';

let mediasmoveis = $state<typeLinha[]>([]);
let rsi = $state<typeLinha[]>([]);
let estocastico = $state<typeLinha[]>([]);
let lowest = $state<typeLinha[]>([]);
let highest = $state<typeLinha[]>([]);

function funcaoMediaMovel({
	velas,
	periodo,
	cores,
}: {
	velas: typeVela[];
	periodo: number[];
	cores: string[];
}) {
	if (velas === undefined) return;
	for (let contador = 0; contador < periodo.length; contador++) {
		mediasmoveis[contador] = {
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

function funcaoRsi({
	velas,
	periodo,
	cores,
}: {
	velas: typeVela[];
	periodo: number[];
	cores: string[];
}) {
	if (velas === undefined) return;
	for (let contador = 0; contador < periodo.length; contador++) {
		rsi[contador] = {
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

function funcaoHighest({
	velas,
	periodo,
	cores,
}: {
	velas: typeVela[];
	periodo: number[];
	cores: string[];
}) {
	if (velas === undefined) return;
	for (let contador = 0; contador < periodo.length; contador++) {
		highest[contador] = {
			opcoes: {
				cor: cores[contador],
				descricao: `HIGHEST (${periodo[contador]})`,
			},
			dados: funcaoCriarHighest({
				velas,
				periodo: periodo[contador],
			}),
		};
	}
}

function funcaoLowest({
	velas,
	periodo,
	cores,
}: {
	velas: typeVela[];
	periodo: number[];
	cores: string[];
}) {
	if (velas === undefined) return;
	for (let contador = 0; contador < periodo.length; contador++) {
		lowest[contador] = {
			opcoes: {
				cor: cores[contador],
				descricao: `Lowest (${periodo[contador]})`,
			},
			dados: funcaoCriarLowest({
				velas,
				periodo: periodo[contador],
			}),
		};
	}
}

function funcaoEstocastico({ velas }: { velas: typeVela[] }) {
	if (velas === undefined) return;
	const k = funcaoCriarEstocasticoLento({
		velas,
	});

	estocastico[0] = {
		opcoes: {
			cor: 'black',
			descricao: 'ESTOCÁSTICO',
		},
		dados: k,
	};
}

export const estados = {
	funcaoMediaMovel,
	funcaoRsi,
	funcaoEstocastico,
	funcaoHighest,
	funcaoLowest,
	mediasmoveis,
	rsi,
	estocastico,
	highest,
	lowest,
};
