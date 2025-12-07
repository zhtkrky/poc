-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "statusColor" TEXT NOT NULL,
    "progress" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "done" INTEGER NOT NULL,
    "due" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "ownerImg" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "projectColor" TEXT NOT NULL,
    "due" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Stat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "change" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Performance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "overall" INTEGER NOT NULL,
    "change" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Summary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tasksDueToday" INTEGER NOT NULL,
    "overdueTasks" INTEGER NOT NULL,
    "upcomingDeadlines" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CarDiagnosis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vehicleInfo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CarPart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "updatedAt" DATETIME,
    "diagnosisId" INTEGER NOT NULL,
    CONSTRAINT "CarPart_diagnosisId_fkey" FOREIGN KEY ("diagnosisId") REFERENCES "CarDiagnosis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
