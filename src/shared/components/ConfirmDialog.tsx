import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import styled from "styled-components";
import { Button } from "./Button";

interface ConfirmOptions {
	title: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
}

interface ConfirmContextValue {
	confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
	const [options, setOptions] = useState<ConfirmOptions | null>(null);
	const resolverRef = useRef<((value: boolean) => void) | null>(null);

	const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
		setOptions(opts);
		return new Promise((resolve) => {
			resolverRef.current = resolve;
		});
	}, []);

	const handleChoice = (result: boolean) => {
		setOptions(null);
		resolverRef.current?.(result);
	};

	return (
		<ConfirmContext.Provider value={{ confirm }}>
			{children}
			{options && (
				<Overlay role="dialog" aria-modal="true" aria-labelledby="confirm-title">
					<DialogBox>
						<DialogTitle id="confirm-title">{options.title}</DialogTitle>
						<DialogMessage>{options.message}</DialogMessage>
						<DialogActions>
							<Button variant="outline" onClick={() => handleChoice(false)}>
								{options.cancelLabel ?? "Cancelar"}
							</Button>
							<DangerButton onClick={() => handleChoice(true)}>
								{options.confirmLabel ?? "Confirmar"}
							</DangerButton>
						</DialogActions>
					</DialogBox>
				</Overlay>
			)}
		</ConfirmContext.Provider>
	);
};

export const useConfirm = (): ConfirmContextValue => {
	const ctx = useContext(ConfirmContext);
	if (!ctx) throw new Error("useConfirm deve ser usado dentro de <ConfirmProvider>");
	return ctx;
};

const Overlay = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10000;
	padding: 16px;
`;

const DialogBox = styled.div`
	background: ${({ theme }) => theme.colors.surface};
	border-radius: ${({ theme }) => theme.radii.large};
	padding: ${({ theme }) => theme.spacing.xl};
	max-width: 420px;
	width: 100%;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`;

const DialogTitle = styled.h3`
	color: ${({ theme }) => theme.colors.text};
	margin-bottom: ${({ theme }) => theme.spacing.sm};
	font-size: 18px;
`;

const DialogMessage = styled.p`
	color: ${({ theme }) => theme.colors.textLight};
	margin-bottom: ${({ theme }) => theme.spacing.xl};
	line-height: 1.5;
`;

const DialogActions = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: ${({ theme }) => theme.spacing.sm};
`;

const DangerButton = styled(Button)`
	background-color: ${({ theme }) => theme.colors.error};
	&:hover:not(:disabled) {
		background-color: #b02a37;
	}
`;
