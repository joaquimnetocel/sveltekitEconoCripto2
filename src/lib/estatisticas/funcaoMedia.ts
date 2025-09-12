export function funcaoMedia(valores: number[]) {
	return (
		valores.reduce((acumulador: number, corrente: number) => acumulador + corrente, 0) /
		valores.length
	);
}
