const prisma = require("../dist/generated/prisma").prisma;
const fs = require("fs");
const users_file = process.argv[2];

const users_data = JSON.parse(fs.readFileSync(users_file)).RECORDS;
users_data.forEach(
  async ({ ssn, firstname, lastname, email }) => {
    const newUser = await prisma.createUser({
      email,
      name: `${firstname} ${lastname}`,
      student_id: Number(ssn),
    });
    console.log(newUser.id);
  }
);
