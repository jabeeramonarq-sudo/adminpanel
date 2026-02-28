import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox, FileText, Settings, Users, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function AdminDashboard() {
    const [liveStats, setLiveStats] = useState({
        inboxCount: 0,
        pendingCount: 0,
        userCount: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Assuming backend might still have a stats endpoint, but we only care about user-related stuff now.
                // If the endpoint breaks, we catch error.
                // For now, let's just mock or use partial data if backend is not updated.
                const response = await api.get("/dashboard/stats");
                setLiveStats(response.data);
            } catch (error) {
                // Silently fail or minimal toast
                console.error("Failed to fetch statistics");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: "Total Messages", value: liveStats.inboxCount.toString(), icon: Inbox, color: "text-blue-500", path: "/admin/inbox" },
        { label: "Team Users", value: liveStats.userCount.toString(), icon: Users, color: "text-orange-500", path: "/admin/users" },
    ];

    return (
        <AdminLayout>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">System Overview</h1>
                <p className="text-slate-400">Manage your site communications and team.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="bg-slate-900/50 border-slate-800 hover:border-primary/50 transition-all group overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-widest">{stat.label}</CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color} opacity-70 group-hover:opacity-100 transition-all`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white tabular-nums">{stat.value}</div>
                            <Link to={stat.path} className="text-xs text-primary mt-4 flex items-center gap-1 hover:underline">
                                View details <ArrowUpRight size={12} />
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8 max-w-4xl">
                <Card className="bg-slate-900/50 border-slate-800 p-6 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Platform Status</h3>
                        <p className="text-slate-400 text-sm">System is operational. Settings and user management services are online.</p>
                    </div>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800 p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Quick Shortcuts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link to="/admin/inbox" className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800 transition-colors border border-slate-800 group">
                            <div className="flex items-center justify-between mb-2">
                                <Inbox className="text-blue-500" size={20} />
                                <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-slate-300 font-medium">Check Messages</span>
                        </Link>
                        <Link to="/admin/settings" className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800 transition-colors border border-slate-800 group">
                            <div className="flex items-center justify-between mb-2">
                                <Settings className="text-purple-500" size={20} />
                                <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-slate-300 font-medium">Update Settings</span>
                        </Link>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
