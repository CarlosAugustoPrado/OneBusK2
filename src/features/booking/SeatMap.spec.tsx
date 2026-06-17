import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { ThemeProvider } from "styled-components";
import { theme } from "../../core/theme";
import { SeatMap } from "./SeatMap";
import { useBookingStore } from "../../core/store";

const renderWithTheme = (component: React.ReactNode) => {
	return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("SeatMap", () => {
	beforeEach(() => {
		useBookingStore.getState().limparReserva();
	});

	it("deve desabilitar assentos que já estão ocupados", () => {
		renderWithTheme(<SeatMap assentosOcupados={["1A", "1B"]} totalAssentos={40} />);

		const assentoOcupado = screen.getByRole("button", { name: /Assento 1A — ocupado/i });
		expect(assentoOcupado).toBeDisabled();
	});

	it("deve permitir selecionar um assento livre e salvar no estado global", async () => {
		const user = userEvent.setup();
		renderWithTheme(<SeatMap assentosOcupados={[]} totalAssentos={40} />);

		const assentoLivre = screen.getByRole("button", { name: /Assento 2C/i });
		await user.click(assentoLivre);

		expect(useBookingStore.getState().assentoSelecionado).toBe("2C");
	});

	it("não deve permitir selecionar um assento ocupado", async () => {
		const user = userEvent.setup();
		renderWithTheme(<SeatMap assentosOcupados={["3A"]} totalAssentos={40} />);

		const assentoOcupado = screen.getByRole("button", { name: /Assento 3A — ocupado/i });
		await user.click(assentoOcupado);

		expect(useBookingStore.getState().assentoSelecionado).toBeNull();
	});

	it("deve renderizar o número correto de assentos baseado em totalAssentos", () => {
		renderWithTheme(<SeatMap assentosOcupados={[]} totalAssentos={8} />);

		// 8 assentos = 2 fileiras × 4 assentos (A, B, C, D)
		const buttons = screen.getAllByRole("button");
		expect(buttons).toHaveLength(8);
	});

	it("deve exibir a legenda com as três categorias de assento", () => {
		renderWithTheme(<SeatMap assentosOcupados={[]} totalAssentos={40} />);

		expect(screen.getByText("Livre")).toBeInTheDocument();
		expect(screen.getByText("Selecionado")).toBeInTheDocument();
		expect(screen.getByText("Ocupado")).toBeInTheDocument();
	});
});
