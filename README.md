# Clínica Patas & Cia

Sistema Web para gestão de tutores e animais de estimação desenvolvido para o **Cenário 1 — Clínica veterinária de bairro** (Universidade de Fortaleza — Unifor).

- **Aplicação publicada:** https://carmomariana.github.io/clinica-patas-e-cia/
- **Repositório:** https://github.com/carmomariana/clinica-patas-e-cia

## Sobre o Projeto

A Clínica Patas & Cia atende dezenas de animais semanalmente e precisava substituir o controle manual em caderno por um sistema Web simples e organizado para cadastrar **tutores** e seus **animais**, facilitando buscas rápidas na recepção e evitando registros duplicados.

### Funcionalidades e Telas

1. **Lista de Tutores (`#/tutores`):** listagem dos tutores cadastrados com indicadores de atendimento, busca instantânea (por nome do tutor, telefone ou nome do animal) e visualização rápida dos animais vinculados.
2. **Cadastro e Edição de Tutor (`#/tutores/novo` e `#/tutores/:id/editar`):** formulário com máscara automática de telefone e validação de dados obrigatórios.
3. **Lista de Animais por Tutor (`#/tutores/:id/animais`):** exibição da ficha detalhada do tutor selecionado e listagem exclusiva dos animais pertencentes a ele (relação `1:N`).
4. **Cadastro e Edição de Animal (`#/tutores/:id/animais/novo` e `#/tutores/:id/animais/:animalId/editar`):** cadastro de animais vinculados ao tutor responsável com validação de espécie, sexo, idade e peso.

### Regras de Validação Implementadas

- Verificação de todos os campos obrigatórios de `Tutor` e `Animal` com mensagens claras por campo.
- Validação de formato de telefone brasileiro com DDD (`(DD) 9XXXX-XXXX` para celular e `(DD) XXXX-XXXX` para fixo).
- Validação de formato de e-mail (quando informado) e intervalos numéricos válidos para idade e peso do animal.
- **Proteção de integridade (`1:N`):** bloqueio da exclusão de tutores que ainda possuam animais cadastrados, orientando o usuário de forma clara.

## Estrutura em Camadas

O código foi organizado separando responsabilidades entre interface, regras de negócio, validações e persistência em memória:

```text
.
├── index.html                        # Estrutura semântica das telas
├── estilos/
│   └── principal.css                 # Estilização e responsividade
└── src/
    ├── aplicacao.js                  # Inicialização do sistema e rotas
    ├── dados/                        # Persistência em memória (Tutor e Animal)
    │   ├── bancoMemoria.js
    │   ├── tutorRepositorio.js
    │   └── animalRepositorio.js
    ├── validacoes/                   # Funções puras e reutilizáveis de validação
    │   ├── regrasComuns.js
    │   ├── validadorTutor.js
    │   └── validadorAnimal.js
    ├── servicos/                     # Regras de negócio e tratamento de erros
    │   ├── errosDominio.js
    │   ├── tutorServico.js
    │   └── animalServico.js
    └── interface/                    # Manipulação de DOM, eventos e navegação
        ├── roteador.js
        ├── telaListaTutores.js
        ├── telaFormularioTutor.js
        ├── telaListaAnimais.js
        ├── telaFormularioAnimal.js
        ├── componentes/
        │   ├── alertaFeedback.js
        │   ├── errosFormulario.js
        │   └── modalConfirmacao.js
        └── utilitarios/
            ├── dom.js
            └── formatadores.js
```

## Como Executar Localmente

Por utilizar módulos JavaScript nativos (`type="module"`), execute um servidor HTTP simples na pasta raiz do projeto:

```bash
python3 -m http.server 8000
```

Em seguida, acesse `http://localhost:8000` no navegador (ou utilize a extensão **Live Server** no VS Code).
