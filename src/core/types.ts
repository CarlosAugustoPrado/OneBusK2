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
	totalAssentos: number;
	assentosOcupados: string[];
}

export interface Passageiro {
	nome: string;
	email: string;
	cpf: string;
}

export interface Reserva {
	codigoReserva: string;
	viagemId: string;
	assento: string;
	passageiro: Passageiro;
	status: "CONFIRMADA" | "CANCELADA";
	viagemDetalhes: Viagem;
}

export interface CriarReservaResponse {
	codigoReserva: string;
	status: string;
	mensagem: string;
}

export interface CancelarReservaResponse {
	mensagem: string;
}
