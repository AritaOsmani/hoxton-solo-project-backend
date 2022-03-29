-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'https://freepikpsd.com/file/2019/10/default-user-profile-image-png-2-Transparent-Images-300x300.png',
    "bio" TEXT,
    "password" TEXT NOT NULL,
    "accountStatus" TEXT NOT NULL DEFAULT 'public',
    "verified" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("accountStatus", "bio", "email", "firstName", "id", "image", "lastName", "password", "username", "verified") SELECT "accountStatus", "bio", "email", "firstName", "id", "image", "lastName", "password", "username", "verified" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
