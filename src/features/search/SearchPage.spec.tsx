import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";
import { theme } from "../../core/theme";
import { SearchPage } from "./SearchPage";

const renderWithProviders = (component: React.ReactNode) => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	return render(
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<BrowserRouter>{component}</BrowserRouter>
			</ThemeProvider>
		</QueryClientProvider>,
	);
};

describe("SearchPage", () => {
	it("deve buscar e renderizar as passagens ao enviar o formulário", async () => {
		renderWithProviders(<SearchPage />);

		const origemInput = screen.getByPlaceholderText(/Ex: São Paulo/i);
		fireEvent.change(origemInput, { target: { value: "São Paulo" } });

		const buscarButton = screen.getByRole("button", { name: /Buscar Passagens/i });
		fireEvent.click(buscarButton);

		expect(screen.getByText(/Buscando as melhores rotas/i)).toBeInTheDocument();

		await waitFor(
			() => {
				const rotasEncontradas = screen.getAllByText(/São Paulo ➔ Rio de Janeiro/i);
				expect(rotasEncontradas.length).toBeGreaterThan(0);
			},
			{ timeout: 2000 },
		);
	});

	it("deve exibir mensagem de vazio quando não encontrar passagens", async () => {
		renderWithProviders(<SearchPage />);

		const origemInput = screen.getByPlaceholderText(/Ex: São Paulo/i);
		fireEvent.change(origemInput, { target: { value: "CidadeInexistente" } });

		const buscarButton = screen.getByRole("button", { name: /Buscar Passagens/i });
		fireEvent.click(buscarButton);

		await waitFor(
			() => {
				expect(screen.getByText(/Nenhuma viagem encontrada para esta origem/i)).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);
	});
});
