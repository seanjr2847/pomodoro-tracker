import { redirect } from "next/navigation";
import { auth } from "@/features/auth";
import { SignInButton } from "@/features/auth";
import { Timer as TimerIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export const metadata = {
  title: "로그인 | Pomodoro Tracker",
  description: "포모도로 트래커에 로그인하고 통계를 확인하세요",
};

export default async function LoginPage() {
  const session = await auth();

  // 이미 로그인된 경우 대시보드로 리다이렉트
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto flex min-h-screen max-w-md items-center justify-center px-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <TimerIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Pomodoro Tracker</CardTitle>
          <CardDescription>
            로그인하고 포모도로 통계를 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInButton
            variant="default"
            className="w-full"
            label="Google로 로그인"
          />
          <p className="text-center text-xs text-muted-foreground">
            로그인하면{" "}
            <a href="/legal/terms" className="underline hover:text-foreground">
              이용약관
            </a>
            과{" "}
            <a href="/legal/privacy" className="underline hover:text-foreground">
              개인정보처리방침
            </a>
            에 동의하는 것으로 간주됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
