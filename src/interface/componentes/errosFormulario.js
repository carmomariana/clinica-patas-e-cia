/**
 * Componente Reutilizável de Erros de Formulário
 * Exibe e limpa mensagens de validação por campo sem duplicar lógica entre telas.
 */

export function limparErroDoCampo(formulario, nomeCampo) {
  const campo = formulario.elements.namedItem(nomeCampo);
  const elementoErro = formulario.querySelector(
    `[data-erro-campo="${nomeCampo}"]`
  );

  if (campo && campo instanceof HTMLElement) {
    campo.classList.remove("campo-invalido");
    campo.removeAttribute("aria-invalid");
  }

  if (elementoErro) {
    elementoErro.textContent = "";
    elementoErro.hidden = true;
  }
}

export function limparTodosErrosFormulario(formulario) {
  const camposInvalidos = formulario.querySelectorAll(".campo-invalido");
  camposInvalidos.forEach((campo) => {
    campo.classList.remove("campo-invalido");
    campo.removeAttribute("aria-invalid");
  });

  const mensagensErro = formulario.querySelectorAll("[data-erro-campo]");
  mensagensErro.forEach((elementoErro) => {
    elementoErro.textContent = "";
    elementoErro.hidden = true;
  });
}

export function exibirErrosNoFormulario(formulario, errosPorCampo = {}) {
  limparTodosErrosFormulario(formulario);

  let primeiroCampoComErro = null;

  Object.entries(errosPorCampo).forEach(([nomeCampo, mensagem]) => {
    const campo = formulario.elements.namedItem(nomeCampo);
    const elementoErro = formulario.querySelector(
      `[data-erro-campo="${nomeCampo}"]`
    );

    if (campo && campo instanceof HTMLElement) {
      campo.classList.add("campo-invalido");
      campo.setAttribute("aria-invalid", "true");

      if (!primeiroCampoComErro) {
        primeiroCampoComErro = campo;
      }
    }

    if (elementoErro) {
      elementoErro.textContent = mensagem;
      elementoErro.hidden = false;
    }
  });

  if (primeiroCampoComErro) {
    primeiroCampoComErro.focus();
  }
}

export function ativarLimpezaAutomaticaDeErros(formulario) {
  const atualizarCampo = (evento) => {
    const alvo = evento.target;
    if (alvo && "name" in alvo && alvo.name) {
      limparErroDoCampo(formulario, alvo.name);
    }
  };

  formulario.addEventListener("input", atualizarCampo);
  formulario.addEventListener("change", atualizarCampo);
}
