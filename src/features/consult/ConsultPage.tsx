import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import styled from "styled-components";
import { Card } from "../../shared/components/Card";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { Search, XCircle } from "lucide-react";

const buscarReserva = async (codigo: string) => {
	const response = await fetch(`/api/reservas/${codigo.toUpperCase()}`);
	if (!response.ok) throw new Error("Reserva não encontrada. Verifique o código.");
	return response.json();
};

const cancelarReserva = async (codigo: string) => {
	const response = await fetch(`/api/reservas/${codigo}`, { method: "DELETE" });
	if (!response.ok) throw new Error("Erro ao cancelar reserva.");
	return response.json();
};

export const ConsultPage = () => {
	const [codigoInput, setCodigoInput] = useState("");

	const fetchMutation = useMutation({
		mutationFn: buscarReserva,
		onError: (error: Error) => alert(error.message),
	});

	const cancelMutation = useMutation({
		mutationFn: cancelarReserva,
		onSuccess: () => {
			alert("Reserva cancelada com sucesso!");

			fetchMutation.mutate(codigoInput);
		},
		onError: (error: Error) => alert(error.message),
	});

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (codigoInput.trim()) fetchMutation.mutate(codigoInput);
	};

	const handleCancel = () => {
		if (confirm("Tem certeza que deseja cancelar esta reserva?")) {
			cancelMutation.mutate(codigoInput);
		}
	};

	const reserva = fetchMutation.data;

	return (
		<Container>
			<Card style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
				<h2 style={{ marginBottom: "16px" }}>Consultar Reserva</h2>
				<p style={{ marginBottom: "24px", color: "#6c757d" }}>
					Digite o código gerado no momento da compra (ex: ONB-1234).
				</p>

				<form onSubmit={handleSearch} style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
					<div style={{ flex: 1 }}>
						<Input
							label="Código da Reserva"
							placeholder="ONB-XXXX"
							value={codigoInput}
							onChange={(e) => setCodigoInput(e.target.value)}
						/>
					</div>
					<Button type="submit" isLoading={fetchMutation.isPending}>
						<Search size={20} /> Buscar
					</Button>
				</form>
			</Card>

			{reserva && (
				<DetailsCard $status={reserva.status}>
					<div className="header">
						<h3>Detalhes da Viagem</h3>
						<span className={`badge ${reserva.status.toLowerCase()}`}>{reserva.status}</span>
					</div>

					<div className="content">
						<p>
							<strong>Passageiro:</strong> {reserva.passageiro.nome}
						</p>
						<p>
							<strong>Origem:</strong> {reserva.viagemDetalhes.origem}
						</p>
						<p>
							<strong>Destino:</strong> {reserva.viagemDetalhes.destino}
						</p>
						<p>
							<strong>Poltrona:</strong> {reserva.assento}
						</p>
					</div>

					{reserva.status === "CONFIRMADA" && (
						<div className="actions">
							<Button
								variant="outline"
								onClick={handleCancel}
								isLoading={cancelMutation.isPending}
								style={{ borderColor: "#dc3545", color: "#dc3545" }}>
								<XCircle size={20} /> Cancelar Passagem
							</Button>
						</div>
					)}
				</DetailsCard>
			)}
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.xl};
`;

const DetailsCard = styled(Card)<{ $status: string }>`
	max-width: 500px;
	margin: 0 auto;
	width: 100%;
	border-top: 4px solid ${({ $status }) => ($status === "CONFIRMADA" ? "#28a745" : "#dc3545")};

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}

	.badge {
		padding: 4px 12px;
		border-radius: 16px;
		font-size: 14px;
		font-weight: bold;
		color: white;

		&.confirmada {
			background-color: #28a745;
		}
		&.cancelada {
			background-color: #dc3545;
		}
	}

	.content p {
		margin-bottom: 12px;
		font-size: 16px;
	}

	.actions {
		margin-top: 24px;
		padding-top: 24px;
		border-top: 1px solid ${({ theme }) => theme.colors.border};
		display: flex;
		justify-content: flex-end;
	}
`;
