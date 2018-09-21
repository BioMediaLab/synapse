const { prisma } = require("../generated/prisma");

const main = async () => {
  const newUser = await prisma.createUser({
    name: "Alice",
    email: "alice@prisma.io",
  })
  const allUsers = await prisma.users()
  console.log(allUsers);

};

console.log("hello world");
main();
