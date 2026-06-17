import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { Card } from "../../shared/components/Card";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { Search, XCircle } from "lucide-react";
import { useToast } from "../../shared/components/Toast";
import { useConfirm } from "../../shared/components/ConfirmDialog";
import { type Reserva, type CancelarReservaResponse } from "../../core/types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const buscarReserva = async (codigo: string): Promise<Reserva> => {
	const response = await fetch(`${API_BASE}/api/reservas/${codigo.toUpperCase()}`);
	if (!response.ok) throw new Error("Reserva não encontrada. Verifique o código.");
	return response.json();
};

const cancelarReserva = async (codigo: string): Promise<CancelarReservaResponse> => {
	const response = await fetch(`${API_BASE}/api/reservas/${codigo.toUpperCase()}`, {
		method: "DELETE",
	});
	if (!response.ok) throw new Error("Erro ao cancelar reserva.");
	return response.json();
};

export const ConsultPage = () => {
	const [codigoInput, setCodigoInput] = useState("");
	const [codigoBusca, setCodigoBusca] = useState<string | null>(null);

	const { showToast } = useToast();
	const { confirm } = useConfirm();
	const queryClient = useQueryClient();

	// useQuery com enabled: false — busca apenas quando codigoBusca é definido
	const {
		data: reserva,
		isLoading: isFetching,
		isError,
		error,
	} = useQuery<Reserva, Error>({
		queryKey: ["reserva", codigoBusca],
		queryFn: () => buscarReserva(codigoBusca!),
		enabled: !!codigoBusca,
		retry: false,
	});

	const cancelMutation = useMutation({
		mutationFn: cancelarReserva,
		onSuccess: () => {
			showToast("Reserva cancelada com sucesso!", "success");
			// Invalida o cache da reserva para refazer o GET automaticamente
			queryClient.invalidateQueries({ queryKey: ["reserva", codigoBusca] });
		},
		onError: (err: Error) => {
			showToast(err.message, "error");
		},
	});

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (codigoInput.trim()) {
			setCodigoBusca(codigoInput.trim());
		}
	};

	const handleCancel = async () => {
		const confirmed = await confirm({
			title: "Cancelar Passagem",
			message: "Tem certeza que deseja cancelar esta reserva? O assento será liberado para outras pessoas.",
			confirmLabel: "Sim, cancelar",
			cancelLabel: "Voltar",
		});
		if (confirmed && codigoBusca) {
			cancelMutation.mutate(codigoBusca);
		}
	};

	return (
		<Container>
			<Card style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
				<h2 style={{ marginBottom: "16px" }}>Consultar Reserva</h2>
				<p style={{ marginBottom: "24px", color: "inherit" }}>
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
					<Button type="submit" isLoading={isFetching}>
						<Search size={20} /> Buscar
					</Button>
				</form>

				{isError && (
					<ErrorMessage role="alert">{error?.message ?? "Reserva não encontrada."}</ErrorMessage>
				)}
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
							<strong>Data:</strong>{" "}
							{new Date(reserva.viagemDetalhes.dataPartida).toLocaleString("pt-BR")}
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
								style={{ borderColor: "currentcolor" }}
								aria-label="Cancelar esta passagem">
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

const ErrorMessage = styled.p`
	margin-top: ${({ theme }) => theme.spacing.md};
	color: ${({ theme }) => theme.colors.error};
	font-size: 14px;
`;

const DetailsCard = styled(Card)<{ $status: string }>`
	max-width: 500px;
	margin: 0 auto;
	width: 100%;
	border-top: 4px solid
		${({ $status, theme }) => ($status === "CONFIRMADA" ? theme.colors.success : theme.colors.error)};

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
			background-color: ${({ theme }) => theme.colors.success};
		}
		&.cancelada {
			background-color: ${({ theme }) => theme.colors.error};
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
		color: ${({ theme }) => theme.colors.error};
	}
`;
