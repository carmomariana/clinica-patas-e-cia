/**
 * Tela 3 - Lista de Animais de um Tutor
 * Apresenta os dados do tutor selecionado e lista todos os animais que pertencem
 * a ele, permitindo cadastrar novo animal, editar ou excluir.
 */

import {
  excluirAnimalDoTutor,
  listarAnimaisDoTutor,
} from "../servicos/animalServico.js";
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
import {
  formatarIdadeAnimal,
  formatarPesoAnimal,
  obterVarianteEspecie,
} from "./utilitarios/formatadores.js";

let tutorIdAtual = null;

function renderizarCartaoResumoTutor(tutor, quantidadeAnimais) {
  const container = selecionarElemento("#resumo-tutor-selecionado");
  if (!container) {
    return;
  }

  limparConteudo(container);

  const textoContador =
    quantidadeAnimais === 1
      ? "1 animal vinculado"
      : `${quantidadeAnimais} animais vinculados`;

  const cabecalhoCartao = criarElemento("div", { classe: "cartao-tutor-topo" }, [
    criarElemento("div", {}, [
      criarElemento("span", {
        classe: "rotulo-secao-pequeno",
        texto: "Ficha do Tutor",
      }),
      criarElemento("h2", {
        classe: "titulo-cartao-tutor",
        texto: tutor.nome,
      }),
    ]),
    criarElemento("div", { classe: "acoes-cartao-tutor" }, [
      criarElemento("span", {
        classe: "etiqueta etiqueta-primaria",
        texto: textoContador,
      }),
      criarElemento("a", {
        classe: "botao botao-contorno botao-pequeno",
        texto: "Editar Tutor",
        atributos: { href: `#/tutores/${tutor.id}/editar` },
      }),
    ]),
  ]);

  const gradeDetalhes = criarElemento("div", { classe: "grade-detalhes-tutor" }, [
    criarElemento("div", { classe: "item-detalhe-tutor" }, [
      criarElemento("span", { classe: "rotulo-detalhe", texto: "Telefone" }),
      criarElemento("strong", { texto: tutor.telefone }),
    ]),
    criarElemento("div", { classe: "item-detalhe-tutor" }, [
      criarElemento("span", { classe: "rotulo-detalhe", texto: "E-mail" }),
      criarElemento("strong", {
        texto: tutor.email || "Não informado",
      }),
    ]),
    criarElemento("div", { classe: "item-detalhe-tutor" }, [
      criarElemento("span", {
        classe: "rotulo-detalhe",
        texto: "Endereço / Bairro",
      }),
      criarElemento("strong", { texto: tutor.endereco }),
    ]),
    tutor.observacoes
      ? criarElemento("div", { classe: "item-detalhe-tutor" }, [
          criarElemento("span", {
            classe: "rotulo-detalhe",
            texto: "Observações",
          }),
          criarElemento("span", { texto: tutor.observacoes }),
        ])
      : null,
  ]);

  container.appendChild(cabecalhoCartao);
  container.appendChild(gradeDetalhes);
}

function confirmarExclusaoAnimal(tutor, animal) {
  solicitarConfirmacao({
    titulo: `Excluir o animal "${animal.nome}"?`,
    descricao: `O cadastro de ${animal.nome} (${animal.especie}) será removido da ficha do tutor ${tutor.nome}.`,
    rotuloConfirmar: "Excluir animal",
    aoConfirmar: () => {
      try {
        excluirAnimalDoTutor(tutor.id, animal.id);
        atualizarListagemAnimais();
        exibirMensagemSucesso(
          `O animal "${animal.nome}" foi removido com sucesso.`
        );
      } catch (erro) {
        exibirMensagemErro(erro.message);
      }
    },
  });
}

