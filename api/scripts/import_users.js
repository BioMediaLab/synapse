const prisma = require("../generated/js-prisma-client/index").prisma;
const fs = require("fs");
const users_file = process.argv[2];

const users_data = JSON.parse(fs.readFileSync(users_file)).RECORDS;

users_data.forEach(async ({ ssn, firstname, lastname, email, clicker_id }) => {
  const newUser = await prisma.createUser({
    email,
    name: `${firstname} ${lastname}`,
    student_id: Number(ssn),
    iClickerID: clicker_id,
    courses: {
      connect: [
        {
          id: "cjqpmveha00760a06r83sgk9h",
        },
      ],
    },
  });
  console.log(newUser.id);
});
