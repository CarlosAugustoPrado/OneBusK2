import { http, HttpResponse, delay } from "msw";
import { rotas, viagens } from "./data";

export const handlers = [
	http.get("/api/rotas", async () => {
		await delay(800);
		return HttpResponse.json(rotas);
	}),

	http.get("/api/viagens", async ({ request }) => {
		await delay(1000);

		const url = new URL(request.url);
		const origem = url.searchParams.get("origem");
		const destino = url.searchParams.get("destino");
		let resultados = viagens;

		if (origem) {
			resultados = resultados.filter((v) => v.origem.toLowerCase().includes(origem.toLowerCase()));
		}

		if (destino) {
			resultados = resultados.filter((v) => v.destino.toLowerCase().includes(destino.toLowerCase()));
		}

		return HttpResponse.json(resultados);
	}),

	http.post("/api/reservas", async ({ request }) => {
		await delay(1200);

		const body = (await request.json()) as { viagemId: string; assento: string; passageiro: string };

		const viagem = viagens.find((v) => v.id === body.viagemId);
		if (viagem && viagem.assentosOcupados.includes(body.assento)) {
			return HttpResponse.json({ erro: "Assento já ocupado" }, { status: 400 });
		}

		return HttpResponse.json(
			{
				mensagem: "Reserva confirmada com sucesso!",
				codigoReserva: `ONB-${Math.floor(Math.random() * 10000)}`,
				status: "CONFIRMADA",
			},
			{ status: 201 },
		);
	}),
];
