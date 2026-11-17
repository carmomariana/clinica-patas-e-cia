/**
 * Componente de Alerta Global (Feedback ao Usuário)
 * Exibe mensagens claras de sucesso ou erro no topo da área principal.
 */

import { criarElemento, limparConteudo, selecionarElemento } from "../utilitarios/dom.js";

const ID_CONTAINER_ALERTA = "#container-alerta-global";

export function ocultarAlertaGlobal() {
  const container = selecionarElemento(ID_CONTAINER_ALERTA);
  if (!container) {
    return;
  }

  limparConteudo(container);
  container.hidden = true;
}

function renderizarAlerta({ tipo, titulo, mensagem }) {
  const container = selecionarElemento(ID_CONTAINER_ALERTA);
  if (!container) {
    return;
  }

  limparConteudo(container);

  const classeVariante =
    tipo === "erro" ? "alerta-global alerta-erro" : "alerta-global alerta-sucesso";
  const rotuloIcone = tipo === "erro" ? "!" : "✓";

  const caixaAlerta = criarElemento(
    "div",
    {
      classe: classeVariante,
      atributos: {
        role: tipo === "erro" ? "alert" : "status",
      },
    },
    [
      criarElemento("span", {
        classe: "alerta-icone",
        texto: rotuloIcone,
        atributos: { "aria-hidden": "true" },
      }),
      criarElemento("div", { classe: "alerta-conteudo" }, [
        criarElemento("strong", { classe: "alerta-titulo", texto: titulo }),
        criarElemento("p", { classe: "alerta-mensagem", texto: mensagem }),
      ]),
      criarElemento("button", {
        classe: "botao-fechar-alerta",
        texto: "Fechar",
        atributos: {
          type: "button",
          "aria-label": "Fechar mensagem",
        },
        eventos: {
          click: ocultarAlertaGlobal,
        },
      }),
    ]
  );

  container.appendChild(caixaAlerta);
  container.hidden = false;
  container.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

export function exibirMensagemSucesso(mensagem, titulo = "Operação concluída") {
  renderizarAlerta({ tipo: "sucesso", titulo, mensagem });
}

export function exibirMensagemErro(
  mensagem,
  titulo = "Atenção: não foi possível concluir a ação"
) {
  renderizarAlerta({ tipo: "erro", titulo, mensagem });
}
