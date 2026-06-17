import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";
import { theme } from "../../core/theme";
import { ConsultPage } from "./ConsultPage";
import { ToastProvider } from "../../shared/components/Toast";
import { ConfirmProvider } from "../../shared/components/ConfirmDialog";

const renderWithProviders = (component: React.ReactNode) => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return render(
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<ToastProvider>
					<ConfirmProvider>
						<BrowserRouter>{component}</BrowserRouter>
					</ConfirmProvider>
				</ToastProvider>
			</ThemeProvider>
		</QueryClientProvider>,
	);
};

describe("ConsultPage", () => {
	it("deve exibir mensagem de erro quando o código de reserva não é encontrado", async () => {
		const user = userEvent.setup();
		renderWithProviders(<ConsultPage />);

		const input = screen.getByPlaceholderText("ONB-XXXX");
		await user.type(input, "ONB-9999");

		const buscarBtn = screen.getByRole("button", { name: /Buscar/i });
		await user.click(buscarBtn);

		await waitFor(
			() => {
				expect(screen.getByRole("alert")).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
	});

	it("deve exibir os detalhes da reserva quando o código é válido", async () => {
		const user = userEvent.setup();

		// Primeiro, cria uma reserva via MSW para ter um código válido
		const createRes = await fetch("/api/reservas", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				viagemId: "v1",
				assento: "3C",
				passageiro: { nome: "João Silva", email: "joao@teste.com", cpf: "52998224725" },
			}),
		});
		const { codigoReserva } = await createRes.json();

		renderWithProviders(<ConsultPage />);

		const input = screen.getByPlaceholderText("ONB-XXXX");
		await user.type(input, codigoReserva);

		const buscarBtn = screen.getByRole("button", { name: /Buscar/i });
		await user.click(buscarBtn);

		await waitFor(
			() => {
				expect(screen.getByText(/Detalhes da Viagem/i)).toBeInTheDocument();
				expect(screen.getByText(/João Silva/i)).toBeInTheDocument();
				expect(screen.getByText(/CONFIRMADA/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
	});

	it("deve exibir botão de cancelar apenas quando a reserva está CONFIRMADA", async () => {
		const user = userEvent.setup();

		const createRes = await fetch("/api/reservas", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				viagemId: "v2",
				assento: "5A",
				passageiro: { nome: "Maria Santos", email: "maria@teste.com", cpf: "11144477735" },
			}),
		});
		const { codigoReserva } = await createRes.json();

		renderWithProviders(<ConsultPage />);

		const input = screen.getByPlaceholderText("ONB-XXXX");
		await user.type(input, codigoReserva);
		await user.click(screen.getByRole("button", { name: /Buscar/i }));

		await waitFor(
			() => {
				expect(screen.getByRole("button", { name: /Cancelar esta passagem/i })).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
	});
});
