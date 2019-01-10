const prisma = require("../generated/js-prisma-client/index").prisma;
const fs = require("fs");
const users_file = process.argv[2];

const users_data = JSON.parse(fs.readFileSync(users_file)).RECORDS;

users_data.forEach(async ({ ssn, firstname, lastname, email, clicker_id }) => {
  const newUser = await prisma.upsertUser({
    where: {
      email,
    },
    update: {
      email,
      name: `${firstname} ${lastname}`,
      student_id: Number(ssn),
      iClickerID: clicker_id,
      courseRoles: {
        create: [
          {
            user_type: "STUDENT",
            course: {
              connect: {
                id: "cjqqrnl8g011l0a06hqrli4k2",
              },
            },
          },
        ],
      },
    },
    create: {
      email,
      name: `${firstname} ${lastname}`,
      student_id: Number(ssn),
      iClickerID: clicker_id,
      courseRoles: {
        create: [
          {
            user_type: "STUDENT",
            course: {
              connect: {
                id: "cjqqrnl8g011l0a06hqrli4k2",
              },
            },
          },
        ],
      },
    },
  });
  console.log(newUser.id);
});
