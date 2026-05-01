const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = 12;

  // ── Create Admin User ─────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', saltRounds);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@taskflow.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // ── Create Regular Users ──────────────────
  const user1Password = await bcrypt.hash('User@1234', saltRounds);
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@taskflow.com',
      password: user1Password,
      role: 'USER',
    },
  });

  const user2Password = await bcrypt.hash('User@1234', saltRounds);
  const user2 = await prisma.user.create({
    data: {
      email: 'user2@taskflow.com',
      password: user2Password,
      role: 'USER',
    },
  });

  const user3Password = await bcrypt.hash('User@1234', saltRounds);
  const user3 = await prisma.user.create({
    data: {
      email: 'user3@taskflow.com',
      password: user3Password,
      role: 'USER',
    },
  });

  console.log(`✅ Users created: ${user1.email}, ${user2.email}, ${user3.email}`);

  // ── Create Sample Tasks ───────────────────
  const tasks = [
    {
      title: 'Set up project architecture',
      description: 'Define folder structure, install dependencies, and configure the development environment.',
      status: 'DONE',
      priority: 'HIGH',
      dueDate: new Date('2025-12-15'),
      userId: admin.id,
    },
    {
      title: 'Implement JWT authentication',
      description: 'Build register and login endpoints with JWT access and refresh tokens.',
      status: 'DONE',
      priority: 'HIGH',
      dueDate: new Date('2025-12-20'),
      userId: admin.id,
    },
    {
      title: 'Design database schema',
      description: 'Create Prisma schema with User and Task models including all enums and indexes.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date('2026-01-05'),
      userId: user1.id,
    },
    {
      title: 'Build task CRUD API',
      description: 'Implement create, read, update, and delete endpoints for tasks with proper validation.',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date('2026-01-15'),
      userId: user1.id,
    },
    {
      title: 'Add Redis caching layer',
      description: 'Implement Redis caching for task list queries with automatic cache invalidation on writes.',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date('2026-01-25'),
      userId: user1.id,
    },
    {
      title: 'Create React frontend',
      description: 'Set up Vite + React project with Tailwind CSS, routing, and component structure.',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date('2026-02-01'),
      userId: user2.id,
    },
    {
      title: 'Implement dashboard page',
      description: 'Build the main dashboard with task statistics, recent tasks, and quick action buttons.',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date('2026-02-10'),
      userId: user2.id,
    },
    {
      title: 'Write API documentation',
      description: 'Add complete Swagger/OpenAPI documentation for all endpoints with request/response examples.',
      status: 'IN_PROGRESS',
      priority: 'LOW',
      dueDate: new Date('2026-02-15'),
      userId: user3.id,
    },
    {
      title: 'Set up Docker deployment',
      description: 'Create Dockerfiles and docker-compose configuration for full-stack deployment.',
      status: 'TODO',
      priority: 'LOW',
      dueDate: new Date('2026-02-20'),
      userId: user3.id,
    },
    {
      title: 'Performance testing and optimization',
      description: 'Run load tests, optimize database queries, and fine-tune Redis caching strategies.',
      status: 'TODO',
      priority: 'LOW',
      userId: user3.id,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  console.log(`✅ ${tasks.length} tasks created`);
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
