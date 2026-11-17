/**
 * Utilitários de DOM
 * Criação segura de elementos HTML evitando concatenação de strings e XSS.
 */

export function selecionarElemento(seletor, escopo = document) {
  return escopo.querySelector(seletor);
}

export function limparConteudo(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}

export function criarElemento(tag, opcoes = {}, filhos = []) {
  const elemento = document.createElement(tag);

  if (opcoes.classe) {
    elemento.className = opcoes.classe;
  }

  if (opcoes.texto !== undefined && opcoes.texto !== null) {
    elemento.textContent = String(opcoes.texto);
  }

  if (opcoes.atributos) {
    Object.entries(opcoes.atributos).forEach(([chave, valor]) => {
      if (valor !== undefined && valor !== null) {
        elemento.setAttribute(chave, String(valor));
      }
    });
  }

  if (opcoes.eventos) {
    Object.entries(opcoes.eventos).forEach(([nomeEvento, manipulador]) => {
      elemento.addEventListener(nomeEvento, manipulador);
    });
  }

  filhos.filter(Boolean).forEach((filho) => {
    if (typeof filho === "string") {
      elemento.appendChild(document.createTextNode(filho));
    } else {
      elemento.appendChild(filho);
    }
  });

  return elemento;
}
