import { simbolos } from './simbolos';

const simbolo = simbolos.map((current) => current.simbolo);

export type typeSimbolo = (typeof simbolo)[number];
