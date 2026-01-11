-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "World" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "World_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnchantmentEntry" (
    "id" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "enchantmentId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL DEFAULT 0,
    "villagerId" TEXT,
    "modifiedBy" TEXT NOT NULL,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnchantmentEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WorldMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WorldMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "World_name_key" ON "World"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EnchantmentEntry_worldId_enchantmentId_key" ON "EnchantmentEntry"("worldId", "enchantmentId");

-- CreateIndex
CREATE INDEX "_WorldMembers_B_index" ON "_WorldMembers"("B");

-- AddForeignKey
ALTER TABLE "EnchantmentEntry" ADD CONSTRAINT "EnchantmentEntry_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorldMembers" ADD CONSTRAINT "_WorldMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorldMembers" ADD CONSTRAINT "_WorldMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "World"("id") ON DELETE CASCADE ON UPDATE CASCADE;
