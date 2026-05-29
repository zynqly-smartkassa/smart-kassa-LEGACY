import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "../components/ui/sidebar";
import { useState, useEffect } from "react";
import {
  Home,
  BookOpen,
  Settings,
  Car,
  Receipt,
  List,
  Info,
} from "lucide-react";

import { Link } from "react-router-dom";
import { isMobile } from "@/hooks/layout/use-mobile";
import type { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { setLink } from "../../redux/slices/footerLinksSlice";

export function AppSidebar() {
  // to close the Side Bar when a menu item is clicked
  const { toggleSidebar } = useSidebar();

  const [isMd, setIsMd] = useState(false);
  const mdBreakpoint = 768;
  const dispatch: AppDispatch = useDispatch();

  /**
   * Detects window resize events and updates the isMd state
   */
  useEffect(() => {
    const handleResize = () => {
      setIsMd(window.innerWidth >= mdBreakpoint);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /**
   * Closes Sidebar when Menu Item is clicked (only on Mobile)
   */
  function closeSideBar() {
    if (!isMd) {
      toggleSidebar();
    }
  }

  function setFooterLink(path: string) {
    switch (path) {
      case "/":
        dispatch(setLink(1));
        break;
      case "/ride":
        dispatch(setLink(0));
        break;
      case "/settings":
        dispatch(setLink(2));
        break;
      default:
        break;
    }
  }

  return (
    <Sidebar className="hidden lg:flex w-full max-w-64 z-50">
      <SidebarHeader className="flex pt-10 md:pt-5 flex-row justify-between lg:justify-center items-top">
        <Link
          to="/"
          onClick={() => {
            closeSideBar();
            dispatch(setLink(1));
          }}
        >
          <img
            src="/Logo.webp"
            width={120}
            height={120}
            className="w-30 h-30 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40"
          ></img>
        </Link>

        <SidebarTrigger className="lg:hidden" />
      </SidebarHeader>

      <SidebarContent>
        {[
          {
            title: "Navigation",
            items: [
              { label: "Dashboard", path: "/", icon: Home },
              { label: "Dokumentation", path: "/documentation", icon: BookOpen },
            ],
          },
          {
            title: "Taxi Verwaltung",
            items: [
              { label: "Fahrt starten", path: "/ride", icon: Car, onlyMobile: true },
              { label: "Alle Fahrten", path: "/all-rides", icon: List },
              { label: "Rechnungen", path: "/invoices", icon: Receipt },
            ],
          },
          {
            title: "Weitere",
            items: [
              { label: "Hilfe", path: "/help", icon: Info },
              { label: "Einstellungen", path: "/settings", icon: Settings },
            ],
          },
        ].map((section, index) => (
          <SidebarGroup className="flex flex-col gap-2" key={index}>
            <SidebarGroupLabel className="text-xl">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu
                className="flex flex-col gap-3"
                onClick={() => closeSideBar()}
              >
                {section.items.map(
                  (item, index) =>
                    (isMobile || !item.onlyMobile) && (
                      <SidebarMenuItem
                        key={index}
                        onClick={() => setFooterLink(item.path)}
                      >
                        <SidebarMenuButton>
                          <Link
                            to={item.path}
                            className="flex items-center gap-2 w-full"
                          >
                            <item.icon className="w-6 h-6" />
                            {item.label}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
