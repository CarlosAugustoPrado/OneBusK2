import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchPage } from "./features/search/SearchPage";
import { BookingPage } from "./features/booking/BookingPage";
import { CheckoutPage } from "./features/checkout/CheckoutPage";
import { ConsultPage } from "./features/consult/ConsultPage";
import styled from "styled-components";
import { ErrorBoundary } from "./core/ErrorBoundary";
import { ToastProvider } from "./shared/components/Toast";
import { ConfirmProvider } from "./shared/components/ConfirmDialog";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
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
	display: flex;
	justify-content: space-between;
	align-items: center;

	h1 {
		color: ${({ theme }) => theme.colors.primary};
	}

	nav {
		display: flex;
		gap: 16px;
	}

	a {
		color: ${({ theme }) => theme.colors.text};
		text-decoration: none;
		font-weight: 500;
		&:hover {
			color: ${({ theme }) => theme.colors.primary};
		}
	}
`;

export default function App() {
	return (
		<ErrorBoundary>
			<QueryClientProvider client={queryClient}>
				<ToastProvider>
					<ConfirmProvider>
						<BrowserRouter>
							<Layout>
								<Header>
									<h1>🚌 OniBus Express</h1>
									<nav>
										<Link to="/">Comprar Passagem</Link>
										<Link to="/consulta">Minhas Reservas</Link>
									</nav>
								</Header>
								<Routes>
									<Route path="/" element={<SearchPage />} />
									<Route path="/reserva" element={<BookingPage />} />
									<Route path="/checkout" element={<CheckoutPage />} />
									<Route path="/consulta" element={<ConsultPage />} />
								</Routes>
							</Layout>
						</BrowserRouter>
					</ConfirmProvider>
				</ToastProvider>
			</QueryClientProvider>
		</ErrorBoundary>
	);
}
