<p align="center">
    <img src="./web/static/synapse-icon@2x.png" alt="synapse logo">
    <h3 align="center">Synapse</h3>

  <p align="center">
    Classroom manamnent software
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
</p>

Synapse is a Web application developed by the BioMediaLab, part of the School of Biology at the University of Maine. It is used by multiple courses each semester to provide online resources, such as course handouts, quizzes, grades, and discussion.

Thie new verion of Synapse has been under full-time development since September, 2018.

## Table of contents

- [Guidelines for Commits](#guidelines-for-commits)
- [Naming Conventions](#naming-conventions)
- [Contributions](#contributions)
- [Technology Used](#technology-used)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [VScode Addons](#vscode-addons)
  - [Required](#required)
  - [Reccomended](#reccomended)

### Installation

```sh
git clone https://github.com/BioMediaLab/synapse.git
```

```sh
cd synapse
```

```sh
yarn
```

### Development

```sh
yarn dev
```

#### Create .env files

Two .env files will need to be created.  
Copy and paste `api/.env.example` to the same directory, and name the new file `.env`  
Do the same thing for `web/.env.example`
Contact a Synapse admin for what to update these files with.

#### Generate files needed for backend server

In the `/synapse/api` directory, run

```sh
prisma generate
```

#### Start up the servers

In the `/synapse` directory, run

```sh
yarn dev
```

Now Synapse the web layer will be running on `localhost:3000`, with the backend running on `localhost:4000`

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

<a href="https://marketplace.visualstudio.com/items?itemName=eg2.tslint"> TsLint </a>
</br>
<a href="https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode"> Prettier </a>

## Reccomended

<a href="https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv"> DotENV </a>
</br>
<a href="https://marketplace.visualstudio.com/items?itemName=mquandalle.graphql"> GraphQL </a>
