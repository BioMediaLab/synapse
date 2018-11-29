<div align="center">
<img src="./web/static/synapse-icon@2x.png" alt="synapse logo">

<h3 align="center">Synapse</h3>

  <p align="center">
    Classroom management software
    <br>
    <br>
    <a href="https://github.com/BioMediaLab/synapse/issues/new"> Report bug </a>
    .
        <a href="https://github.com/BioMediaLab/synapse/issues/new"> Request Features </a>
        .
        <a href="mailto:synapse@maine.edu" target="_top"> Contact </a>
        .
        <a href="https://www.biomedialab.net/"> About us </a>
  </p>
</div>

Synapse is a Web application developed by the BioMediaLab, part of the School of Biology at the University of Maine. It is used by multiple courses each semester to provide online resources, such as course handouts, quizzes, grades, and discussion.

This new version of Synapse has been under full-time development since September, 2018.

## Table of contents

- [Installation](#installation)
  - [Configuration](#configuration)
- [Development](#development)
- [Guidelines for Commits](#guidelines-for-commits)
- [Naming Conventions](#naming-conventions)
- [Contributions](#contributions)
- [Technology Used](#technology-used)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [VScode Addons](#vscode-addons)
  - [Required](#required)
  - [Reccomended](#reccomended)

# Installation

```sh
git clone https://github.com/BioMediaLab/synapse.git
```

```sh
cd synapse
```

```sh
yarn
```

> `yarn` is shorthand for `yarn install`

## Configuration

A `.env` file will need to be created in both the `api` and `web` workspaces.

```sh
cp api/.env.example .env
```

and

```sh
cp web/.env.example .env
```

> Contact a Synapse Admin for any secret .env variables

> `.env` files NEVER get committed to git.

# Development

### Run a local database instance

You will probably want to run a local Prisma server as a backend for the api. You can do this with the Docker and
the `docker-compose.yml` file at the root of this repository.

Steps

1. Edit the `.env` file in `/api`.

| Variable                       | Value                 |
| ------------------------------ | --------------------- |
| `PRISMA_ENDPOINT`              | http://localhost:4466 |
| `PRISMA_MANAGEMENT_API_SECRET` | my-secret             |

2. If you would like to make the data persistent, edit the `docker-compose.yml` file so that the volume `mysql` points to a real directory on your computer.

3. Run the database with `docker-compose up -d`.

4. Run `prisma deploy` from the `/api` directory.

5. If you want to use the graphql playground with prisma, create an HTTP header in it:

```json
{
  "Authorization": "Bearer <token from `prisma token>"
}
```

### Run the app

```sh
yarn run dev
```

> This will also run `predev` which runs `yarn` to install new packages and `prisma generate` in the api workspace to handle any database schema changes.

# Guidelines for Commits

# Naming Conventions

# Contributions

Ron Kozlowski - Product Manager & Director <a href="https://www.linkedin.com/in/tirranna/" target="_blank"><img src="https://3uil8r2z7mmf1j7qlc2us9x1121h-wpengine.netdna-ssl.com/wp-content/plugins/team-members-pro/inc/img/links/linkedin.png" height=15px width=15px></a>
<a href="https://github.com/frozenflat" target="_blank"><img src="https://assets-cdn.github.com/images/modules/logos_page/GitHub-Logo.png" height=10px></a>
<br/>
Andy Kay - Head Software Engineer <a href="https://www.linkedin.com/in/andy-kay-450474120" target="_blank"><img src="https://3uil8r2z7mmf1j7qlc2us9x1121h-wpengine.netdna-ssl.com/wp-content/plugins/team-members-pro/inc/img/links/linkedin.png" height=15px width=15px></a>
<a href="https://github.com/iamandyk" target="_blank"><img src="https://assets-cdn.github.com/images/modules/logos_page/GitHub-Logo.png" height=10px></a>
<br/>
Nick Dieffenbacher-Krall - Student Software Engineer
<a href="https://github.com/Dieff" target="_blank"><img src="https://assets-cdn.github.com/images/modules/logos_page/GitHub-Logo.png" height=10px></a>
<br/>
Matthew Loewen - Student Software Engineer <a href="https://www.linkedin.com/in/matthew-loewen-03a991116/" target="_blank"><img src="https://3uil8r2z7mmf1j7qlc2us9x1121h-wpengine.netdna-ssl.com/wp-content/plugins/team-members-pro/inc/img/links/linkedin.png" height=15px width=15px></a>
<a href="https://github.com/mattdoescode" target="_blank"><img src="https://assets-cdn.github.com/images/modules/logos_page/GitHub-Logo.png" height=10px></a>
<br/>
Enoch Lin - Student Software Engineer
<a href="https://github.com/Enoinoo" target="_blank"><img src="https://assets-cdn.github.com/images/modules/logos_page/GitHub-Logo.png" height=10px></a>

# Technology Used

## Frontend

React.js

Next.js

Apollo Client

## Backend

GraphQL Yoga

Prisma

# VScode Addons

## Required

- [Visual Studo Code](https://code.visualstudio.com/)

- [tslint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)

- [Prettier for VsCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Reccomended

- [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)

- [GraphQL](https://marketplace.visualstudio.com/items?itemName=mquandalle.graphql)

- [Graphql For VsCode](https://marketplace.visualstudio.com/items?itemName=kumar-harsh.graphql-for-vscode)
