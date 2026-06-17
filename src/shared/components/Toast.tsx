import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import styled, { css, keyframes } from "styled-components";

type ToastType = "success" | "error" | "info";

interface Toast {
	id: number;
	message: string;
	type: ToastType;
}

interface ToastContextValue {
	showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = useCallback((message: string, type: ToastType = "info") => {
		const id = ++nextId;
		setToasts((prev) => [...prev, { id, message, type }]);
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, 4000);
	}, []);

	const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<ToastContainer role="status" aria-live="polite" aria-label="Notificações">
				{toasts.map((toast) => (
					<ToastItem key={toast.id} $type={toast.type}>
						<span>{toast.message}</span>
						<CloseButton onClick={() => dismiss(toast.id)} aria-label="Fechar notificação">
							✕
						</CloseButton>
					</ToastItem>
				))}
			</ToastContainer>
		</ToastContext.Provider>
	);
};

export const useToast = (): ToastContextValue => {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error("useToast deve ser usado dentro de <ToastProvider>");
	return ctx;
};

const slideIn = keyframes`
  from { transform: translateX(110%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`;

const ToastContainer = styled.div`
	position: fixed;
	bottom: 24px;
	right: 24px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	z-index: 9999;
	max-width: 360px;
	width: calc(100vw - 48px);
`;

const ToastItem = styled.div<{ $type: ToastType }>`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 12px;
	padding: 14px 16px;
	border-radius: ${({ theme }) => theme.radii.medium};
	color: white;
	font-size: 14px;
	font-weight: 500;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	animation: ${slideIn} 0.25s ease-out;

	${({ $type, theme }) => {
		switch ($type) {
			case "success":
				return css`background-color: ${theme.colors.success};`;
			case "error":
				return css`background-color: ${theme.colors.error};`;
			default:
				return css`background-color: ${theme.colors.primary};`;
		}
	}}
`;

const CloseButton = styled.button`
	background: none;
	border: none;
	color: rgba(255, 255, 255, 0.8);
	cursor: pointer;
	font-size: 14px;
	padding: 0;
	flex-shrink: 0;
	line-height: 1;
	&:hover {
		color: white;
	}
`;
