const aux = ['1Day', '5Min', '15Min', '1Hour', '1Min'] as const;
type tipo = (typeof aux)[number];

export const periodos: tipo[] = [...aux]; // array mutável com valores fixos
