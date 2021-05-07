-- CreateTable
CREATE TABLE "Stats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "updated" TEXT NOT NULL,
    "cases" INTEGER NOT NULL,
    "todayCases" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    "todayDeaths" INTEGER NOT NULL,
    "recoverd" INTEGER NOT NULL,
    "todayRecovered" INTEGER NOT NULL,
    "recoveredPerOneMillion" REAL NOT NULL,
    "active" INTEGER NOT NULL,
    "activePerOneMillion" REAL NOT NULL,
    "critical" INTEGER NOT NULL,
    "criticalPerOneMillion" REAL NOT NULL,
    "casesPerOneMillion" REAL NOT NULL,
    "deathsPerOneMillion" REAL NOT NULL,
    "tests" INTEGER NOT NULL,
    "testsPerOneMillion" REAL NOT NULL,
    "population" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Country" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL
);
