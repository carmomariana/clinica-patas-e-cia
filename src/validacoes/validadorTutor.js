/**
 * Validação da Entidade Tutor
 * Garante campos obrigatórios e formato válido de telefone e e-mail.
 */

import {
  formatarTelefoneBrasileiro,
  normalizarTexto,
  validarEmailOpcional,
  validarTelefoneBrasileiro,
  validarTextoObrigatorio,
} from "./regrasComuns.js";

function registrarErroSeHouver(mapaErros, campo, mensagemErro) {
  if (mensagemErro) {
    mapaErros[campo] = mensagemErro;
  }
}

export function validarDadosTutor(dadosBrutos = {}) {
  const errosPorCampo = {};

  registrarErroSeHouver(
    errosPorCampo,
    "nome",
    validarTextoObrigatorio(dadosBrutos.nome, "Nome completo", 3)
  );

  registrarErroSeHouver(
    errosPorCampo,
    "telefone",
    validarTelefoneBrasileiro(dadosBrutos.telefone)
  );

  registrarErroSeHouver(
    errosPorCampo,
    "email",
    validarEmailOpcional(dadosBrutos.email)
  );

  registrarErroSeHouver(
    errosPorCampo,
    "endereco",
    validarTextoObrigatorio(dadosBrutos.endereco, "Endereço / Bairro", 5)
  );

  const possuiErros = Object.keys(errosPorCampo).length > 0;

  return {
    valido: !possuiErros,
    errosPorCampo,
    dadosNormalizados: {
      nome: normalizarTexto(dadosBrutos.nome),
      telefone: possuiErros
        ? normalizarTexto(dadosBrutos.telefone)
        : formatarTelefoneBrasileiro(dadosBrutos.telefone),
      email: normalizarTexto(dadosBrutos.email).toLowerCase(),
      endereco: normalizarTexto(dadosBrutos.endereco),
      observacoes: normalizarTexto(dadosBrutos.observacoes),
    },
  };
}
