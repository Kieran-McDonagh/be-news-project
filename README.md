# Northcoders News API

Northcoders news API is a project I have built for the Northcoders software development bootcamp. This README provides an overview of the project, and instructions for setting it up and running it on your local machine.

## Table of Contents

- [Demo](#demo)
- [Description](#description)
- [Getting Started](#getting-started)
  - [Minimum requirements](#minimum-requirements)
  - [Installation](#installation)
  - [Setting Up the Database](#setting-up-the-database)
  - [Running Tests](#running-tests)
- [Contact](#contact)

## Demo

View the hosted version of the project at https://news-api-rist.onrender.com/api/.

## Description

This API was created using Node.js and PSQL in order to showcase my understanding of backend development.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Minimum requirements

Before you begin, ensure you have the following installed:

- Node.js [v20.5.0]
- PostgreSQL [15.3]

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Kieran-McDonagh/be-news-project
```

2. Install dependencies:

```bash
npm install
```

### Setting up the database

1. You will need to create two .env files: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names).

2. Create and seed the database:

```bash
 npm run setup-dbs
 npm run seed
```

### Running tests

To run tests:

```bash
npm test
```

### Contact

GitHub - [Kieran-McDonagh](https://github.com/Kieran-McDonagh)