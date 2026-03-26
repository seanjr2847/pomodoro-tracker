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
};

export function LucideIconByName({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name];
  if (!Icon) return <span className={className}>{name}</span>;
  return <Icon className={className} />;
}
