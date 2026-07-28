import { PrismaClient, Category, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const spendingDescriptions = ["Groceries", "Rent", "Electricity bill", "Internet", "Dining out", "Fuel", "Subscriptions", "Coffee"];
const investingDescriptions = ["Index fund buy", "Stock purchase", "Crypto DCA", "Bond purchase", "ETF top-up"];
const savingDescriptions = ["Emergency fund", "Transfer to savings", "Round-up savings", "Bonus set aside"];
const incomeDescriptions = ["Client payment", "Salary", "Freelance project", "Consulting fee", "Dividend payout"];

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.settings.deleteMany();

  await prisma.settings.create({
    data: { id: "singleton", currency: "USD", accentColor: "violet", theme: "dark", defaultCategory: Category.SPENDING, startingBalance: 5000 },
  });

  const now = new Date();
  const monthsBack = 8;
  const rows = [];

  for (let m = monthsBack; m >= 0; m--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - m + 1, 0);

    // 1-2 income entries per month
    const incomeCount = 1 + Math.round(Math.random());
    for (let i = 0; i < incomeCount; i++) {
      rows.push({
        amount: Math.round(1800 + Math.random() * 3200),
        type: TransactionType.INCOME,
        category: Category.SPENDING,
        description: incomeDescriptions[Math.floor(Math.random() * incomeDescriptions.length)],
        date: randomDate(monthStart, monthEnd),
      });
    }

    // 4-7 spending entries
    const spendCount = 4 + Math.floor(Math.random() * 4);
    for (let i = 0; i < spendCount; i++) {
      rows.push({
        amount: Math.round(15 + Math.random() * 400),
        type: TransactionType.EXPENSE,
        category: Category.SPENDING,
        description: spendingDescriptions[Math.floor(Math.random() * spendingDescriptions.length)],
        date: randomDate(monthStart, monthEnd),
      });
    }

    // 1-3 investing entries
    const investCount = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < investCount; i++) {
      rows.push({
        amount: Math.round(100 + Math.random() * 900),
        type: TransactionType.EXPENSE,
        category: Category.INVESTING,
        description: investingDescriptions[Math.floor(Math.random() * investingDescriptions.length)],
        date: randomDate(monthStart, monthEnd),
      });
    }

    // 1-2 saving entries
    const saveCount = 1 + Math.round(Math.random());
    for (let i = 0; i < saveCount; i++) {
      rows.push({
        amount: Math.round(50 + Math.random() * 600),
        type: TransactionType.EXPENSE,
        category: Category.SAVING,
        description: savingDescriptions[Math.floor(Math.random() * savingDescriptions.length)],
        date: randomDate(monthStart, monthEnd),
      });
    }
  }

  await prisma.transaction.createMany({ data: rows });
  console.log(`Seeded ${rows.length} transactions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
