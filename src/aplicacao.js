/**
 * Ponto de Entrada da Aplicação - Clínica Patas & Cia
 * Conecta as rotas da interface aos respectivos controladores de tela.
 */

import { iniciarRoteador } from "./interface/roteador.js";
import {
  exibirTelaEditarAnimal,
  exibirTelaNovoAnimal,
} from "./interface/telaFormularioAnimal.js";
import {
  exibirTelaEditarTutor,
  exibirTelaNovoTutor,
} from "./interface/telaFormularioTutor.js";
import { exibirTelaListaAnimais } from "./interface/telaListaAnimais.js";
import { exibirTelaListaTutores } from "./interface/telaListaTutores.js";

function inicializarSistema() {
  window.__PATAS_E_CIA_CARREGADO__ = true;

  iniciarRoteador({
    "lista-tutores": () => exibirTelaListaTutores(),
    "novo-tutor": () => exibirTelaNovoTutor(),
    "editar-tutor": ({ tutorId }) => exibirTelaEditarTutor(tutorId),
    "lista-animais": ({ tutorId }) => exibirTelaListaAnimais(tutorId),
    "novo-animal": ({ tutorId }) => exibirTelaNovoAnimal(tutorId),
    "editar-animal": ({ tutorId, animalId }) =>
      exibirTelaEditarAnimal(tutorId, animalId),
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarSistema);
} else {
  inicializarSistema();
}
