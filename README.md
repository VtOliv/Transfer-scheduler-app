# Transfer Scheduler App

Interface web para agendamento e consulta de transferências financeiras, desenvolvida em **Angular 21** com **Angular Material**.

Este projeto consome a API do backend `Transfer-scheduler-service`.

---

## 📌 Objetivo

Permitir ao usuário:

- Agendar transferências financeiras
- Visualizar o extrato de transferências agendadas
- Receber feedback visual sobre sucesso ou erro das operações

---

## 🛠️ Tecnologias utilizadas

- Angular 21.2.x
- Angular Material
- RxJS
- Reactive Forms
- TypeScript
- HTML / SCSS

---

## 🚀 Como executar o projeto

### Pré-requisitos

- Node.js (v18+ recomendado)
- Angular CLI

### Instalação

    npm install

### Executando

    ng serve

A aplicação estará disponível em:

    http://localhost:4200

---

## 🔗 Integração com Backend

Este frontend consome a API:

    http://localhost:8097/transfers

Certifique-se de que o backend esteja rodando antes de iniciar o frontend.

---

## 📡 Funcionalidades

### 🔹 Nova Transferência

- Cadastro de agendamento
- Validação de campos:
  - Conta com **10 dígitos**
  - Valor maior que zero
  - Data não pode ser anterior à atual
- Formatação de valor em padrão brasileiro
- Feedback visual:
  - Sucesso → Snackbar
  - Erro → Snackbar com mensagem da API

---

### 🔹 Extrato de Transferências

- Listagem das transferências cadastradas
- Exibição de:
  - Conta origem
  - Conta destino
  - Valor
  - Taxa
  - Data de agendamento
  - Data da transferência
- Estado vazio quando não há registros
- Tratamento de erro com feedback visual

---

## 🎨 Interface

- Angular Material
- Layout responsivo
- Navbar adaptável para mobile
- Componentes utilizados:
  - MatToolbar
  - MatFormField
  - MatInput
  - MatDatepicker
  - MatTable
  - MatSnackBar

---

## 🧠 Decisões arquiteturais

- Uso de **Standalone Components**
- Separação por responsabilidade:
  - Component → UI
  - Service → API
- Uso de **Reactive Forms** para validação
- Integração com backend via `HttpClient`
- Feedback ao usuário com `MatSnackBar`
- Configuração de locale `pt-BR` para datas e valores

---

## ⚠️ Validações importantes

- Conta deve conter exatamente **10 dígitos numéricos**
- Valor deve ser maior que zero
- Data não pode ser anterior à data atual
- Erros retornados pela API são exibidos ao usuário

---

## 📁 Estrutura do projeto

    src/app
     ├── components
     │   ├── transfer-form
     │   └── transfer-list
     ├── services
     │   └── transfer-service
     ├── app.routes.ts
     ├── app.config.ts

---

## 📌 Observações

Este projeto foi desenvolvido como parte de um teste técnico, com foco em:

- aderência aos requisitos
- boas práticas de desenvolvimento
- organização de código
- experiência do usuário

---
