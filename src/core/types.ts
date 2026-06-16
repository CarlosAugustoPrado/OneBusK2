export interface Rota {
	id: string;
	origem: string;
	destino: string;
	duracaoEstimada: string;
}

export interface Viagem {
	id: string;
	rotaId: string;
	origem: string;
	destino: string;
	duracaoEstimada: string;
	dataPartida: string;
	precoBase: number;
	assentosDisponiveis: number;
	assentosOcupados: string[];
}
