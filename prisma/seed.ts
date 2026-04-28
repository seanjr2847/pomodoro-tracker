import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 시드 데이터 생성 시작...");

  // 테스트 사용자 생성 (이미 존재하면 upsert)
  const testUser = await prisma.user.upsert({
    where: { email: "test@pomodoro-tracker.com" },
    update: {},
    create: {
      email: "test@pomodoro-tracker.com",
      name: "테스트 사용자",
      emailVerified: new Date(),
    },
  });

  console.log(`✅ 테스트 사용자 생성: ${testUser.email}`);

  // 카테고리 생성
  const categories = await Promise.all([
    prisma.category.upsert({
      where: {
        id: "cat-study",
      },
      update: {},
      create: {
        id: "cat-study",
        userId: testUser.id,
        name: "공부",
        color: "#EF4444",
      },
    }),
    prisma.category.upsert({
      where: {
        id: "cat-coding",
      },
      update: {},
      create: {
        id: "cat-coding",
        userId: testUser.id,
        name: "코딩",
        color: "#3B82F6",
      },
    }),
    prisma.category.upsert({
      where: {
        id: "cat-exercise",
      },
      update: {},
      create: {
        id: "cat-exercise",
        userId: testUser.id,
        name: "운동",
        color: "#22C55E",
      },
    }),
    prisma.category.upsert({
      where: {
        id: "cat-reading",
      },
      update: {},
      create: {
        id: "cat-reading",
        userId: testUser.id,
        name: "독서",
        color: "#A855F7",
      },
    }),
  ]);

  console.log(`✅ ${categories.length}개 카테고리 생성`);

  // 최근 7일간 포모도로 세션 생성
  const sessions = [];
  const now = new Date();

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const day = new Date(now);
    day.setDate(day.getDate() - dayOffset);
    day.setHours(9, 0, 0, 0); // 오전 9시부터 시작

    // 각 날짜에 2~4개 세션 랜덤 생성
    const sessionCount = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < sessionCount; i++) {
      const startedAt = new Date(day);
      startedAt.setHours(startedAt.getHours() + i);

      const completedAt = new Date(startedAt);
      completedAt.setMinutes(completedAt.getMinutes() + 25);

      const categoryIndex = Math.floor(Math.random() * categories.length);
      const category = categories[categoryIndex];

      sessions.push({
        userId: testUser.id,
        categoryId: category.id,
        durationMin: 25,
        type: "work",
        startedAt,
        completedAt,
      });
    }
  }

  // 세션을 한 번에 생성
  await prisma.pomodoroSession.createMany({
    data: sessions,
    skipDuplicates: true,
  });

  console.log(`✅ ${sessions.length}개 포모도로 세션 생성`);

  console.log("🎉 시드 데이터 생성 완료!");
}

main()
  .catch((e) => {
    console.error("❌ 시드 데이터 생성 실패:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
