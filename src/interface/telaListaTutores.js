/**
 * Tela 1 - Lista de Tutores
 * Exibe os tutores cadastrados, busca rápida (por tutor, telefone ou animal),
 * indicadores da clínica e ações de navegação, edição e exclusão protegida.
 */

import {
  excluirTutor,
  listarTutoresComAnimais,
  obterIndicadoresClinica,
} from "../servicos/tutorServico.js";
import {
  exibirMensagemErro,
  exibirMensagemSucesso,
} from "./componentes/alertaFeedback.js";
import { solicitarConfirmacao } from "./componentes/modalConfirmacao.js";
import {
  ativarTela,
  atualizarTrilhaNavegacao,
  navegarPara,
} from "./roteador.js";
import {
  criarElemento,
  limparConteudo,
  selecionarElemento,
} from "./utilitarios/dom.js";

let termoBuscaAtual = "";
let eventosInicializados = false;

function atualizarIndicadoresTopo() {
  const { totalTutores, totalAnimais } = obterIndicadoresClinica();
  const elTutores = selecionarElemento("#indicador-total-tutores");
  const elAnimais = selecionarElemento("#indicador-total-animais");

  if (elTutores) {
    elTutores.textContent = String(totalTutores);
  }

  if (elAnimais) {
    elAnimais.textContent = String(totalAnimais);
  }
}

function criarResumoAnimaisNaLinha(tutor) {
  if (tutor.quantidadeAnimais === 0) {
    return criarElemento("span", {
      classe: "etiqueta etiqueta-neutra",
      texto: "Nenhum animal",
    });
  }

  const textoContagem =
    tutor.quantidadeAnimais === 1
      ? "1 animal"
      : `${tutor.quantidadeAnimais} animais`;

  const container = criarElemento("div", { classe: "resumo-pets-celula" }, [
    criarElemento("span", {
      classe: "etiqueta etiqueta-primaria",
      texto: textoContagem,
    }),
  ]);

  const listaNomes = criarElemento(
    "span",
    { classe: "nomes-pets-celula" },
    [tutor.animais.map((animal) => animal.nome).join(", ")]
  );
  container.appendChild(listaNomes);

  return container;
}

function confirmarExclusaoTutor(tutor) {
  solicitarConfirmacao({
    titulo: `Excluir cadastro de ${tutor.nome}?`,
    descricao:
      "Esta ação removerá o tutor da memória caso não existam animais vinculados a ele.",
    rotuloConfirmar: "Excluir tutor",
    aoConfirmar: () => processarExclusaoTutor(tutor.id),
  });
}

function processarExclusaoTutor(tutorId) {
  try {
    const tutorRemovido = excluirTutor(tutorId);
    renderizarConteudoTutores();
    exibirMensagemSucesso(
      `O tutor "${tutorRemovido.nome}" foi excluído com sucesso.`
    );
  } catch (erro) {
    exibirMensagemErro(
      erro.message,
      "Exclusão bloqueada pelas regras da clínica"
    );
  }
}

function criarLinhaTutor(tutor) {
  const celulaTutor = criarElemento("td", {}, [
    criarElemento("strong", {
      classe: "nome-principal-tabela",
      texto: tutor.nome,
    }),
    tutor.email
      ? criarElemento("span", {
          classe: "subtexto-tabela",
          texto: tutor.email,
        })
      : null,
  ]);

  const celulaContato = criarElemento("td", {}, [
    criarElemento("span", {
      classe: "telefone-destaque",
      texto: tutor.telefone,
    }),
    criarElemento("span", {
      classe: "subtexto-tabela",
      texto: tutor.endereco,
    }),
  ]);

  const celulaAnimais = criarElemento("td", {}, [
    criarResumoAnimaisNaLinha(tutor),
  ]);

  const celulaAcoes = criarElemento("td", { classe: "celula-acoes" }, [
    criarElemento("div", { classe: "grupo-botoes-tabela" }, [
      criarElemento("a", {
        classe: "botao botao-secundario botao-pequeno",
        texto: `Animais (${tutor.quantidadeAnimais})`,
        atributos: {
          href: `#/tutores/${tutor.id}/animais`,
          title: `Visualizar e gerenciar animais de ${tutor.nome}`,
        },
      }),
      criarElemento("a", {
        classe: "botao botao-contorno botao-pequeno",
        texto: "Editar",
        atributos: {
          href: `#/tutores/${tutor.id}/editar`,
        },
      }),
      criarElemento("button", {
        classe: "botao botao-perigo-suave botao-pequeno",
        texto: "Excluir",
        atributos: {
          type: "button",
        },
        eventos: {
          click: () => confirmarExclusaoTutor(tutor),
        },
      }),
    ]),
  ]);

  return criarElemento("tr", {}, [
    celulaTutor,
    celulaContato,
    celulaAnimais,
    celulaAcoes,
  ]);
}

function renderizarConteudoTutores() {
  atualizarIndicadoresTopo();

  const tutoresFiltrados = listarTutoresComAnimais(termoBuscaAtual);
  const corpoTabela = selecionarElemento("#corpo-tabela-tutores");
  const containerTabela = selecionarElemento("#container-tabela-tutores");
  const estadoVazio = selecionarElemento("#estado-vazio-tutores");
  const mensagemVazio = selecionarElemento("#mensagem-vazio-tutores");
  const botaoLimpar = selecionarElemento("#botao-limpar-busca");

  if (!corpoTabela || !containerTabela || !estadoVazio) {
    return;
  }

  if (botaoLimpar) {
    botaoLimpar.hidden = termoBuscaAtual.trim().length === 0;
  }

  limparConteudo(corpoTabela);

  if (tutoresFiltrados.length === 0) {
    containerTabela.hidden = true;
    estadoVazio.hidden = false;

    if (mensagemVazio) {
      mensagemVazio.textContent = termoBuscaAtual.trim()
        ? `Nenhum tutor ou animal encontrado para "${termoBuscaAtual}".`
        : "Ainda não há tutores cadastrados na Clínica Patas & Cia.";
    }
    return;
  }

  estadoVazio.hidden = true;
  containerTabela.hidden = false;

  tutoresFiltrados.forEach((tutor) => {
    corpoTabela.appendChild(criarLinhaTutor(tutor));
  });
}

function inicializarEventosTelaTutores() {
  if (eventosInicializados) {
    return;
  }

  const campoBusca = selecionarElemento("#campo-busca-tutores");
  const botaoLimpar = selecionarElemento("#botao-limpar-busca");
  const botaoNovoVazio = selecionarElemento("#botao-novo-tutor-vazio");

  campoBusca?.addEventListener("input", (evento) => {
    termoBuscaAtual = evento.target.value;
    renderizarConteudoTutores();
  });

  botaoLimpar?.addEventListener("click", () => {
    termoBuscaAtual = "";
    if (campoBusca) {
      campoBusca.value = "";
      campoBusca.focus();
    }
    renderizarConteudoTutores();
  });

  botaoNovoVazio?.addEventListener("click", () => {
    navegarPara("#/tutores/novo");
  });

  eventosInicializados = true;
}

export function exibirTelaListaTutores() {
  inicializarEventosTelaTutores();
  ativarTela("tela-lista-tutores");

  atualizarTrilhaNavegacao([{ rotulo: "Tutores Cadastrados" }]);

  const campoBusca = selecionarElemento("#campo-busca-tutores");
  if (campoBusca) {
    campoBusca.value = termoBuscaAtual;
  }

  renderizarConteudoTutores();
}
