export function funcaoProduto(valores: number[]) {
	return valores.reduce((acumulador: number, corrente: number) => acumulador * corrente, 1);
}
