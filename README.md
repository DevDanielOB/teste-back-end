# 🔗 URL Shortener Project

Este é um encurtador de URLs simples e eficiente. Com ele, você pode transformar URLs longas em versões curtas, com suporte a redirecionamento e autenticação via JWT.

## 🚀 Tecnologias Utilizadas

- **Node.js** (v20+)
- **NestJS**
- **TypeORM**
- **Swagger** (documentação da API)
- **PostgreSQL / MySQL / SQL Server** (configurável)
- **Docker** e **Docker Compose**
- **OpenTelemetry** (telemetria e observabilidade)

## 📦 Pré-requisitos

- [Node.js](https://nodejs.org/) v20 ou superior (apenas se quiser rodar localmente sem Docker)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## ⚙️ Como Rodar o Projeto

1. **Clone o repositório**

```bash
git clone https://github.com/DevDanielOB/teste-back-end.git
cd teste-back-end
```

2. **Crie o arquivo `.env`**

Copie o `.env.example` para `.env` e ajuste se necessário.

```bash
cp .env.example .env
```

3. **Suba a aplicação com Docker Compose**

```bash
docker compose up --build
```

A API estará disponível em:  
➡️ `http://localhost:3498`

4. **Acesse a documentação Swagger**

```text
http://localhost:3498/swagger
```

## 🧪 Executando os Testes

Para rodar os testes com Docker Compose:

```bash
docker compose -f docker-compose.test.yml up --build
```

Ou se o arquivo já estiver integrado:

```bash
docker compose up test
```

## ✅ Funcionalidades

- Criar URLs encurtadas
- Redirecionamento automático
- Autenticação via JWT
- Validação de URLs
- Documentação Swagger

## 📌 Roadmap

- Fila para exclusão lógica com RabbitMQ 🗑️

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.
