# Synapse

This is the main Synapse monorepo for version. It uses yarn workspaces and contains a web workspace and an api workspace.

## What is Synapse?

Synapse is a Web application developed by the BioMediaLab, part of the School of Biology at the University of Maine. It is used by multiple courses each semester to provide online resources, such as course handouts, quizzes, grades, and discussion.

Thie new verion of Synapse has been under full-time development since September, 2018.

# First Time Setup

The first step to run Synapse locally is downloading the code by cloning the repository:

```sh
git clone https://github.com/BioMediaLab/synapse.git
```

### Installation

**Install yarn**: If you're unfamilar with Yarn [check it out here](https://yarnpkg.com/en/)  
**Install nodemon**: `sudo yarn global add nodemon`  
**Install prisma**: `sudo yarn global add prisma`

### Setup

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

Now Synapse web layer will be running on `localhost:3000`, with the backend on `localhost:4000`

# Technology Used

## Frontend

React.js

Apollo Client

## Backend

GraphQL Yoga

Prisma
