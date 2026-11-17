/**
 * Roteador de Telas (SPA por Hash)
 * Gerencia a navegação entre as 4 telas mínimas do sistema, atualizando
 * a visualização ativa, o menu superior e a trilha de navegação (breadcrumb).
 */

import { ocultarAlertaGlobal } from "./componentes/alertaFeedback.js";
import { criarElemento, limparConteudo, selecionarElemento } from "./utilitarios/dom.js";

const IDS_TELAS = [
  "tela-lista-tutores",
  "tela-formulario-tutor",
  "tela-lista-animais",
  "tela-formulario-animal",
];

let manipuladoresRotas = null;
let preservarProximoAlerta = false;

export function navegarPara(hashDestino, opcoes = {}) {
  if (opcoes.preservarAlerta) {
    preservarProximoAlerta = true;
  }

  if (window.location.hash === hashDestino) {
    processarRotaAtual();
    return;
  }

  window.location.hash = hashDestino;
}

export function ativarTela(idTelaAtiva) {
  IDS_TELAS.forEach((idTela) => {
    const secao = document.getElementById(idTela);
    if (secao) {
      secao.hidden = idTela !== idTelaAtiva;
    }
  });

  atualizarDestaqueMenu(idTelaAtiva);
}

function atualizarDestaqueMenu(idTelaAtiva) {
  const linkLista = selecionarElemento('[data-nav="tutores"]');
  const linkNovo = selecionarElemento('[data-nav="novo-tutor"]');

  linkLista?.classList.toggle(
    "link-nav-ativo",
    idTelaAtiva === "tela-lista-tutores" ||
      idTelaAtiva === "tela-lista-animais" ||
      idTelaAtiva === "tela-formulario-animal"
  );

  linkNovo?.classList.toggle(
    "link-nav-ativo",
    idTelaAtiva === "tela-formulario-tutor" &&
      window.location.hash === "#/tutores/novo"
  );
}

export function atualizarTrilhaNavegacao(itens = []) {
  const container = selecionarElemento("#lista-trilha-navegacao");
  if (!container) {
    return;
  }

  limparConteudo(container);

  itens.forEach((item, indice) => {
    const ehUltimo = indice === itens.length - 1;
    const itemLista = criarElemento("li", { classe: "item-trilha" });

    if (!ehUltimo && item.href) {
      itemLista.appendChild(
        criarElemento("a", {
          classe: "link-trilha",
          texto: item.rotulo,
          atributos: { href: item.href },
        })
      );
    } else {
      itemLista.appendChild(
        criarElemento("span", {
          classe: "atual-trilha",
          texto: item.rotulo,
          atributos: { "aria-current": "page" },
        })
      );
    }

    container.appendChild(itemLista);
  });
}

function interpretarHash(hashBruto) {
  const caminho = (hashBruto || "#/tutores").replace(/^#/, "") || "/tutores";

  if (caminho === "/" || caminho === "/tutores") {
    return { nome: "lista-tutores", parametros: {} };
  }

  if (caminho === "/tutores/novo") {
    return { nome: "novo-tutor", parametros: {} };
  }

  const rotaEditarTutor = caminho.match(/^\/tutores\/(\d+)\/editar$/);
  if (rotaEditarTutor) {
    return {
      nome: "editar-tutor",
      parametros: { tutorId: Number(rotaEditarTutor[1]) },
    };
  }

  const rotaListaAnimais = caminho.match(/^\/tutores\/(\d+)\/animais$/);
  if (rotaListaAnimais) {
    return {
      nome: "lista-animais",
      parametros: { tutorId: Number(rotaListaAnimais[1]) },
    };
  }

  const rotaNovoAnimal = caminho.match(/^\/tutores\/(\d+)\/animais\/novo$/);
  if (rotaNovoAnimal) {
    return {
      nome: "novo-animal",
      parametros: { tutorId: Number(rotaNovoAnimal[1]) },
    };
  }

  const rotaEditarAnimal = caminho.match(
    /^\/tutores\/(\d+)\/animais\/(\d+)\/editar$/
  );
  if (rotaEditarAnimal) {
    return {
      nome: "editar-animal",
      parametros: {
        tutorId: Number(rotaEditarAnimal[1]),
        animalId: Number(rotaEditarAnimal[2]),
      },
    };
  }

  return { nome: "lista-tutores", parametros: {} };
}

export function processarRotaAtual() {
  if (!manipuladoresRotas) {
    return;
  }

  if (preservarProximoAlerta) {
    preservarProximoAlerta = false;
  } else {
    ocultarAlertaGlobal();
  }

  const rota = interpretarHash(window.location.hash);
  const executarRota =
    manipuladoresRotas[rota.nome] || manipuladoresRotas["lista-tutores"];

  executarRota(rota.parametros);
}

export function iniciarRoteador(mapaManipuladores) {
  manipuladoresRotas = mapaManipuladores;
  window.addEventListener("hashchange", processarRotaAtual);

  if (!window.location.hash) {
    window.location.replace("#/tutores");
  } else {
    processarRotaAtual();
  }
}
