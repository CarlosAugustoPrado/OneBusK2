import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";
import { Card } from "../../shared/components/Card";
import { type Viagem } from "../../core/types";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from "../../core/store";

const fetchViagens = async (origem: string): Promise<Viagem[]> => {
	const response = await fetch(`/api/viagens${origem ? `?origem=${origem}` : ""}`);
	if (!response.ok) throw new Error("Erro ao buscar viagens");
	return response.json();
};

export const SearchPage = () => {
	const [origemInput, setOrigemInput] = useState("");
	const [buscaAtiva, setBuscaAtiva] = useState("");

	const navigate = useNavigate();
	const { setViagem } = useBookingStore();

	const {
		data: viagens,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["viagens", buscaAtiva],
		queryFn: () => fetchViagens(buscaAtiva),
	});

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setBuscaAtiva(origemInput);
	};

	return (
		<Container>
			<Card>
				<h2>Para onde você quer ir?</h2>
				<SearchForm onSubmit={handleSearch}>
					<Input
						label="Origem"
						placeholder="Ex: São Paulo"
						value={origemInput}
						onChange={(e) => setOrigemInput(e.target.value)}
					/>
					<Input label="Destino (Opcional no MVP)" placeholder="Ex: Rio de Janeiro" />
					<Input label="Data (Opcional no MVP)" type="date" />
					<Button type="submit" style={{ alignSelf: "flex-end" }}>
						<Search size={20} />
						Buscar Passagens
					</Button>
				</SearchForm>
			</Card>

			<ResultsSection>
				{isLoading && <p>Buscando as melhores rotas para você...</p>}
				{isError && <p>Erro ao buscar viagens. Tente novamente.</p>}

				{viagens?.length === 0 && !isLoading && <p>Nenhuma viagem encontrada para esta origem.</p>}

				<GridList>
					{viagens?.map((viagem) => (
						<ViagemCard key={viagem.id}>
							<div>
								<h3>
									{viagem.origem} ➔ {viagem.destino}
								</h3>
								<p>Data: {new Date(viagem.dataPartida).toLocaleString("pt-BR")}</p>
								<p>Duração: {viagem.duracaoEstimada}</p>
							</div>
							<PriceSection>
								<span className="price">R$ {viagem.precoBase.toFixed(2)}</span>
								<span className="seats">{viagem.assentosDisponiveis} vagas restantes</span>
								<Button
									variant="outline"
									onClick={() => {
										setViagem(viagem);
										navigate("/reserva");
									}}>
									Escolher Assento
								</Button>
							</PriceSection>
						</ViagemCard>
					))}
				</GridList>
			</ResultsSection>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.xl};
`;

const SearchForm = styled.form`
	display: flex;
	gap: ${({ theme }) => theme.spacing.md};
	margin-top: ${({ theme }) => theme.spacing.md};
	flex-wrap: wrap;

	> div {
		flex: 1;
		min-width: 200px;
	}
`;

const ResultsSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.md};
`;

const GridList = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.md};
`;

const ViagemCard = styled(Card)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: ${({ theme }) => theme.spacing.md};

	h3 {
		margin-bottom: 8px;
		color: ${({ theme }) => theme.colors.primary};
	}
	p {
		color: ${({ theme }) => theme.colors.textLight};
		margin-bottom: 4px;
	}
`;

const PriceSection = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 8px;

	.price {
		font-size: 24px;
		font-weight: bold;
		color: ${({ theme }) => theme.colors.text};
	}
	.seats {
		font-size: 14px;
		color: ${({ theme }) => theme.colors.primary};
	}
`;
