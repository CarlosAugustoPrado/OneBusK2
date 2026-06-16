import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import styled from "styled-components";

import { useBookingStore } from "../../core/store";
import { validarCPF } from "../../shared/utils/cpf";
import { Card } from "../../shared/components/Card";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

const checkoutSchema = z.object({
	nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	email: z.string().email("E-mail inválido"),
	cpf: z.string().refine(validarCPF, "CPF inválido (dígito verificador incorreto)"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CriarReservaPayload {
	viagemId: string;
	assento: string;
	passageiro: CheckoutFormData;
}

const criarReserva = async (payload: CriarReservaPayload) => {
	const response = await fetch("/api/reservas", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.erro || "Erro ao criar reserva");
	}
	return response.json();
};

export const CheckoutPage = () => {
	const navigate = useNavigate();
	const { viagemSelecionada, assentoSelecionado, limparReserva } = useBookingStore();

	const [ticketGerado, setTicketGerado] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CheckoutFormData>({
		resolver: zodResolver(checkoutSchema),
	});

	const mutation = useMutation({
		mutationFn: criarReserva,
		onSuccess: (data) => {
			setTicketGerado(data.codigoReserva);
			limparReserva();
		},
		onError: (error: Error) => {
			alert(`Falha na reserva: ${error.message}`);
		},
	});

	if (ticketGerado) {
		return (
			<Container style={{ justifyContent: "center" }}>
				<SuccessCard>
					<h2>🎉 Passagem Comprada!</h2>
					<p>Sua reserva foi confirmada com sucesso.</p>
					<div className="ticket">
						<span>Código da Reserva:</span>
						<strong>{ticketGerado}</strong>
					</div>
					<Button onClick={() => navigate("/")}>Comprar Nova Passagem</Button>
				</SuccessCard>
			</Container>
		);
	}

	if (!viagemSelecionada || !assentoSelecionado) {
		return (
			<Container>
				<Card>
					<h2>Ops, dados incompletos.</h2>
					<Button onClick={() => navigate("/")}>Voltar para o início</Button>
				</Card>
			</Container>
		);
	}

	const onSubmit = (data: CheckoutFormData) => {
		mutation.mutate({
			viagemId: viagemSelecionada.id,
			assento: assentoSelecionado,
			passageiro: data,
		});
	};

	return (
		<Container>
			<FormSection>
				<Card>
					<h2 style={{ marginBottom: "24px" }}>Dados do Passageiro</h2>
					<Form onSubmit={handleSubmit(onSubmit)}>
						<Input
							label="Nome Completo"
							placeholder="Digite seu nome"
							{...register("nome")}
							error={errors.nome?.message}
						/>
						<Input
							label="E-mail"
							type="email"
							placeholder="seu.email@exemplo.com"
							{...register("email")}
							error={errors.email?.message}
						/>
						<Input
							label="CPF (Somente números)"
							placeholder="00000000000"
							maxLength={11}
							{...register("cpf")}
							error={errors.cpf?.message}
						/>

						<Button type="submit" isLoading={mutation.isPending} style={{ marginTop: "16px" }}>
							Confirmar Compra
						</Button>
					</Form>
				</Card>
			</FormSection>

			<ResumoSection>
				<Card>
					<h2 style={{ marginBottom: "16px" }}>Resumo da Compra</h2>
					<ResumeDetails>
						<p>
							<strong>De:</strong> {viagemSelecionada.origem}
						</p>
						<p>
							<strong>Para:</strong> {viagemSelecionada.destino}
						</p>
						<p>
							<strong>Data:</strong> {new Date(viagemSelecionada.dataPartida).toLocaleString("pt-BR")}
						</p>
						<p>
							<strong>Poltrona:</strong> {assentoSelecionado}
						</p>
						<hr style={{ margin: "16px 0", borderColor: "#dee2e6" }} />
						<h3>Total: R$ {viagemSelecionada.precoBase.toFixed(2)}</h3>
					</ResumeDetails>
				</Card>
			</ResumoSection>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	gap: ${({ theme }) => theme.spacing.xl};
	align-items: flex-start;
	flex-wrap: wrap;
`;

const FormSection = styled.div`
	flex: 2;
	min-width: 300px;
`;

const ResumoSection = styled.div`
	flex: 1;
	min-width: 250px;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.md};
`;

const ResumeDetails = styled.div`
	p {
		margin-bottom: 8px;
		color: ${({ theme }) => theme.colors.text};
	}
	h3 {
		color: ${({ theme }) => theme.colors.primary};
		font-size: 24px;
	}
`;

const SuccessCard = styled(Card)`
	text-align: center;
	max-width: 500px;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.lg};

	h2 {
		color: #28a745;
	}

	.ticket {
		background-color: ${({ theme }) => theme.colors.background};
		padding: ${({ theme }) => theme.spacing.lg};
		border: 2px dashed ${({ theme }) => theme.colors.primary};
		border-radius: ${({ theme }) => theme.radii.medium};
		display: flex;
		flex-direction: column;
		gap: 8px;

		strong {
			font-size: 32px;
			color: ${({ theme }) => theme.colors.primary};
			letter-spacing: 2px;
		}
	}
`;
