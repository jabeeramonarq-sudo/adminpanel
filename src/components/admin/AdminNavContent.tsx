
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Inbox,
    Settings,
    FileText,
    Users,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Inbox, label: "Inbox", path: "/admin/inbox" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
    { icon: FileText, label: "Content", path: "/admin/content" },
    { icon: Users, label: "Users", path: "/admin/users" },
];

interface AdminNavContentProps {
    isCollapsed?: boolean;
    onLinkClick?: () => void;
}

export function AdminNavContent({ isCollapsed = false, onLinkClick }: AdminNavContentProps) {
    const location = useLocation();

    return (
        <div className="flex flex-col h-full">
            <nav className="flex-1 px-4 space-y-2 py-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onLinkClick}
                            className={cn(
                                "flex items-center gap-4 px-3 py-3 rounded-lg transition-all group",
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "hover:bg-slate-800 hover:text-white",
                                isCollapsed && "justify-center px-0"
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
                    className={cn(
                        "w-full flex items-center gap-4 px-3 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all group",
                        isCollapsed && "justify-center px-0"
                    )}
                >
                    <LogOut size={22} className="group-hover:text-red-500" />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </div>
    );
}
