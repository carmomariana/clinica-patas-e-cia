/**
 * Validação da Entidade Animal
 * Garante campos obrigatórios, espécie/sexo válidos e valores numéricos coerentes.
 */

import {
  normalizarTexto,
  validarNumeroObrigatorio,
  validarOpcaoObrigatoria,
  validarTextoObrigatorio,
} from "./regrasComuns.js";

export const ESPECIES_PERMITIDAS = [
  "Cachorro",
  "Gato",
  "Ave",
  "Roedor",
  "Réptil",
  "Outro",
];

export const SEXOS_PERMITIDOS = ["Macho", "Fêmea"];

function registrarErroSeHouver(mapaErros, campo, mensagemErro) {
  if (mensagemErro) {
    mapaErros[campo] = mensagemErro;
  }
}

export function validarDadosAnimal(dadosBrutos = {}) {
  const errosPorCampo = {};

  registrarErroSeHouver(
    errosPorCampo,
    "nome",
    validarTextoObrigatorio(dadosBrutos.nome, "Nome do animal", 2)
  );

  registrarErroSeHouver(
    errosPorCampo,
    "especie",
    validarOpcaoObrigatoria(dadosBrutos.especie, "Espécie", ESPECIES_PERMITIDAS)
  );

  registrarErroSeHouver(
    errosPorCampo,
    "raca",
    validarTextoObrigatorio(dadosBrutos.raca, "Raça", 2)
  );

  registrarErroSeHouver(
    errosPorCampo,
    "sexo",
    validarOpcaoObrigatoria(dadosBrutos.sexo, "Sexo", SEXOS_PERMITIDOS)
  );

  registrarErroSeHouver(
    errosPorCampo,
    "idadeAnos",
    validarNumeroObrigatorio(dadosBrutos.idadeAnos, "Idade (anos)", {
      minimo: 0,
      maximo: 40,
      permitirZero: true,
    })
  );

  registrarErroSeHouver(
    errosPorCampo,
    "pesoKg",
    validarNumeroObrigatorio(dadosBrutos.pesoKg, "Peso (kg)", {
      minimo: 0.1,
      maximo: 150,
      permitirZero: false,
    })
  );

  const possuiErros = Object.keys(errosPorCampo).length > 0;
  const idadeConvertida = Number(
    normalizarTexto(dadosBrutos.idadeAnos).replace(",", ".")
  );
  const pesoConvertido = Number(
    normalizarTexto(dadosBrutos.pesoKg).replace(",", ".")
  );

  return {
    valido: !possuiErros,
    errosPorCampo,
    dadosNormalizados: {
      nome: normalizarTexto(dadosBrutos.nome),
      especie: normalizarTexto(dadosBrutos.especie),
      raca: normalizarTexto(dadosBrutos.raca),
      sexo: normalizarTexto(dadosBrutos.sexo),
      idadeAnos: possuiErros ? dadosBrutos.idadeAnos : idadeConvertida,
      pesoKg: possuiErros ? dadosBrutos.pesoKg : pesoConvertido,
      observacoes: normalizarTexto(dadosBrutos.observacoes),
    },
  };
}
