// file: admin/admin/scripts/check-data.ts (Updated to CommonJS)

// Use require instead of import
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Checking database data...');

  const userCount = await prisma.user.count();
  console.log(`Found ${userCount} users.`);

  const triggerCount = await prisma.trigger.count();
  console.log(`Found ${triggerCount} triggers.`);

  const firstTemplate = await prisma.template.count();
  if (firstTemplate) {
    console.log('Found at least one template. First one is:', firstTemplate.content);
  } else {
    console.log('No templates found.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });