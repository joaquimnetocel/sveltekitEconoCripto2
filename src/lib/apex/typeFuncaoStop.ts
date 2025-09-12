import type { typeVela } from './typeVela';

export type typeFuncaoStop = ({ velas, agora }: { velas: typeVela[]; agora: number }) => number;
