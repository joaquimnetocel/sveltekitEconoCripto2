import { urlAcoes } from './urlAcoes';
import { urlCripto } from './urlCripto';

export const simbolos = [
	{
		simbolo: 'BTC/USD',
		url: urlCripto,
	},
	{
		simbolo: 'ETH/USD',
		url: urlCripto,
	},
	{
		simbolo: 'TSLA',
		url: urlAcoes,
	},
] as const;
