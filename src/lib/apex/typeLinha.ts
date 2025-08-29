import type { typePonto } from './typePonto';

export type typeLinha = {
	opcoes: {
		descricao: string;
		cor: string;
	};
	dados: typePonto[];
};

// export type typeLinha = {
// 	descricao: string;
// 	cor: string;
// 	pontos: typePonto[];
// };
