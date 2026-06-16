import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";
import { theme } from "../../core/theme";
import { CheckoutPage } from "./CheckoutPage";
import { useBookingStore } from "../../core/store";

const renderWithProviders = (component: React.ReactNode) => {
	const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return render(
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<BrowserRouter>{component}</BrowserRouter>
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
		useBookingStore.setState({
			viagemSelecionada: {
				id: "v1",
				rotaId: "1",
				origem: "SP",
				destino: "RJ",
				dataPartida: "2026-06-20T08:00:00Z",
				precoBase: 100,
				assentosDisponiveis: 10,
				assentosOcupados: [],
				duracaoEstimada: "6h",
			},
			assentoSelecionado: "1A",
		});

		renderWithProviders(<CheckoutPage />);

		const submitButton = screen.getByRole("button", { name: /Confirmar Compra/i });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(/O nome deve ter pelo menos 3 caracteres/i)).toBeInTheDocument();
		});

		const cpfInput = screen.getByPlaceholderText("00000000000");
		fireEvent.change(cpfInput, { target: { value: "11111111111" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(/CPF inválido/i)).toBeInTheDocument();
		});
	});
});
