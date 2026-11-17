/**
 * Camada de Dados - Repositório de Tutores
 * Responsável exclusivamente pelas operações de persistência em memória da entidade Tutor.
 */

import { gerarNovoIdTutor, obterColecaoTutores } from "./bancoMemoria.js";

function clonarTutor(tutor) {
  return { ...tutor };
}

export function listarTodosTutores() {
  return obterColecaoTutores().map(clonarTutor);
}

export function buscarTutorPorId(id) {
  const idNumerico = Number(id);
  const tutorEncontrado = obterColecaoTutores().find(
    (tutor) => tutor.id === idNumerico
  );
  return tutorEncontrado ? clonarTutor(tutorEncontrado) : null;
}

export function inserirTutor(dadosTutor) {
  const novoTutor = {
    id: gerarNovoIdTutor(),
    nome: dadosTutor.nome,
    telefone: dadosTutor.telefone,
    email: dadosTutor.email,
    endereco: dadosTutor.endereco,
    observacoes: dadosTutor.observacoes,
  };

  obterColecaoTutores().push(novoTutor);
  return clonarTutor(novoTutor);
}

export function atualizarTutorPorId(id, dadosAtualizados) {
  const idNumerico = Number(id);
  const tutores = obterColecaoTutores();
  const indice = tutores.findIndex((tutor) => tutor.id === idNumerico);

  if (indice === -1) {
    return null;
  }

  tutores[indice] = {
    ...tutores[indice],
    nome: dadosAtualizados.nome,
    telefone: dadosAtualizados.telefone,
    email: dadosAtualizados.email,
    endereco: dadosAtualizados.endereco,
    observacoes: dadosAtualizados.observacoes,
  };

  return clonarTutor(tutores[indice]);
}

export function removerTutorPorId(id) {
  const idNumerico = Number(id);
  const tutores = obterColecaoTutores();
  const indice = tutores.findIndex((tutor) => tutor.id === idNumerico);

  if (indice === -1) {
    return false;
  }

  tutores.splice(indice, 1);
  return true;
}
