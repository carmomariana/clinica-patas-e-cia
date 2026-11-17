/**
 * Tela 4 - Cadastro e Edição de Animal
 * Vincula o animal a um tutor específico e aplica validação completa dos campos.
 */

import {
  cadastrarAnimalParaTutor,
  editarAnimalDoTutor,
  obterAnimalDoTutorObrigatorio,
} from "../servicos/animalServico.js";
import { ErroValidacao } from "../servicos/errosDominio.js";
import { obterTutorObrigatorio } from "../servicos/tutorServico.js";
import {
  exibirMensagemErro,
  exibirMensagemSucesso,
} from "./componentes/alertaFeedback.js";
import {
  ativarLimpezaAutomaticaDeErros,
  exibirErrosNoFormulario,
  limparTodosErrosFormulario,
} from "./componentes/errosFormulario.js";
import {
  ativarTela,
  atualizarTrilhaNavegacao,
  navegarPara,
} from "./roteador.js";
import { selecionarElemento } from "./utilitarios/dom.js";

let contextoEdicaoAnimal = {
  tutorId: null,
  animalId: null,
};
let eventosInicializados = false;

function preencherCamposFormularioAnimal(formulario, animal = null) {
  formulario.elements.namedItem("nome").value = animal?.nome ?? "";
  formulario.elements.namedItem("especie").value = animal?.especie ?? "";
  formulario.elements.namedItem("raca").value = animal?.raca ?? "";
  formulario.elements.namedItem("sexo").value = animal?.sexo ?? "";
  formulario.elements.namedItem("idadeAnos").value =
    animal?.idadeAnos !== undefined ? String(animal.idadeAnos) : "";
  formulario.elements.namedItem("pesoKg").value =
    animal?.pesoKg !== undefined ? String(animal.pesoKg) : "";
  formulario.elements.namedItem("observacoes").value =
    animal?.observacoes ?? "";
}

function coletarDadosFormularioAnimal(formulario) {
  const dados = new FormData(formulario);
  return {
    nome: dados.get("nome"),
    especie: dados.get("especie"),
    raca: dados.get("raca"),
    sexo: dados.get("sexo"),
    idadeAnos: dados.get("idadeAnos"),
    pesoKg: dados.get("pesoKg"),
    observacoes: dados.get("observacoes"),
  };
}

function processarEnvioFormularioAnimal(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const dadosDigitados = coletarDadosFormularioAnimal(formulario);
  const { tutorId, animalId } = contextoEdicaoAnimal;

  try {
    if (animalId === null) {
      const novoAnimal = cadastrarAnimalParaTutor(tutorId, dadosDigitados);
      exibirMensagemSucesso(
        `O animal "${novoAnimal.nome}" foi cadastrado com sucesso!`
      );
    } else {
      const animalAtualizado = editarAnimalDoTutor(
        tutorId,
        animalId,
        dadosDigitados
      );
      exibirMensagemSucesso(
        `Os dados do animal "${animalAtualizado.nome}" foram atualizados com sucesso!`
      );
    }

    navegarPara(`#/tutores/${tutorId}/animais`, { preservarAlerta: true });
  } catch (erro) {
    if (erro instanceof ErroValidacao) {
      exibirErrosNoFormulario(formulario, erro.errosPorCampo);
      exibirMensagemErro(erro.message, "Dados inválidos no formulário");
      return;
    }

    exibirMensagemErro(erro.message);
  }
}

function inicializarEventosFormularioAnimal() {
  if (eventosInicializados) {
    return;
  }

  const formulario = selecionarElemento("#formulario-animal");
  const botaoCancelar = selecionarElemento("#botao-cancelar-animal");

  if (formulario) {
    ativarLimpezaAutomaticaDeErros(formulario);
    formulario.addEventListener("submit", processarEnvioFormularioAnimal);
  }

  botaoCancelar?.addEventListener("click", () => {
    if (contextoEdicaoAnimal.tutorId) {
      navegarPara(`#/tutores/${contextoEdicaoAnimal.tutorId}/animais`);
    } else {
      navegarPara("#/tutores");
    }
  });

  eventosInicializados = true;
}

function configurarCabecalhoFormularioAnimal({
  modoEdicao,
  tutor,
  nomeAnimal = "",
}) {
  const titulo = selecionarElemento("#titulo-formulario-animal");
  const subtitulo = selecionarElemento("#subtitulo-formulario-animal");
  const bannerTutor = selecionarElemento("#texto-tutor-vinculado");
  const botaoSalvar = selecionarElemento("#botao-salvar-animal");

  if (titulo) {
    titulo.textContent = modoEdicao
      ? `Editar Animal: ${nomeAnimal}`
      : "Cadastrar Novo Animal";
  }

  if (subtitulo) {
    subtitulo.textContent = modoEdicao
      ? "Atualize os dados clínicos e de identificação do paciente."
      : "Cadastre um novo animal vinculado ao tutor selecionado.";
  }

  if (bannerTutor) {
    bannerTutor.textContent = `${tutor.nome} • ${tutor.telefone}`;
  }

  if (botaoSalvar) {
    botaoSalvar.textContent = modoEdicao
      ? "Salvar Alterações"
      : "Cadastrar Animal";
  }
}

export function exibirTelaNovoAnimal(tutorId) {
  inicializarEventosFormularioAnimal();

  try {
    const tutor = obterTutorObrigatorio(tutorId);
    contextoEdicaoAnimal = { tutorId: tutor.id, animalId: null };

    const formulario = selecionarElemento("#formulario-animal");
    if (formulario) {
      limparTodosErrosFormulario(formulario);
      preencherCamposFormularioAnimal(formulario, null);
    }

    configurarCabecalhoFormularioAnimal({ modoEdicao: false, tutor });
    ativarTela("tela-formulario-animal");

    atualizarTrilhaNavegacao([
      { rotulo: "Tutores Cadastrados", href: "#/tutores" },
      {
        rotulo: `${tutor.nome} (Animais)`,
        href: `#/tutores/${tutor.id}/animais`,
      },
      { rotulo: "Novo Animal" },
    ]);

    formulario?.elements.namedItem("nome")?.focus();
  } catch (erro) {
    exibirMensagemErro(erro.message);
    navegarPara("#/tutores", { preservarAlerta: true });
  }
}

export function exibirTelaEditarAnimal(tutorId, animalId) {
  inicializarEventosFormularioAnimal();

  try {
    const { tutor, animal } = obterAnimalDoTutorObrigatorio(tutorId, animalId);
    contextoEdicaoAnimal = { tutorId: tutor.id, animalId: animal.id };

    const formulario = selecionarElemento("#formulario-animal");
    if (formulario) {
      limparTodosErrosFormulario(formulario);
      preencherCamposFormularioAnimal(formulario, animal);
    }

    configurarCabecalhoFormularioAnimal({
      modoEdicao: true,
      tutor,
      nomeAnimal: animal.nome,
    });
    ativarTela("tela-formulario-animal");

    atualizarTrilhaNavegacao([
      { rotulo: "Tutores Cadastrados", href: "#/tutores" },
      {
        rotulo: `${tutor.nome} (Animais)`,
        href: `#/tutores/${tutor.id}/animais`,
      },
      { rotulo: `Editar ${animal.nome}` },
    ]);
  } catch (erro) {
    exibirMensagemErro(erro.message);
    navegarPara("#/tutores", { preservarAlerta: true });
  }
}
