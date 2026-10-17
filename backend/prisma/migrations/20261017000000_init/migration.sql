CREATE TYPE "Stage" AS ENUM ('APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Candidate" (
  "id" TEXT NOT NULL,
  "recruiterId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "jobTitle" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "experienceYears" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "resumeUrl" TEXT,
  "stage" "Stage" NOT NULL DEFAULT 'APPLIED',
  "source" TEXT NOT NULL DEFAULT 'Direct',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "StageHistory" (
  "id" TEXT NOT NULL,
  "candidateId" TEXT NOT NULL,
  "previousStage" "Stage",
  "newStage" "Stage" NOT NULL,
  "changedById" TEXT NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StageHistory_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "CandidateActivity" (
  "id" TEXT NOT NULL,
  "candidateId" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "activityType" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CandidateActivity_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Candidate_recruiterId_email_key" ON "Candidate"("recruiterId", "email");
CREATE INDEX "Candidate_recruiterId_stage_idx" ON "Candidate"("recruiterId", "stage");
CREATE INDEX "Candidate_recruiterId_createdAt_idx" ON "Candidate"("recruiterId", "createdAt");
CREATE INDEX "Candidate_recruiterId_department_idx" ON "Candidate"("recruiterId", "department");
CREATE INDEX "StageHistory_candidateId_createdAt_idx" ON "StageHistory"("candidateId", "createdAt");
CREATE INDEX "CandidateActivity_candidateId_createdAt_idx" ON "CandidateActivity"("candidateId", "createdAt");
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StageHistory" ADD CONSTRAINT "StageHistory_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StageHistory" ADD CONSTRAINT "StageHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CandidateActivity" ADD CONSTRAINT "CandidateActivity_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CandidateActivity" ADD CONSTRAINT "CandidateActivity_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
