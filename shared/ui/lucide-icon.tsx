import {
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Globe,
  Lock,
  Layers,
  Code,
  Sparkles,
  Rocket,
  Settings,
  Bell,
  Mail,
  Heart,
  Star,
  Search,
  FileText,
  Database,
  Cloud,
  Kanban,
  History,
  CreditCard,
  MessageSquare,
  GitBranch,
  Triangle,
  Home,
  Key,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Globe,
  Lock,
  Layers,
  Code,
  Sparkles,
  Rocket,
  Settings,
  Bell,
  Mail,
  Heart,
  Star,
  Search,
  FileText,
  Database,
  Cloud,
  Kanban,
  History,
  CreditCard,
  MessageSquare,
  GitBranch,
  Triangle,
  Home,
  Key,
};

export function LucideIconByName({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}
