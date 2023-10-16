-- CreateTable
CREATE TABLE "Profile" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userName" VARCHAR(50) NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "description" VARCHAR(250),
    "region" VARCHAR(50),
    "mainUrl" VARCHAR(250),
    "avatar" BYTEA,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followerId" BIGINT NOT NULL,
    "followingId" BIGINT NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" BIGINT NOT NULL,
    "body" VARCHAR(150) NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "image" BYTEA,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageResponse" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originalMsgId" BIGINT NOT NULL,
    "respondingMsgId" BIGINT NOT NULL,

    CONSTRAINT "MessageResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageBroadcast" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originalMsgId" BIGINT NOT NULL,
    "broadcastingMsgId" BIGINT NOT NULL,
    "additionalMessage" VARCHAR(140),

    CONSTRAINT "MessageBroadcast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userName_key" ON "Profile"("userName");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageResponse" ADD CONSTRAINT "MessageResponse_originalMsgId_fkey" FOREIGN KEY ("originalMsgId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageResponse" ADD CONSTRAINT "MessageResponse_respondingMsgId_fkey" FOREIGN KEY ("respondingMsgId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageBroadcast" ADD CONSTRAINT "MessageBroadcast_originalMsgId_fkey" FOREIGN KEY ("originalMsgId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageBroadcast" ADD CONSTRAINT "MessageBroadcast_broadcastingMsgId_fkey" FOREIGN KEY ("broadcastingMsgId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
