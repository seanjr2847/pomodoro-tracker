import Link from "next/link";
import { auth } from "@/features/auth";
import { getCategoriesAction, CategoryForm, CategoryList } from "@/features/categories";
import { Tag, Lock } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

export const metadata = {
  title: "카테고리 관리 | Pomodoro Tracker",
  description: "작업 카테고리를 생성하고 관리하세요",
};

export default async function CategoriesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <Lock className="h-16 w-16 text-muted-foreground" />
          <h1 className="mt-6 text-3xl font-bold">로그인이 필요한 기능이에요</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            카테고리 관리는 로그인 후 이용하실 수 있습니다
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/login">
              로그인하기
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const result = await getCategoriesAction();
  const categories = result.success && result.data ? result.data : [];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Tag className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">카테고리 관리</h1>
            <p className="text-muted-foreground">
              작업 유형별로 카테고리를 만들어보세요
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">새 카테고리 만들기</h2>
          <CategoryForm />
        </Card>

        <div>
          <h2 className="mb-4 text-lg font-semibold">내 카테고리</h2>
          <CategoryList categories={categories} />
        </div>
      </div>
    </div>
  );
}
