
import 'dotenv/config';
import { PrismaClient, Stage } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const demoEmail = 'demo@miniats.dev';
  const demoPassword = 'DemoATS2026!';

  // Create the demo account or reset its password if it already exists.
  const passwordHash = await bcrypt.hash(demoPassword, 12);

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      passwordHash,
    },
    create: {
      name: 'Demo Recruiter',
      email: demoEmail,
      passwordHash,
    },
  });

  console.log(`Demo account ready: ${demoEmail}`);

  const existingCandidates = await prisma.candidate.count({
    where: { recruiterId: user.id },
  });

  if (existingCandidates === 0) {
    const rows = [
      {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        jobTitle: 'Senior Frontend Engineer',
        department: 'Engineering',
        experienceYears: 4,
        skills: ['React', 'TypeScript', 'CSS'],
        stage: 'INTERVIEW',
      },
      {
        name: 'Priya Nair',
        email: 'priya.nair@example.com',
        jobTitle: 'Product Designer',
        department: 'Design',
        experienceYears: 3,
        skills: ['Figma', 'Research', 'Prototyping'],
        stage: 'SCREENING',
      },
      {
        name: 'Rohan Mehta',
        email: 'rohan.mehta@example.com',
        jobTitle: 'Backend Engineer',
        department: 'Engineering',
        experienceYears: 5,
        skills: ['Node.js', 'PostgreSQL', 'Docker'],
        stage: 'OFFER',
      },
      {
        name: 'Ananya Rao',
        email: 'ananya.rao@example.com',
        jobTitle: 'Data Analyst',
        department: 'Analytics',
        experienceYears: 2,
        skills: ['SQL', 'Python', 'Power BI'],
        stage: 'APPLIED',
      },
      {
        name: 'Kabir Singh',
        email: 'kabir.singh@example.com',
        jobTitle: 'QA Engineer',
        department: 'Engineering',
        experienceYears: 3,
        skills: ['Playwright', 'API Testing'],
        stage: 'HIRED',
      },
      {
        name: 'Meera Iyer',
        email: 'meera.iyer@example.com',
        jobTitle: 'ML Engineer',
        department: 'AI & Data',
        experienceYears: 2,
        skills: ['Python', 'PyTorch', 'NLP'],
        stage: 'REJECTED',
      },
    ] satisfies Array<{
      name: string;
      email: string;
      jobTitle: string;
      department: string;
      experienceYears: number;
      skills: string[];
      stage: string;
    }>;

    for (const candidate of rows) {
      const createdCandidate = await prisma.$transaction(
        async (tx) => {
          const created = await tx.candidate.create({
            data: {
              recruiterId: user.id,
              name: candidate.name,
              email: candidate.email,
              jobTitle: candidate.jobTitle,
              department: candidate.department,
              experienceYears: candidate.experienceYears,
              skills: [...candidate.skills],
              stage: candidate.stage as Stage,
              source: 'LinkedIn',
              notes: 'Seed candidate for local evaluation.',
            },
          });

          await tx.stageHistory.create({
            data: {
              candidateId: created.id,
              changedById: user.id,
              newStage: created.stage,
              note: 'Initial seeded stage',
            },
          });

          await tx.candidateActivity.create({
            data: {
              candidateId: created.id,
              actorId: user.id,
              activityType: 'CREATED',
              description: 'Candidate added to the pipeline',
            },
          });

          return created;
        },
      );

      console.log(`Created candidate: ${createdCandidate.name}`);
    }
  } else {
    console.log(
      `Seed skipped: ${existingCandidates} candidate(s) already exist.`,
    );
  }

  console.log('Demo login: demo@miniats.dev / DemoATS2026!');
}

main()
  .catch((error: unknown) => {
    console.error('Database seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
