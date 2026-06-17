import { describe, it, expect } from "vitest";
import { validarCPF } from "./cpf";

describe("validarCPF", () => {
	// ── Casos inválidos estruturais ──────────────────────────────────────────
	it("deve rejeitar CPF com menos de 11 dígitos", () => {
		expect(validarCPF("1234567890")).toBe(false);
	});

	it("deve rejeitar CPF com mais de 11 dígitos", () => {
		expect(validarCPF("123456789012")).toBe(false);
	});

	it("deve rejeitar CPF com todos os dígitos iguais (11111111111)", () => {
		expect(validarCPF("11111111111")).toBe(false);
	});

	it("deve rejeitar CPF com todos os dígitos iguais (00000000000)", () => {
		expect(validarCPF("00000000000")).toBe(false);
	});

	it("deve rejeitar CPF com todos os dígitos iguais (99999999999)", () => {
		expect(validarCPF("99999999999")).toBe(false);
	});

	it("deve rejeitar CPF com dígito verificador incorreto", () => {
		// CPF real com último dígito alterado
		expect(validarCPF("52998224726")).toBe(false);
	});

	it("deve rejeitar CPF completamente aleatório e inválido", () => {
		expect(validarCPF("12345678901")).toBe(false);
	});

	// ── Casos válidos ────────────────────────────────────────────────────────
	it("deve aceitar CPF válido (52998224725)", () => {
		expect(validarCPF("52998224725")).toBe(true);
	});

	it("deve aceitar CPF válido (11144477735)", () => {
		expect(validarCPF("11144477735")).toBe(true);
	});

	it("deve aceitar CPF válido (07ahoma8519620) — com máscara removida", () => {
		// A função remove caracteres não-numéricos internamente
		expect(validarCPF("529.982.247-25")).toBe(true);
	});

	it("deve aceitar CPF válido com espaços (formato não-padrão)", () => {
		expect(validarCPF("529 982 247 25")).toBe(true);
	});
});
