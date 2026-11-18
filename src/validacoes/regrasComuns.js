/**
 * Regras de Validação Reutilizáveis
 * Funções curtas e puras para evitar duplicação de código entre entidades.
 */

const EXPRESSAO_TELEFONE_PERMITIDO = /^[\d\s()+-]+$/;
const EXPRESSAO_EMAIL_SIMPLES = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizarTexto(valor) {
  return String(valor ?? "").trim();
}

export function extrairApenasDigitos(valor) {
  return normalizarTexto(valor).replace(/\D/g, "");
}

export function formatarTelefoneBrasileiro(valor) {
  const digitos = extrairApenasDigitos(valor);

  if (digitos.length === 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }

  if (digitos.length === 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }

  return normalizarTexto(valor);
}

export function validarTextoObrigatorio(valor, nomeCampo, tamanhoMinimo = 2) {
  const textoLimpo = normalizarTexto(valor);

  if (!textoLimpo) {
    return `O campo "${nomeCampo}" é obrigatório.`;
  }

  if (textoLimpo.length < tamanhoMinimo) {
    return `O campo "${nomeCampo}" deve ter pelo menos ${tamanhoMinimo} caracteres.`;
  }

  return null;
}

export function validarOpcaoObrigatoria(valor, nomeCampo, opcoesValidas) {
  const textoLimpo = normalizarTexto(valor);

  if (!textoLimpo) {
    return `Selecione uma opção para "${nomeCampo}".`;
  }

  if (!opcoesValidas.includes(textoLimpo)) {
    return `A opção selecionada para "${nomeCampo}" é inválida.`;
  }

  return null;
}

export function validarTelefoneBrasileiro(telefone) {
  const textoLimpo = normalizarTexto(telefone);

  if (!textoLimpo) {
    return 'O campo "Telefone" é obrigatório.';
  }

  if (!EXPRESSAO_TELEFONE_PERMITIDO.test(textoLimpo)) {
    return "Informe apenas números, parênteses, espaços ou hífen no telefone.";
  }

  const digitos = extrairApenasDigitos(textoLimpo);

  if (digitos.length !== 10 && digitos.length !== 11) {
    return "Informe um telefone válido com DDD de 2 dígitos: (85) 99999-9999 ou (85) 3333-4444.";
  }

  const ddd = Number(digitos.slice(0, 2));
  if (ddd < 11 || ddd > 99) {
    return "O DDD informado no telefone é inválido (use entre 11 e 99).";
  }

  const primeiroDigitoNumero = Number(digitos[2]);
  if (digitos.length === 11 && primeiroDigitoNumero !== 9) {
    return "Telefones celulares com 9 dígitos devem iniciar com o dígito 9 após o DDD.";
  }

  if (digitos.length === 10 && (primeiroDigitoNumero < 2 || primeiroDigitoNumero > 5)) {
    return "Telefones fixos com 8 dígitos devem iniciar entre 2 e 5 após o DDD.";
  }

  if (/^(\d)\1+$/.test(digitos.slice(2))) {
    return "O número de telefone informado contém uma sequência repetida inválida.";
  }

  return null;
}

export function validarEmailOpcional(email) {
  const textoLimpo = normalizarTexto(email);

  if (!textoLimpo) {
    return null;
  }

  if (!EXPRESSAO_EMAIL_SIMPLES.test(textoLimpo)) {
    return "Informe um endereço de e-mail válido (exemplo: nome@dominio.com).";
  }

  return null;
}

export function validarNumeroObrigatorio(
  valorBruto,
  nomeCampo,
  { minimo, maximo, permitirZero = false }
) {
  const textoLimpo = normalizarTexto(valorBruto).replace(",", ".");

  if (!textoLimpo) {
    return `O campo "${nomeCampo}" é obrigatório.`;
  }

  const numero = Number(textoLimpo);

  if (Number.isNaN(numero) || !Number.isFinite(numero)) {
    return `Informe um valor numérico válido para "${nomeCampo}".`;
  }

  if (!permitirZero && numero <= 0) {
    return `O valor de "${nomeCampo}" deve ser maior que zero.`;
  }

  if (numero < minimo || numero > maximo) {
    return `O valor de "${nomeCampo}" deve estar entre ${minimo} e ${maximo}.`;
  }

  return null;
}
