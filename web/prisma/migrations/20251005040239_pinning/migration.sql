-- CreateTable
CREATE TABLE "pinned_items" (
    "id" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "props" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pinned_items_pkey" PRIMARY KEY ("id")
);
