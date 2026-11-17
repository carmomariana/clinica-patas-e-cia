/**
 * Camada de Dados - Banco em Memória
 * Mantém as coleções de Tutores e Animais em memória durante a sessão,
 * preservando o relacionamento 1:N (um Tutor possui vários Animais via tutorId).
 */

const estadoMemoria = {
  proximoIdTutor: 4,
  proximoIdAnimal: 4,
  tutores: [
    {
      id: 1,
      nome: "Ana Paula Mendes",
      telefone: "(85) 99812-3456",
      email: "ana.mendes@email.com",
      endereco: "Rua Barbosa de Freitas, 1240 - Aldeota",
      observacoes: "Prefere agendamentos no período da manhã.",
    },
    {
      id: 2,
      nome: "Carlos Eduardo Rocha",
      telefone: "(85) 98745-1122",
      email: "carlos.rocha@email.com",
      endereco: "Av. Washington Soares, 1321 - Edson Queiroz",
      observacoes: "Cliente desde 2024.",
    },
    {
      id: 3,
      nome: "Mariana Costa Lima",
      telefone: "(85) 3241-5588",
      email: "mariana.lima@email.com",
      endereco: "Rua Nunes Valente, 890 - Meireles",
      observacoes: "Cadastro recém-realizado na recepção.",
    },
  ],
  animais: [
    {
      id: 1,
      tutorId: 1,
      nome: "Thor",
      especie: "Cachorro",
      raca: "Golden Retriever",
      sexo: "Macho",
      idadeAnos: 4,
      pesoKg: 31.5,
      observacoes: "Vacinação antirrábica em dia. Alergia a dipirona.",
    },
    {
      id: 2,
      tutorId: 1,
      nome: "Mel",
      especie: "Gato",
      raca: "Siamês",
      sexo: "Fêmea",
      idadeAnos: 2,
      pesoKg: 3.8,
      observacoes: "Animal dócil, porém assustada com barulhos altos.",
    },
    {
      id: 3,
      tutorId: 2,
      nome: "Pipoca",
      especie: "Cachorro",
      raca: "SRD (Sem Raça Definida)",
      sexo: "Fêmea",
      idadeAnos: 1,
      pesoKg: 8.2,
      observacoes: "Retorno de acompanhamento nutricional.",
    },
  ],
};

export function obterColecaoTutores() {
  return estadoMemoria.tutores;
}

export function obterColecaoAnimais() {
  return estadoMemoria.animais;
}

export function gerarNovoIdTutor() {
  const idGerado = estadoMemoria.proximoIdTutor;
  estadoMemoria.proximoIdTutor += 1;
  return idGerado;
}

export function gerarNovoIdAnimal() {
  const idGerado = estadoMemoria.proximoIdAnimal;
  estadoMemoria.proximoIdAnimal += 1;
  return idGerado;
}
