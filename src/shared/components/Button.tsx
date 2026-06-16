import { type ButtonHTMLAttributes } from "react";
import styled, { css } from "styled-components";
import { Spinner } from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "outline";
	isLoading?: boolean;
}

export const Button = ({ children, variant = "primary", isLoading, disabled, ...props }: ButtonProps) => {
	return (
		<StyledButton $variant={variant} disabled={disabled || isLoading} aria-busy={isLoading} {...props}>
			{isLoading ? <Spinner size={20} /> : children}
		</StyledButton>
	);
};

const StyledButton = styled.button<{ $variant: "primary" | "secondary" | "outline" }>`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${({ theme }) => theme.spacing.sm};
	padding: 12px 24px;
	border-radius: ${({ theme }) => theme.radii.medium};
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	border: none;

	${({ $variant, theme }) => {
		switch ($variant) {
			case "primary":
				return css`
					background-color: ${theme.colors.primary};
					color: white;
					&:hover:not(:disabled) {
						background-color: ${theme.colors.primaryHover};
					}
				`;
			case "outline":
				return css`
					background-color: transparent;
					color: ${theme.colors.primary};
					border: 2px solid ${theme.colors.primary};
					&:hover:not(:disabled) {
						background-color: ${theme.colors.primary}1A;
					}
				`;
			// Adicione outras variantes conforme necessário
		}
	}}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
`;
