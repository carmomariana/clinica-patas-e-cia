/**
 * Camada de Dados - Repositório de Animais
 * Responsável exclusivamente pelas operações de persistência em memória da entidade Animal,
 * mantendo a integridade do vínculo com a entidade Tutor por meio de tutorId.
 */

import { gerarNovoIdAnimal, obterColecaoAnimais } from "./bancoMemoria.js";

function clonarAnimal(animal) {
  return { ...animal };
}

export function listarTodosAnimais() {
  return obterColecaoAnimais().map(clonarAnimal);
}

export function listarAnimaisPorTutorId(tutorId) {
  const idTutorNumerico = Number(tutorId);
  return obterColecaoAnimais()
    .filter((animal) => animal.tutorId === idTutorNumerico)
    .map(clonarAnimal);
}

export function contarAnimaisPorTutorId(tutorId) {
  return listarAnimaisPorTutorId(tutorId).length;
}

export function buscarAnimalPorId(id) {
  const idNumerico = Number(id);
  const animalEncontrado = obterColecaoAnimais().find(
    (animal) => animal.id === idNumerico
  );
  return animalEncontrado ? clonarAnimal(animalEncontrado) : null;
}

export function inserirAnimal(dadosAnimal) {
  const novoAnimal = {
    id: gerarNovoIdAnimal(),
    tutorId: Number(dadosAnimal.tutorId),
    nome: dadosAnimal.nome,
    especie: dadosAnimal.especie,
    raca: dadosAnimal.raca,
    sexo: dadosAnimal.sexo,
    idadeAnos: Number(dadosAnimal.idadeAnos),
    pesoKg: Number(dadosAnimal.pesoKg),
    observacoes: dadosAnimal.observacoes,
  };

  obterColecaoAnimais().push(novoAnimal);
  return clonarAnimal(novoAnimal);
}

export function atualizarAnimalPorId(id, dadosAtualizados) {
  const idNumerico = Number(id);
  const animais = obterColecaoAnimais();
  const indice = animais.findIndex((animal) => animal.id === idNumerico);

  if (indice === -1) {
    return null;
  }

  animais[indice] = {
    ...animais[indice],
    nome: dadosAtualizados.nome,
    especie: dadosAtualizados.especie,
    raca: dadosAtualizados.raca,
    sexo: dadosAtualizados.sexo,
    idadeAnos: Number(dadosAtualizados.idadeAnos),
    pesoKg: Number(dadosAtualizados.pesoKg),
    observacoes: dadosAtualizados.observacoes,
  };

  return clonarAnimal(animais[indice]);
}

export function removerAnimalPorId(id) {
  const idNumerico = Number(id);
  const animais = obterColecaoAnimais();
  const indice = animais.findIndex((animal) => animal.id === idNumerico);

  if (indice === -1) {
    return false;
  }

  animais.splice(indice, 1);
  return true;
}
