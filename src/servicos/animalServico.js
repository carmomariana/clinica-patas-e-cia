/**
 * Camada de Serviço - Serviço de Animais
 * Centraliza as regras de negócio de Animal, garantindo vínculo obrigatório
 * com um Tutor válido e aplicando todas as validações de entrada.
 */

import {
  atualizarAnimalPorId,
  buscarAnimalPorId,
  inserirAnimal,
  listarAnimaisPorTutorId,
  removerAnimalPorId,
} from "../dados/animalRepositorio.js";
import { validarDadosAnimal } from "../validacoes/validadorAnimal.js";
import { ErroNaoEncontrado, ErroValidacao } from "./errosDominio.js";
import { obterTutorObrigatorio } from "./tutorServico.js";

function garantirDadosAnimalValidos(dadosBrutos) {
  const resultado = validarDadosAnimal(dadosBrutos);

  if (!resultado.valido) {
    throw new ErroValidacao(
      "Corrija os campos destacados antes de salvar os dados do animal.",
      resultado.errosPorCampo
    );
  }

  return resultado.dadosNormalizados;
}

export function obterAnimalObrigatorio(id) {
  const animal = buscarAnimalPorId(id);

  if (!animal) {
    throw new ErroNaoEncontrado("O animal solicitado não foi encontrado.");
  }

  return animal;
}

export function obterAnimalDoTutorObrigatorio(tutorId, animalId) {
  const tutor = obterTutorObrigatorio(tutorId);
  const animal = obterAnimalObrigatorio(animalId);

  if (animal.tutorId !== tutor.id) {
    throw new ErroNaoEncontrado(
      "O animal informado não pertence ao tutor selecionado."
    );
  }

  return { tutor, animal };
}

export function listarAnimaisDoTutor(tutorId) {
  const tutor = obterTutorObrigatorio(tutorId);
  const animais = listarAnimaisPorTutorId(tutor.id);

  return {
    tutor,
    animais,
  };
}

export function cadastrarAnimalParaTutor(tutorId, dadosBrutos) {
  const tutor = obterTutorObrigatorio(tutorId);
  const dadosValidados = garantirDadosAnimalValidos(dadosBrutos);

  return inserirAnimal({
    ...dadosValidados,
    tutorId: tutor.id,
  });
}

export function editarAnimalDoTutor(tutorId, animalId, dadosBrutos) {
  const { animal } = obterAnimalDoTutorObrigatorio(tutorId, animalId);
  const dadosValidados = garantirDadosAnimalValidos(dadosBrutos);

  return atualizarAnimalPorId(animal.id, dadosValidados);
}

export function excluirAnimalDoTutor(tutorId, animalId) {
  const { animal } = obterAnimalDoTutorObrigatorio(tutorId, animalId);
  removerAnimalPorId(animal.id);
  return animal;
}
