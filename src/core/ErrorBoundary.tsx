import { Component, type ErrorInfo, type ReactNode } from "react";
import styled from "styled-components";
import { theme } from "./theme";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	message: string;
}

export class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false, message: "" };

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, message: error.message };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("[ErrorBoundary] Erro capturado:", error, info.componentStack);
	}

	render() {
		if (this.state.hasError) {
			return (
				<Wrapper>
					<Box>
						<Emoji>😵</Emoji>
						<Title>Algo deu errado</Title>
						<Message>
							Ocorreu um erro inesperado. Tente recarregar a página.
						</Message>
						{this.state.message && <Detail>{this.state.message}</Detail>}
						<ReloadButton onClick={() => window.location.reload()}>
							Recarregar Página
						</ReloadButton>
					</Box>
				</Wrapper>
			);
		}
		return this.props.children;
	}
}

const Wrapper = styled.div`
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${theme.colors.background};
	padding: 24px;
`;

const Box = styled.div`
	background: ${theme.colors.surface};
	border-radius: ${theme.radii.large};
	padding: 48px 40px;
	max-width: 480px;
	width: 100%;
	text-align: center;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
	border: 1px solid ${theme.colors.border};
`;

const Emoji = styled.div`
	font-size: 56px;
	margin-bottom: 16px;
`;

const Title = styled.h2`
	color: ${theme.colors.text};
	margin-bottom: 12px;
	font-size: 22px;
`;

const Message = styled.p`
	color: ${theme.colors.textLight};
	margin-bottom: 12px;
	line-height: 1.6;
`;

const Detail = styled.code`
	display: block;
	background: ${theme.colors.background};
	border-radius: ${theme.radii.small};
	padding: 8px 12px;
	font-size: 12px;
	color: ${theme.colors.error};
	margin-bottom: 24px;
	word-break: break-all;
	text-align: left;
`;

const ReloadButton = styled.button`
	background-color: ${theme.colors.primary};
	color: white;
	border: none;
	border-radius: ${theme.radii.medium};
	padding: 12px 24px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: background-color 0.2s;
	&:hover {
		background-color: ${theme.colors.primaryHover};
	}
`;