function criarLinhaAnimal(tutor, animal) {
  const classeEspecie = obterVarianteEspecie(animal.especie);

  return criarElemento("tr", {}, [
    criarElemento("td", {}, [
      criarElemento("strong", {
        classe: "nome-principal-tabela",
        texto: animal.nome,
      }),
      criarElemento("span", {
        classe: "subtexto-tabela",
        texto: `Sexo: ${animal.sexo}`,
      }),
    ]),
    criarElemento("td", {}, [
      criarElemento("span", {
        classe: `etiqueta ${classeEspecie}`,
        texto: animal.especie,
      }),
      criarElemento("span", {
        classe: "subtexto-tabela",
        texto: animal.raca,
      }),
    ]),
    criarElemento("td", {}, [
      criarElemento("strong", { texto: formatarIdadeAnimal(animal.idadeAnos) }),
      criarElemento("span", {
        classe: "subtexto-tabela",
        texto: `Peso: ${formatarPesoAnimal(animal.pesoKg)}`,
      }),
    ]),
    criarElemento("td", {}, [
      criarElemento("span", {
        classe: "texto-observacao-tabela",
        texto: animal.observacoes || "Sem observações clínicas.",
      }),
    ]),
    criarElemento("td", { classe: "celula-acoes" }, [
      criarElemento("div", { classe: "grupo-botoes-tabela" }, [
        criarElemento("a", {
          classe: "botao botao-contorno botao-pequeno",
          texto: "Editar",
          atributos: {
            href: `#/tutores/${tutor.id}/animais/${animal.id}/editar`,
          },
        }),
        criarElemento("button", {
          classe: "botao botao-perigo-suave botao-pequeno",
          texto: "Excluir",
          atributos: { type: "button" },
          eventos: {
            click: () => confirmarExclusaoAnimal(tutor, animal),
          },
        }),
      ]),
    ]),
  ]);
}

function atualizarListagemAnimais() {
  const { tutor, animais } = listarAnimaisDoTutor(tutorIdAtual);

  renderizarCartaoResumoTutor(tutor, animais.length);

  const tituloSecao = selecionarElemento("#titulo-secao-animais");
  const linkNovoTopo = selecionarElemento("#link-novo-animal-topo");
  const linkNovoVazio = selecionarElemento("#link-novo-animal-vazio");
  const containerTabela = selecionarElemento("#container-tabela-animais");
  const corpoTabela = selecionarElemento("#corpo-tabela-animais");
  const estadoVazio = selecionarElemento("#estado-vazio-animais");

  const rotaNovoAnimal = `#/tutores/${tutor.id}/animais/novo`;

  if (tituloSecao) {
    tituloSecao.textContent = `Animais de ${tutor.nome}`;
  }

  if (linkNovoTopo) {
    linkNovoTopo.setAttribute("href", rotaNovoAnimal);
  }

  if (linkNovoVazio) {
    linkNovoVazio.setAttribute("href", rotaNovoAnimal);
  }

  if (!corpoTabela || !containerTabela || !estadoVazio) {
    return;
  }

  limparConteudo(corpoTabela);

  if (animais.length === 0) {
    containerTabela.hidden = true;
    estadoVazio.hidden = false;
    return;
  }

  estadoVazio.hidden = true;
  containerTabela.hidden = false;

  animais.forEach((animal) => {
    corpoTabela.appendChild(criarLinhaAnimal(tutor, animal));
  });
}

export function exibirTelaListaAnimais(tutorId) {
  try {
    tutorIdAtual = Number(tutorId);
    const { tutor } = listarAnimaisDoTutor(tutorIdAtual);

    ativarTela("tela-lista-animais");
    atualizarTrilhaNavegacao([
      { rotulo: "Tutores Cadastrados", href: "#/tutores" },
      { rotulo: `${tutor.nome} (Animais)` },
    ]);

    atualizarListagemAnimais();
  } catch (erro) {
    exibirMensagemErro(erro.message);
    navegarPara("#/tutores", { preservarAlerta: true });
  }
}
