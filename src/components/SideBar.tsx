import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function Sidebar({ className, items }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <nav
      className={cn(
        "flex flex-col space-y-2 lg:flex-col lg:space-x-0 lg:space-y-1 p-2",
        className
      )}
    >
      {items.map((item) => (
        <a
          key={item.href}
          onClick={() => handleNavigation(item.href)}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            location.pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:bg-primary/20", // Use primary/20 for a subtle, themed hover
            "justify-start cursor-pointer transition-all duration-200"
          )}
        >
          {item.title}
        </a>
      ))}
    </nav>
  );
}