import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchPage } from "./features/search/SearchPage";
import styled from "styled-components";

// Criamos a instância do React Query (gerenciador de cache do lado cliente)
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false, // Evita requisições desnecessárias ao trocar de aba
			retry: 1,
		},
	},
});

const Layout = styled.main`
	max-width: 1000px;
	margin: 0 auto;
	padding: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.header`
	margin-bottom: ${({ theme }) => theme.spacing.xl};
	h1 {
		color: ${({ theme }) => theme.colors.primary};
	}
`;

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Layout>
					<Header>
						<h1>🚌 OniBus Express</h1>
					</Header>
					<Routes>
						<Route path="/" element={<SearchPage />} />
						{/* Adicionaremos as próximas rotas aqui depois */}
						<Route path="/checkout" element={<div>Checkout (Em breve)</div>} />
					</Routes>
				</Layout>
			</BrowserRouter>
		</QueryClientProvider>
	);
}
