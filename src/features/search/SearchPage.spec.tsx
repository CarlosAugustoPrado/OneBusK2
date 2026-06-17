import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
		const user = userEvent.setup();
		renderWithProviders(<SearchPage />);

		const origemInput = screen.getByPlaceholderText(/Ex: São Paulo/i);
		await user.type(origemInput, "São Paulo");

		const buscarButton = screen.getByRole("button", { name: /Buscar Passagens/i });
		await user.click(buscarButton);

		expect(screen.getByText(/Buscando as melhores rotas/i)).toBeInTheDocument();

		await waitFor(
			() => {
				const rotasEncontradas = screen.getAllByText(/São Paulo ➔ Rio de Janeiro/i);
				expect(rotasEncontradas.length).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
	});

	it("deve exibir mensagem de vazio quando não encontrar passagens", async () => {
		const user = userEvent.setup();
		renderWithProviders(<SearchPage />);

		const origemInput = screen.getByPlaceholderText(/Ex: São Paulo/i);
		await user.type(origemInput, "CidadeInexistente");

		const buscarButton = screen.getByRole("button", { name: /Buscar Passagens/i });
		await user.click(buscarButton);

		await waitFor(
			() => {
				expect(screen.getByText(/Nenhuma viagem encontrada para esta origem/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
	});

	it("deve filtrar por destino quando preenchido", async () => {
		const user = userEvent.setup();
		renderWithProviders(<SearchPage />);

		const destinoInput = screen.getByPlaceholderText(/Ex: Rio de Janeiro/i);
		await user.type(destinoInput, "Florianópolis");

		await user.click(screen.getByRole("button", { name: /Buscar Passagens/i }));

		await waitFor(
			() => {
				expect(screen.getByText(/Curitiba ➔ Florianópolis/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
	});
});
