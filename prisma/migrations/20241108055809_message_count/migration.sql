-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "discordId" TEXT NOT NULL PRIMARY KEY,
    "snUsername" TEXT,
    "birthday" DATETIME,
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("birthday", "createdAt", "discordId", "snUsername") SELECT "birthday", "createdAt", "discordId", "snUsername" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_snUsername_key" ON "User"("snUsername");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
