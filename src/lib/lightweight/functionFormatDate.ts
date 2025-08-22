export const functionFormatDate = (timestamp: number) =>
	new Date(timestamp * 1000).toISOString().split('T')[0];
