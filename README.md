# Synapse

This is the main Synapse monorepo for version. It uses yarn workspaces and contains a web workspace and an api workspace.

## What is Synapse?

Synapse is a Web application developed by the BioMediaLab, part of the School of Biology at the University of Maine. It is used by multiple courses each semester to provide online resources, such as course handouts, quizzes, grades, and discussion.

Thie new verion of Synapse has been under full-time development since September, 2018.

# First Time Setup


###Downloading
The first step to running Synapse locally is downloading the code by cloning the repository:
```git clone https://github.com/BioMediaLab/synapse.git```

Make sure yarn is installed. If you're unfamilar with Yarn [check it out here](https://yarnpkg.com/en/) 
Make sure nodemon is installed ```sudo yarn global add nodemon```
Make sure prisma is installed ```sudo yarn global add prisma```

###Setup
Two .env files will need to be created.
Copy ROOT/api/.env.example and name the new file .env in the same directory
do the same for ROOT/web/.env.example 
Contact a Synapse admin for what to update these files with.

Go to ROOT/api and run ```prisma generate``` this will set up the backend. 

Go to ROOT/ and run ```yarn dev``` this will start the synapse frontend on localhost:3000 and the backend on localhost:4000

Synapse will now be running.

# Techonolgy Used

##Frontend

React.js

Apollo Client


##Backend

GraphQL Yoga

Prisma 