/**
 * Camada de Serviço - Serviço de Tutores
 * Centraliza as regras de negócio de Tutor, incluindo a validação de dados
 * e o bloqueio de exclusão de tutores que ainda possuem animais cadastrados.
 */

import {
  listarAnimaisPorTutorId,
  listarTodosAnimais,
} from "../dados/animalRepositorio.js";
import {
  atualizarTutorPorId,
  buscarTutorPorId,
  inserirTutor,
  listarTodosTutores,
  removerTutorPorId,
} from "../dados/tutorRepositorio.js";
import { extrairApenasDigitos, normalizarTexto } from "../validacoes/regrasComuns.js";
import { validarDadosTutor } from "../validacoes/validadorTutor.js";
import {
  ErroNaoEncontrado,
  ErroRegraNegocio,
  ErroValidacao,
} from "./errosDominio.js";

function enriquecerTutorComAnimais(tutor) {
  const animaisVinculados = listarAnimaisPorTutorId(tutor.id);
  return {
    ...tutor,
    animais: animaisVinculados,
    quantidadeAnimais: animaisVinculados.length,
  };
}

function correspondeAoTermoDeBusca(tutorComAnimais, termoBusca) {
  const termo = normalizarTexto(termoBusca).toLowerCase();
  if (!termo) {
    return true;
  }

  const digitosTermo = extrairApenasDigitos(termo);
  const digitosTelefone = extrairApenasDigitos(tutorComAnimais.telefone);

  const correspondeTutor =
    tutorComAnimais.nome.toLowerCase().includes(termo) ||
    tutorComAnimais.telefone.toLowerCase().includes(termo) ||
    (digitosTermo.length > 0 && digitosTelefone.includes(digitosTermo)) ||
    tutorComAnimais.email.toLowerCase().includes(termo) ||
    tutorComAnimais.endereco.toLowerCase().includes(termo);

  const correspondeAlgumAnimal = tutorComAnimais.animais.some(
    (animal) =>
      animal.nome.toLowerCase().includes(termo) ||
      animal.especie.toLowerCase().includes(termo) ||
      animal.raca.toLowerCase().includes(termo)
  );

  return correspondeTutor || correspondeAlgumAnimal;
}

function garantirDadosTutorValidos(dadosBrutos) {
  const resultado = validarDadosTutor(dadosBrutos);

  if (!resultado.valido) {
    throw new ErroValidacao(
      "Corrija os campos destacados antes de salvar os dados do tutor.",
      resultado.errosPorCampo
    );
  }

  return resultado.dadosNormalizados;
}

function garantirTutorSemAnimaisVinculados(tutor) {
  const animaisDoTutor = listarAnimaisPorTutorId(tutor.id);

  if (animaisDoTutor.length === 0) {
    return;
  }

  const nomesAnimais = animaisDoTutor.map((animal) => animal.nome).join(", ");
  const descricaoQuantidade =
    animaisDoTutor.length === 1
      ? "1 animal cadastrado"
      : `${animaisDoTutor.length} animais cadastrados`;

  throw new ErroRegraNegocio(
    `Não é possível excluir "${tutor.nome}" pois este tutor ainda possui ${descricaoQuantidade} (${nomesAnimais}). Exclua os animais vinculados antes de remover o tutor.`
  );
}

export function obterIndicadoresClinica() {
  const totalTutores = listarTodosTutores().length;
  const totalAnimais = listarTodosAnimais().length;

  return {
    totalTutores,
    totalAnimais,
  };
}

export function listarTutoresComAnimais(termoBusca = "") {
  return listarTodosTutores()
    .map(enriquecerTutorComAnimais)
    .filter((tutor) => correspondeAoTermoDeBusca(tutor, termoBusca));
}

export function obterTutorObrigatorio(id) {
  const tutor = buscarTutorPorId(id);

  if (!tutor) {
    throw new ErroNaoEncontrado("O tutor solicitado não foi encontrado.");
  }

  return tutor;
}

export function cadastrarTutor(dadosBrutos) {
  const dadosValidados = garantirDadosTutorValidos(dadosBrutos);
  return inserirTutor(dadosValidados);
}

export function editarTutor(id, dadosBrutos) {
  obterTutorObrigatorio(id);
  const dadosValidados = garantirDadosTutorValidos(dadosBrutos);
  return atualizarTutorPorId(id, dadosValidados);
}

export function excluirTutor(id) {
  const tutor = obterTutorObrigatorio(id);
  garantirTutorSemAnimaisVinculados(tutor);
  removerTutorPorId(tutor.id);
  return tutor;
}
