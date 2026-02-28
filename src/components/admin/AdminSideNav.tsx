import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Inbox,
    Settings,
    FileText,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Inbox, label: "Inbox", path: "/admin/inbox" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
    { icon: FileText, label: "Content", path: "/admin/content" },
    { icon: Users, label: "Users", path: "/admin/users" },
];

export function AdminSideNav() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "h-screen bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 flex flex-col sticky top-0 shrink-0",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <span className="font-bold text-xl text-white tracking-tight">Admin<span className="text-primary">Panel</span></span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-slate-400 hover:text-white"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </Button>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-4 px-3 py-3 rounded-lg transition-all group",
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon size={22} className={cn(isActive ? "text-primary" : "text-slate-400 group-hover:text-white")} />
                            {!isCollapsed && <span className="font-medium">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => {
                        localStorage.removeItem("adminToken");
                        window.location.href = "/admin/login";
                    }}
                    className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all group"
                >
                    <LogOut size={22} className="group-hover:text-red-500" />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
