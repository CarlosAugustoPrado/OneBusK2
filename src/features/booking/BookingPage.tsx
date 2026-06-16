import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useBookingStore } from "../../core/store";
import { Card } from "../../shared/components/Card";
import { Button } from "../../shared/components/Button";
import { SeatMap } from "./SeatMap";

export const BookingPage = () => {
	const navigate = useNavigate();
	const { viagemSelecionada, assentoSelecionado } = useBookingStore();

	if (!viagemSelecionada) {
		return (
			<Container>
				<Card>
					<h2>Nenhuma viagem selecionada.</h2>
					<Button onClick={() => navigate("/")}>Voltar para busca</Button>
				</Card>
			</Container>
		);
	}

	const handleProsseguir = () => {
		if (assentoSelecionado) {
			navigate("/checkout");
		}
	};

	return (
		<Container>
			<DetalhesSection>
				<Card>
					<h2>Resumo da Viagem</h2>
					<div style={{ marginTop: "16px" }}>
						<p>
							<strong>Origem:</strong> {viagemSelecionada.origem}
						</p>
						<p>
							<strong>Destino:</strong> {viagemSelecionada.destino}
						</p>
						<p>
							<strong>Data:</strong> {new Date(viagemSelecionada.dataPartida).toLocaleString("pt-BR")}
						</p>
						<p>
							<strong>Preço:</strong> R$ {viagemSelecionada.precoBase.toFixed(2)}
						</p>
					</div>
				</Card>

				<Card>
					<h3>Sua Seleção</h3>
					{assentoSelecionado ? (
						<p>
							Você escolheu a poltrona <strong>{assentoSelecionado}</strong>.
						</p>
					) : (
						<p>Por favor, selecione uma poltrona no mapa ao lado.</p>
					)}

					<Button
						style={{ marginTop: "24px", width: "100%" }}
						disabled={!assentoSelecionado}
						onClick={handleProsseguir}>
						Ir para Pagamento
					</Button>
				</Card>
			</DetalhesSection>

			<MapaSection>
				<Card>
					<h2 style={{ textAlign: "center", marginBottom: "16px" }}>Escolha seu Assento</h2>
					<SeatMap assentosOcupados={viagemSelecionada.assentosOcupados || []} totalAssentos={40} />
				</Card>
			</MapaSection>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	gap: ${({ theme }) => theme.spacing.xl};
	align-items: flex-start;
	flex-wrap: wrap;
`;
const DetalhesSection = styled.div`
	flex: 1;
	min-width: 300px;
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.md};
`;
const MapaSection = styled.div`
	flex: 1;
	min-width: 350px;
`;
