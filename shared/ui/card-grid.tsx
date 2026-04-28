import { cn } from "@/shared/utils/cn";

interface CardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

const colsMap = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export function CardGrid({ children, columns = 3, className }: CardGridProps) {
  return (
    <div className={cn("grid gap-4", colsMap[columns], className)}>
      {children}
    </div>
  );
}
