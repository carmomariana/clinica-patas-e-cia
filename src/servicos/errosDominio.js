/**
 * Camada de Serviço - Erros de Domínio
 * Padroniza os erros lançados pela regra de negócio para que a interface
 * apresente mensagens claras e contextualizadas ao usuário.
 */

export class ErroValidacao extends Error {
  constructor(mensagem, errosPorCampo = {}) {
    super(mensagem);
    this.name = "ErroValidacao";
    this.errosPorCampo = errosPorCampo;
  }
}

export class ErroRegraNegocio extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = "ErroRegraNegocio";
  }
}

export class ErroNaoEncontrado extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = "ErroNaoEncontrado";
  }
}
