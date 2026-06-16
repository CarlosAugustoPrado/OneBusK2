export const rotas = [
	{ id: "1", origem: "São Paulo", destino: "Rio de Janeiro", duracaoEstimada: "6h" },
	{ id: "2", origem: "Curitiba", destino: "Florianópolis", duracaoEstimada: "4h 30m" },
	{ id: "3", origem: "Belo Horizonte", destino: "São Paulo", duracaoEstimada: "8h" },
];

export const viagens = [
	{
		id: "v1",
		rotaId: "1",
		origem: "São Paulo",
		destino: "Rio de Janeiro",
		dataPartida: "2026-06-20T08:00:00Z",
		precoBase: 120.5,
		assentosDisponiveis: 40,
		assentosOcupados: ["1A", "1B", "4C"],
		duracaoEstimada: "6h",
	},
	{
		id: "v2",
		rotaId: "1",
		origem: "São Paulo",
		destino: "Rio de Janeiro",
		dataPartida: "2026-06-20T14:00:00Z",
		precoBase: 95.0,
		assentosDisponiveis: 42,
		assentosOcupados: ["2A"],
		duracaoEstimada: "6h",
	},
];
