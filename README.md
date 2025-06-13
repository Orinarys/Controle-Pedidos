# 📦 Aplicação de Controle de Pedidos

Esta é uma aplicação **React** simples e intuitiva para gerenciamento de pedidos. Com ela, você pode adicionar, rastrear, filtrar e resumir pedidos, além de contar com temas claro/escuro e persistência de dados local.

---

## ✨ Funcionalidades

- **Adicionar Novos Pedidos**  
  Inclua número do pedido, nome do cliente, descrição (opcional), peso, valor e status.

- **Alternar Status**  
  Marque pedidos como "Finalizado" ou "Pendente" com apenas um clique.

- **Persistência de Dados**  
  Os dados são salvos no **localStorage**, garantindo que não sejam perdidos mesmo ao fechar a aplicação.

- **Filtragem e Busca**
  - **Por Nome:** Filtre rapidamente pelo nome do cliente.
  - **Por Status:** Veja somente pedidos finalizados ou pendentes.
  - **Por Data:** Filtre pedidos por intervalo de datas.

- **Resumo dos Pedidos**  
  Veja o **valor total** e o **peso total** dos pedidos filtrados.

- **Cálculo de Comissão**  
  Calcule automaticamente a comissão com base em uma porcentagem definida do valor total.

- **Exportar para CSV**  
  Exporte os pedidos filtrados para um arquivo `.csv`.

- **Design Responsivo**  
  Interface amigável e adaptável para dispositivos móveis, feita com Tailwind CSS.

- **Modo Escuro**  
  Alterne entre os temas claro e escuro com um clique.

---

## 🛠️ Tecnologias Utilizadas

- **React** – Biblioteca JavaScript para construção de interfaces.
- **Tailwind CSS** – Framework CSS com classes utilitárias.
- **Shadcn/UI** – Conjunto de componentes acessíveis com Radix UI + Tailwind CSS.

---

## 🚀 Primeiros Passos

### Pré-requisitos

- [Node.js](https://nodejs.org) (versão LTS recomendada)  
- npm ou [Yarn](https://yarnpkg.com/)

### Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio

Instale as dependências:

npm install
# ou
yarn install

Execute a aplicação:

npm start
# ou
yarn start

Acesse no navegador: http://localhost:3000

💡 Como Usar
✅ Adicionando um Pedido
Preencha os campos:

Número do Pedido

Nome do Cliente

Valor do Pedido

Peso do Pedido

(opcional) Descrição

(Opcional) Marque como finalizado.

Clique em "Adicionar Pedido".

🔄 Gerenciando Pedidos
Alternar Status: Clique no botão correspondente em cada pedido.

Excluir Pedido: Clique em "Excluir" e confirme a remoção.

🔍 Filtrando Pedidos
Por Nome: Digite na barra de busca.

Por Status: Use o menu suspenso para escolher.

Por Data: Selecione a data de início e fim.

📤 Exportando Pedidos
Clique em "Exportar CSV" para baixar os pedidos filtrados.

🌙 Modo Escuro
Clique no ícone de lua/sol para alternar entre os temas.

📂 Estrutura do Projeto
csharp
Copiar
Editar
├── public/
├── src/
│   ├── components/
│   │   ├── ui/             # Componentes base (button, input, card, etc.)
│   │   └── ...             # Outros componentes personalizados
│   ├── App.js              # Componente principal
│   ├── index.js            # Ponto de entrada da aplicação
│   └── ...
├── .gitignore
├── package.json
├── README.md
└── tailwind.config.js
🤝 Contribuição
Contribuições são bem-vindas!
Abra uma issue para relatar bugs ou sugerir melhorias, ou envie um pull request com sua contribuição.

📄 Licença
Este projeto está licenciado sob os termos da Licença MIT.
