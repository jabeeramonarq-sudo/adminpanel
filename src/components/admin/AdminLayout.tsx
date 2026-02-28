import { ReactNode } from "react";
import { AdminSideNav } from "./AdminSideNav";
import { Navigate } from "react-router-dom";

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const token = localStorage.getItem("adminToken");

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="flex bg-slate-950 h-screen overflow-hidden">
            <AdminSideNav />
            <main className="flex-1 overflow-y-auto p-8 lg:p-12">
                <div className="max-w-6xl mx-auto animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
