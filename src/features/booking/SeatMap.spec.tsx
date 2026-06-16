import { render, screen, fireEvent } from "@testing-library/react";
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

		const assentoOcupado = screen.getByRole("button", { name: /Assento 1A/i });
		expect(assentoOcupado).toBeDisabled();
	});

	it("deve permitir selecionar um assento livre e salvar no estado global", () => {
		renderWithTheme(<SeatMap assentosOcupados={[]} totalAssentos={40} />);

		const assentoLivre = screen.getByRole("button", { name: /Assento 2C/i });
		fireEvent.click(assentoLivre);
		expect(useBookingStore.getState().assentoSelecionado).toBe("2C");
	});
});
