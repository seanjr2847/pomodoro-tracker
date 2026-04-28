export interface SharedLinkData {
  id: string;
  slug: string;
  resourceType: string;
  resourceId: string;
  isPublic: boolean;
  password?: string | null;
  expiresAt?: Date | null;
  viewCount: number;
  createdAt: Date;
}
