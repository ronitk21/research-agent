-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "public"."ResearchJob" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'PENDING',
    "result" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobLog" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "step" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "JobLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResearchJob_status_idx" ON "public"."ResearchJob"("status");

-- AddForeignKey
ALTER TABLE "public"."JobLog" ADD CONSTRAINT "JobLog_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."ResearchJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
