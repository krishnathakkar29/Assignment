import { Outlet } from "react-router-dom";
import Sidebar from "../components/custom/sidebar";

function Layout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <div className="overflow-auto">
          <div className="flex-1 container py-4 text-accent-foreground ">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;

// import type React from "react";

// import { useState } from "react";
// import { Link, Outlet, useLocation } from "react-router-dom";
// import { BarChart3, MessageSquare, Settings, User } from "lucide-react";
// import { Button } from "../../components/ui/button";
// import {
//   SidebarProvider,
//   Sidebar,
//   SidebarContent,
//   SidebarHeader,
//   SidebarFooter,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarTrigger,
// } from "../../components/ui/sidebar";

// export function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const location = useLocation();
//   const pathname = location.pathname;
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const routes = [
//     {
//       icon: BarChart3,
//       href: "/",
//       label: "Campaigns",
//       active: pathname === "/",
//     },
//     {
//       icon: MessageSquare,
//       href: "/message-generator",
//       label: "Message Generator",
//       active: pathname === "/message-generator",
//     },
//     {
//       icon: Settings,
//       href: "/settings",
//       label: "Settings",
//       active: pathname === "/settings",
//     },
//   ];

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen">
//         <Sidebar variant="inset" className="border-r border-border/40">
//           <SidebarHeader className="flex items-center justify-between p-4">
//             <div className="flex items-center space-x-2">
//               <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
//                 <span className="font-bold text-primary-foreground">CM</span>
//               </div>
//               <span className="font-bold text-xl">CampaignAI</span>
//             </div>
//           </SidebarHeader>
//           <SidebarContent>
//             <SidebarMenu>
//               {routes.map((route) => (
//                 <SidebarMenuItem key={route.href}>
//                   <SidebarMenuButton asChild isActive={route.active}>
//                     <Link to={route.href} className="flex items-center">
//                       <route.icon className="mr-2 h-5 w-5" />
//                       <span>{route.label}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarContent>
//           <SidebarFooter className="p-4">
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild></SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarFooter>
//         </Sidebar>

//         <div className="flex-1 flex flex-col">
//           <header className="h-14 border-b border-border/40 flex items-center justify-between px-4 lg:px-6">
//             <div className="flex items-center gap-2">
//               <SidebarTrigger />
//               <h1 className="text-lg font-semibold">
//                 {routes.find((route) => route.active)?.label || "Dashboard"}
//               </h1>
//             </div>
//           </header>
//           <main className="flex-1 overflow-auto p-4 lg:p-6 w-full">
//             <Outlet />
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// }
