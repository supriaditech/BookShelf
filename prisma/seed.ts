// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin_password02', 10);
  const userPassword = await bcrypt.hash('user_password02', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin1@example.com' },
    update: {},
    create: {
      username: 'admin1',
      name: 'admin',
      email: 'admin1@example.com',
      password: adminPassword,
      create_At: new Date(),
      update_At: new Date(),
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      username: 'user1',
      name: 'admin',
      email: 'user1@example.com',
      password: userPassword,
      create_At: new Date(),
      update_At: new Date(),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
