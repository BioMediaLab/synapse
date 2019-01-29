import { prisma } from '../generated/prisma'
async function main() {
const allUsers = await prisma.users()
  console.log(allUsers)
}
main().catch(e => console.error(e))
