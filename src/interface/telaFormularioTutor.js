/**
 * Tela 2 - Cadastro e Edição de Tutor
 * Compartilha o mesmo formulário sem duplicar código, aplicando máscara de
 * telefone e exibindo erros claros de validação por campo.
 */

import { ErroValidacao } from "../servicos/errosDominio.js";
import {
  cadastrarTutor,
  editarTutor,
  obterTutorObrigatorio,
} from "../servicos/tutorServico.js";
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
import { aplicarMascaraTelefone } from "./utilitarios/formatadores.js";

let tutorIdEmEdicao = null;
let eventosInicializados = false;

function preencherCamposFormularioTutor(formulario, tutor = null) {
  formulario.elements.namedItem("nome").value = tutor?.nome ?? "";
  formulario.elements.namedItem("telefone").value = tutor?.telefone ?? "";
  formulario.elements.namedItem("email").value = tutor?.email ?? "";
  formulario.elements.namedItem("endereco").value = tutor?.endereco ?? "";
  formulario.elements.namedItem("observacoes").value = tutor?.observacoes ?? "";
}

function coletarDadosFormularioTutor(formulario) {
  const dados = new FormData(formulario);
  return {
    nome: dados.get("nome"),
    telefone: dados.get("telefone"),
    email: dados.get("email"),
    endereco: dados.get("endereco"),
    observacoes: dados.get("observacoes"),
  };
}

function processarEnvioFormularioTutor(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const dadosDigitados = coletarDadosFormularioTutor(formulario);

  try {
    if (tutorIdEmEdicao === null) {
      const novoTutor = cadastrarTutor(dadosDigitados);
      exibirMensagemSucesso(
        `O tutor "${novoTutor.nome}" foi cadastrado com sucesso. Agora você já pode adicionar seus animais!`
      );
      navegarPara(`#/tutores/${novoTutor.id}/animais`, {
        preservarAlerta: true,
      });
      return;
    }

    const tutorAtualizado = editarTutor(tutorIdEmEdicao, dadosDigitados);
    exibirMensagemSucesso(
      `Os dados do tutor "${tutorAtualizado.nome}" foram atualizados com sucesso.`
    );
    navegarPara("#/tutores", { preservarAlerta: true });
  } catch (erro) {
    if (erro instanceof ErroValidacao) {
      exibirErrosNoFormulario(formulario, erro.errosPorCampo);
      exibirMensagemErro(erro.message, "Dados inválidos no formulário");
      return;
    }

    exibirMensagemErro(erro.message);
  }
}

function inicializarEventosFormularioTutor() {
  if (eventosInicializados) {
    return;
  }

  const formulario = selecionarElemento("#formulario-tutor");
  const campoTelefone = formulario?.elements.namedItem("telefone");
  const botaoCancelar = selecionarElemento("#botao-cancelar-tutor");

  if (formulario) {
    ativarLimpezaAutomaticaDeErros(formulario);
    formulario.addEventListener("submit", processarEnvioFormularioTutor);
  }

  campoTelefone?.addEventListener("input", (evento) => {
    evento.target.value = aplicarMascaraTelefone(evento.target.value);
  });

  botaoCancelar?.addEventListener("click", () => {
    navegarPara("#/tutores");
  });

  eventosInicializados = true;
}

function configurarCabecalhoFormulario({ modoEdicao, nomeTutor = "" }) {
  const titulo = selecionarElemento("#titulo-formulario-tutor");
  const subtitulo = selecionarElemento("#subtitulo-formulario-tutor");
  const botaoSalvar = selecionarElemento("#botao-salvar-tutor");

  if (titulo) {
    titulo.textContent = modoEdicao
      ? `Editar Tutor: ${nomeTutor}`
      : "Cadastrar Novo Tutor";
  }

  if (subtitulo) {
    subtitulo.textContent = modoEdicao
      ? "Atualize os dados de contato ou endereço do tutor selecionado."
      : "Preencha os dados obrigatórios do tutor para registrá-lo na Clínica Patas & Cia.";
  }

  if (botaoSalvar) {
    botaoSalvar.textContent = modoEdicao
      ? "Salvar Alterações"
      : "Cadastrar Tutor";
  }
}

export function exibirTelaNovoTutor() {
  inicializarEventosFormularioTutor();
  tutorIdEmEdicao = null;

  const formulario = selecionarElemento("#formulario-tutor");
  if (formulario) {
    limparTodosErrosFormulario(formulario);
    preencherCamposFormularioTutor(formulario, null);
  }

  configurarCabecalhoFormulario({ modoEdicao: false });
  ativarTela("tela-formulario-tutor");

  atualizarTrilhaNavegacao([
    { rotulo: "Tutores Cadastrados", href: "#/tutores" },
    { rotulo: "Novo Tutor" },
  ]);

  formulario?.elements.namedItem("nome")?.focus();
}

export function exibirTelaEditarTutor(tutorId) {
  inicializarEventosFormularioTutor();

  try {
    const tutor = obterTutorObrigatorio(tutorId);
    tutorIdEmEdicao = tutor.id;

    const formulario = selecionarElemento("#formulario-tutor");
    if (formulario) {
      limparTodosErrosFormulario(formulario);
      preencherCamposFormularioTutor(formulario, tutor);
    }

    configurarCabecalhoFormulario({ modoEdicao: true, nomeTutor: tutor.nome });
    ativarTela("tela-formulario-tutor");

    atualizarTrilhaNavegacao([
      { rotulo: "Tutores Cadastrados", href: "#/tutores" },
      { rotulo: tutor.nome, href: `#/tutores/${tutor.id}/animais` },
      { rotulo: "Editar Tutor" },
    ]);
  } catch (erro) {
    exibirMensagemErro(erro.message);
    navegarPara("#/tutores", { preservarAlerta: true });
  }
}
