import {
  Home,
  User,
  Settings,
  ShoppingCart,
  ChevronsLeft,
  Heart,
  ChevronDown,
  Plus,
  Minus,
  ArrowLeft,
  Loader,
} from "lucide-react";

const ICON_MAP = {
  home: Home,
  user: User,
  settings: Settings,
  cart: ShoppingCart,
  chevronsLeft: ChevronsLeft,
  chevronDown: ChevronDown,
  heart: Heart,
  plus: Plus,
  minus: Minus,
  arrowLeft: ArrowLeft,
  loader: Loader,
} as const;

type AppIconName = keyof typeof ICON_MAP;

interface IconRegistryProps {
  icon: AppIconName;
  className?: string;
}
const IconRegistry = ({ icon, className }: IconRegistryProps) => {
  const Icon = ICON_MAP[icon];
  if (!Icon) {
    return null;
  }

  return <Icon className={className} />;
};

export default IconRegistry;
