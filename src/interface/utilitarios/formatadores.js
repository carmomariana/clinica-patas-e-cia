/**
 * Formatadores de Exibição e Máscaras de Entrada
 * Funções curtas para apresentar dados de forma amigável na interface.
 */

export function aplicarMascaraTelefone(valorDigitado) {
  const possuiCaracteresNaoPermitidos = /[^\d\s()+-]/.test(valorDigitado);
  if (possuiCaracteresNaoPermitidos) {
    return valorDigitado;
  }

  const digitos = String(valorDigitado ?? "").replace(/\D/g, "");
  if (digitos.length === 0) {
    return "";
  }

  if (digitos.length > 11) {
    return valorDigitado;
  }

  if (digitos.length <= 2) {
    return `(${digitos}`;
  }

  if (digitos.length <= 6) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  }

  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }

  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export function formatarIdadeAnimal(idadeAnos) {
  const idade = Number(idadeAnos);

  if (idade === 0) {
    return "Filhote (< 1 ano)";
  }

  if (idade === 1) {
    return "1 ano";
  }

  return `${idade.toLocaleString("pt-BR")} anos`;
}

export function formatarPesoAnimal(pesoKg) {
  const peso = Number(pesoKg);
  return `${peso.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} kg`;
}

export function obterVarianteEspecie(especie) {
  const mapaEspecies = {
    Cachorro: "especie-cachorro",
    Gato: "especie-gato",
    Ave: "especie-ave",
    Roedor: "especie-roedor",
    Réptil: "especie-reptil",
  };

  return mapaEspecies[especie] || "especie-outro";
}
