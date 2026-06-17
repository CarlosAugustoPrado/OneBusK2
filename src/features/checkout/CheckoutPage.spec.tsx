import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";
import { theme } from "../../core/theme";
import { CheckoutPage } from "./CheckoutPage";
import { useBookingStore } from "../../core/store";
import { ToastProvider } from "../../shared/components/Toast";

const renderWithProviders = (component: React.ReactNode) => {
	const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return render(
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<ToastProvider>
					<BrowserRouter>{component}</BrowserRouter>
				</ToastProvider>
			</ThemeProvider>
		</QueryClientProvider>,
	);
};

describe("CheckoutPage", () => {
	beforeEach(() => {
		useBookingStore.getState().limparReserva();
	});

	it("deve exibir tela de erro e botão de voltar se não houver viagem selecionada", () => {
		renderWithProviders(<CheckoutPage />);
		expect(screen.getByText(/Ops, dados incompletos/i)).toBeInTheDocument();
	});

	it("deve validar formulário e bloquear CPF inválido", async () => {
		const user = userEvent.setup();

		useBookingStore.setState({
			viagemSelecionada: {
				id: "v1",
				rotaId: "1",
				origem: "SP",
				destino: "RJ",
				dataPartida: "2026-06-20T08:00:00Z",
				precoBase: 100,
				assentosDisponiveis: 10,
				totalAssentos: 40,
				assentosOcupados: [],
				duracaoEstimada: "6h",
			},
			assentoSelecionado: "1A",
		});

		renderWithProviders(<CheckoutPage />);

		const submitButton = screen.getByRole("button", { name: /Confirmar Compra/i });
		await user.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(/O nome deve ter pelo menos 3 caracteres/i)).toBeInTheDocument();
		});

		const cpfInput = screen.getByPlaceholderText("00000000000");
		await user.type(cpfInput, "11111111111");
		await user.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(/CPF inválido/i)).toBeInTheDocument();
		});
	});

	it("deve exibir resumo da compra com os dados da viagem selecionada", () => {
		useBookingStore.setState({
			viagemSelecionada: {
				id: "v1",
				rotaId: "1",
				origem: "São Paulo",
				destino: "Rio de Janeiro",
				dataPartida: "2026-06-20T08:00:00Z",
				precoBase: 120.5,
				assentosDisponiveis: 37,
				totalAssentos: 40,
				assentosOcupados: [],
				duracaoEstimada: "6h",
			},
			assentoSelecionado: "2B",
		});

		renderWithProviders(<CheckoutPage />);

		expect(screen.getByText(/São Paulo/i)).toBeInTheDocument();
		expect(screen.getByText(/Rio de Janeiro/i)).toBeInTheDocument();
		expect(screen.getByText(/2B/i)).toBeInTheDocument();
		expect(screen.getByText(/120.50/)).toBeInTheDocument();
	});
});
