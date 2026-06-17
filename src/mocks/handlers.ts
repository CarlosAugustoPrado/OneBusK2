import { http, HttpResponse, delay } from "msw";
import { rotas, viagens } from "./data";
import { type Passageiro } from "../core/types";

interface ReservaMock {
	codigoReserva: string;
	viagemId: string;
	assento: string;
	passageiro: Passageiro;
	status: "CONFIRMADA" | "CANCELADA";
	viagemDetalhes: (typeof viagens)[0];
}

const bancoReservas: ReservaMock[] = [];

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
		const data = url.searchParams.get("data"); // formato: YYYY-MM-DD
		let resultados = viagens;

		if (origem) {
			resultados = resultados.filter((v) =>
				v.origem.toLowerCase().includes(origem.toLowerCase()),
			);
		}
		if (destino) {
			resultados = resultados.filter((v) =>
				v.destino.toLowerCase().includes(destino.toLowerCase()),
			);
		}
		if (data) {
			resultados = resultados.filter((v) => v.dataPartida.startsWith(data));
		}

		return HttpResponse.json(resultados);
	}),

	http.post("/api/reservas", async ({ request }) => {
		await delay(1200);

		const body = (await request.json()) as { viagemId: string; assento: string; passageiro: Passageiro };

		const viagem = viagens.find((v) => v.id === body.viagemId);
		if (!viagem) {
			return HttpResponse.json({ erro: "Viagem não encontrada" }, { status: 404 });
		}

		if (viagem.assentosOcupados.includes(body.assento)) {
			return HttpResponse.json({ erro: "Assento já ocupado" }, { status: 400 });
		}

		viagem.assentosOcupados.push(body.assento);

		const codigoReserva = `ONB-${Math.floor(Math.random() * 10000)}`;

		bancoReservas.push({
			codigoReserva,
			viagemId: viagem.id,
			assento: body.assento,
			passageiro: body.passageiro,
			status: "CONFIRMADA",
			viagemDetalhes: viagem,
		});

		return HttpResponse.json(
			{
				mensagem: "Reserva confirmada com sucesso!",
				codigoReserva: codigoReserva,
				status: "CONFIRMADA",
			},
			{ status: 201 },
		);
	}),

	// 4. GET /api/reservas/:codigo (Buscar Reserva Bônus)
	http.get("/api/reservas/:codigo", async ({ params }) => {
		await delay(800);
		// Transforma para maiúsculo para evitar erro de digitação do usuário
		const codigoParam = String(params.codigo).toUpperCase();
		const reserva = bancoReservas.find((r) => r.codigoReserva === codigoParam);

		if (!reserva) {
			return new HttpResponse(null, { status: 404, statusText: "Reserva não encontrada" });
		}

		return HttpResponse.json(reserva);
	}),

	// 5. DELETE /api/reservas/:codigo (Cancelar Reserva Bônus)
	http.delete("/api/reservas/:codigo", async ({ params }) => {
		await delay(1000);
		const codigoParam = String(params.codigo).toUpperCase();
		const reservaIndex = bancoReservas.findIndex((r) => r.codigoReserva === codigoParam);

		if (reservaIndex === -1) {
			return new HttpResponse(null, { status: 404, statusText: "Reserva não encontrada" });
		}

		const reserva = bancoReservas[reservaIndex];

		if (reserva.status === "CANCELADA") {
			return HttpResponse.json({ erro: "Reserva já está cancelada" }, { status: 400 });
		}

		// Libera o assento para outras pessoas comprarem
		const viagem = viagens.find((v) => v.id === reserva.viagemId);
		if (viagem) {
			viagem.assentosOcupados = viagem.assentosOcupados.filter((a) => a !== reserva.assento);
		}

		// Atualiza o status na nossa memória
		bancoReservas[reservaIndex].status = "CANCELADA";

		return HttpResponse.json({ mensagem: "Reserva cancelada com sucesso" });
	}),
];
