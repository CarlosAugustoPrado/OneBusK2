import styled, { css } from "styled-components";
import { useBookingStore } from "../../core/store";

interface SeatMapProps {
	assentosOcupados: string[];
	totalAssentos: number;
}

interface SeatRowData {
	row: number;
	left: string[];
	right: string[];
}

const buildRows = (totalAssentos: number): SeatRowData[] => {
	const numRows = Math.ceil(totalAssentos / 4);
	return Array.from({ length: numRows }, (_, i) => {
		const row = i + 1;
		return {
			row,
			left: [`${row}A`, `${row}B`],
			right: [`${row}C`, `${row}D`],
		};
	});
};

export const SeatMap = ({ assentosOcupados, totalAssentos }: SeatMapProps) => {
	const { assentoSelecionado, setAssento } = useBookingStore();
	const rows = buildRows(totalAssentos);

	return (
		<BusContainer>
			<DriverArea>Frente do Ônibus</DriverArea>

			<Grid>
				{rows.map(({ row, left, right }) => (
					<Row key={row}>
						<SeatGroup>
							{left.map((id) => {
								const ocupado = assentosOcupados.includes(id);
								const selecionado = assentoSelecionado === id;
								return (
									<SeatButton
										key={id}
										$ocupado={ocupado}
										$selecionado={selecionado}
										disabled={ocupado}
										onClick={() => setAssento(id)}
										aria-label={`Assento ${id}${ocupado ? " — ocupado" : ""}`}
										title={`Assento ${id}`}>
										{id}
									</SeatButton>
								);
							})}
						</SeatGroup>

						<Corridor aria-hidden="true" />

						<SeatGroup>
							{right.map((id) => {
								const ocupado = assentosOcupados.includes(id);
								const selecionado = assentoSelecionado === id;
								return (
									<SeatButton
										key={id}
										$ocupado={ocupado}
										$selecionado={selecionado}
										disabled={ocupado}
										onClick={() => setAssento(id)}
										aria-label={`Assento ${id}${ocupado ? " — ocupado" : ""}`}
										title={`Assento ${id}`}>
										{id}
									</SeatButton>
								);
							})}
						</SeatGroup>
					</Row>
				))}
			</Grid>

			<Legend>
				<LegendItem>
					<SeatButton as="div" aria-hidden="true" /> Livre
				</LegendItem>
				<LegendItem>
					<SeatButton as="div" $selecionado aria-hidden="true" /> Selecionado
				</LegendItem>
				<LegendItem>
					<SeatButton as="div" $ocupado aria-hidden="true" /> Ocupado
				</LegendItem>
			</Legend>
		</BusContainer>
	);
};

const BusContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.surface};
	border: 2px solid ${({ theme }) => theme.colors.border};
	border-radius: 24px;
	padding: ${({ theme }) => theme.spacing.xl};
	max-width: 350px;
	margin: 0 auto;
`;

const DriverArea = styled.div`
	width: 100%;
	text-align: center;
	padding-bottom: ${({ theme }) => theme.spacing.lg};
	margin-bottom: ${({ theme }) => theme.spacing.lg};
	border-bottom: 2px dashed ${({ theme }) => theme.colors.border};
	color: ${({ theme }) => theme.colors.textLight};
	font-weight: 500;
`;

const Grid = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.sm};
	width: 100%;
`;

const Row = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
`;

const SeatGroup = styled.div`
	display: flex;
	gap: ${({ theme }) => theme.spacing.sm};
`;

const Corridor = styled.div`
	width: 24px;
	flex-shrink: 0;
`;

const SeatButton = styled.button<{ $ocupado?: boolean; $selecionado?: boolean }>`
	width: 44px;
	height: 44px;
	border-radius: 8px 8px 4px 4px;
	border: 2px solid ${({ theme }) => theme.colors.primary};
	background-color: transparent;
	color: ${({ theme }) => theme.colors.text};
	font-weight: bold;
	font-size: 14px;
	cursor: pointer;
	transition: all 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;

	${({ $selecionado, theme }) =>
		$selecionado &&
		css`
			background-color: ${theme.colors.primary};
			color: white;
		`}

	${({ $ocupado, theme }) =>
		$ocupado &&
		css`
			background-color: ${theme.colors.border};
			border-color: ${theme.colors.border};
			color: ${theme.colors.textLight};
			cursor: not-allowed;
		`}

  &:hover:not(:disabled) {
		transform: scale(1.05);
		background-color: ${({ theme, $selecionado }) =>
			$selecionado ? theme.colors.primary : `${theme.colors.primary}1A`};
	}
`;

const Legend = styled.div`
	display: flex;
	gap: ${({ theme }) => theme.spacing.md};
	margin-top: ${({ theme }) => theme.spacing.xl};
	font-size: 14px;
`;

const LegendItem = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;

	${SeatButton} {
		width: 24px;
		height: 24px;
		font-size: 0;
		pointer-events: none;
	}
`;
