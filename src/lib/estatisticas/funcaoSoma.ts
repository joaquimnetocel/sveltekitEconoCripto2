export function funcaoSoma(valores: number[]) {
	return valores.reduce((acumulador: number, corrente: number) => acumulador + corrente, 0);
}
