import { Home, Layers2Icon, MenuIcon } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const routes = [
  {
    href: "",
    label: "Home",
    icon: Home,
  },
  {
    href: "/generate-message",
    label: "Message Generator",
    icon: Layers2Icon,
  },
  {
    href: "/linkedin-scraper",
    label: "LinkedIn Scraper",
    icon: Layers2Icon,
  },
];

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];
  return (
    <div className="hidden md:block relative max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
      <div className="flex flex-col p-2">
        {routes.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={buttonVariants({
              variant:
                activeRoute.href == item.href ? "sidebarActiveItem" : "sidebar",
            })}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

export function MobileSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block md:hidden border-separate bg-red-900">
      <div className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] space-y-4"
            side={"left"}
          >
            <div className="flex flex-col gap-1">
              {routes.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={buttonVariants({
                    variant:
                      activeRoute.href == item.href
                        ? "sidebarActiveItem"
                        : "sidebar",
                  })}
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
