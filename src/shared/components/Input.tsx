import { forwardRef, type InputHTMLAttributes } from "react";
import styled from "styled-components";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, id, ...props }, ref) => {
	const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

	return (
		<InputWrapper>
			<Label htmlFor={inputId}>{label}</Label>
			<StyledInput
				id={inputId}
				ref={ref}
				$hasError={!!error}
				aria-invalid={!!error}
				aria-describedby={error ? `${inputId}-error` : undefined}
				{...props}
			/>
			{error && <ErrorMessage id={`${inputId}-error`}>{error}</ErrorMessage>}
		</InputWrapper>
	);
});

Input.displayName = "Input";

const InputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.sm};
	width: 100%;
`;

const Label = styled.label`
	font-weight: 500;
	color: ${({ theme }) => theme.colors.text};
`;

const StyledInput = styled.input<{ $hasError: boolean }>`
	padding: 12px;
	border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.colors.error : theme.colors.border)};
	border-radius: ${({ theme }) => theme.radii.small};
	font-size: 16px;
	transition: border-color 0.2s;

	&:focus {
		outline: none;
		border-color: ${({ theme, $hasError }) => ($hasError ? theme.colors.error : theme.colors.primary)};
		box-shadow: 0 0 0 2px ${({ theme, $hasError }) => ($hasError ? theme.colors.error : theme.colors.primary)}33;
	}
`;

const ErrorMessage = styled.span`
	color: ${({ theme }) => theme.colors.error};
	font-size: 14px;
`;
