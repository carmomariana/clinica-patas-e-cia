/**
 * Componente de Modal de Confirmação
 * Substitui janelas nativas do navegador por uma confirmação estilizada e acessível.
 */

import { selecionarElemento } from "../utilitarios/dom.js";

let acaoConfirmadaAtual = null;
let eventosInicializados = false;

export function fecharModalConfirmacao() {
  const modal = selecionarElemento("#modal-confirmacao");
  acaoConfirmadaAtual = null;

  if (modal) {
    modal.hidden = true;
  }
}

function inicializarEventosModal() {
  if (eventosInicializados) {
    return;
  }

  const modal = selecionarElemento("#modal-confirmacao");
  const botaoCancelar = selecionarElemento("#botao-cancelar-modal");
  const botaoConfirmar = selecionarElemento("#botao-confirmar-modal");

  botaoCancelar?.addEventListener("click", fecharModalConfirmacao);

  botaoConfirmar?.addEventListener("click", () => {
    const executar = acaoConfirmadaAtual;
    fecharModalConfirmacao();
    if (typeof executar === "function") {
      executar();
    }
  });

  modal?.addEventListener("click", (evento) => {
    if (evento.target === modal) {
      fecharModalConfirmacao();
    }
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && modal && !modal.hidden) {
      fecharModalConfirmacao();
    }
  });

  eventosInicializados = true;
}

export function solicitarConfirmacao({
  titulo,
  descricao,
  rotuloConfirmar = "Confirmar exclusão",
  aoConfirmar,
}) {
  inicializarEventosModal();

  const modal = selecionarElemento("#modal-confirmacao");
  const elementoTitulo = selecionarElemento("#modal-titulo");
  const elementoDescricao = selecionarElemento("#modal-descricao");
  const botaoConfirmar = selecionarElemento("#botao-confirmar-modal");

  if (!modal || !elementoTitulo || !elementoDescricao || !botaoConfirmar) {
    return;
  }

  elementoTitulo.textContent = titulo;
  elementoDescricao.textContent = descricao;
  botaoConfirmar.textContent = rotuloConfirmar;
  acaoConfirmadaAtual = aoConfirmar;

  modal.hidden = false;
  botaoConfirmar.focus();
}
