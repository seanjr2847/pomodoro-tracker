-- AddIndex: Account.userId
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- AddIndex: Session.userId
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- AddIndex: ApiKey.userId
CREATE INDEX "api_keys_userId_idx" ON "api_keys"("userId");
