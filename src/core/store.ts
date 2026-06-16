import { create } from "zustand";
import { type Viagem } from "./types";

interface BookingStore {
	viagemSelecionada: Viagem | null;
	assentoSelecionado: string | null;
	setViagem: (viagem: Viagem) => void;
	setAssento: (assento: string) => void;
	limparReserva: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
	viagemSelecionada: null,
	assentoSelecionado: null,

	setViagem: (viagem) => set({ viagemSelecionada: viagem, assentoSelecionado: null }),

	setAssento: (assento) => set({ assentoSelecionado: assento }),

	limparReserva: () => set({ viagemSelecionada: null, assentoSelecionado: null }),
}));
