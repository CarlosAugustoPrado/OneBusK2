import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Spinner = styled.div<{ size?: number }>`
	border: 3px solid rgba(0, 0, 0, 0.1);
	border-top-color: currentColor;
	border-radius: 50%;
	width: ${({ size }) => size || 24}px;
	height: ${({ size }) => size || 24}px;
	animation: ${spin} 1s linear infinite;
`;
