import styled from "styled-components";

export const Card = styled.div`
	background-color: ${({ theme }) => theme.colors.surface};
	border-radius: ${({ theme }) => theme.radii.large};
	padding: ${({ theme }) => theme.spacing.lg};
	box-shadow:
		0 4px 6px rgba(0, 0, 0, 0.05),
		0 1px 3px rgba(0, 0, 0, 0.1);
	border: 1px solid ${({ theme }) => theme.colors.border};
`;
