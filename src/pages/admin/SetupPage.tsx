import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function SetupPage() {
    const [name, setName] = useState("Super Admin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [needsSetup, setNeedsSetup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await api.get("/auth/setup-status");
                setNeedsSetup(response.data.needsSetup);
            } catch (error) {
                console.error("Failed to check setup status");
                toast.error("Cloud not connect to authentication server");
            } finally {
                setCheckingStatus(false);
            }
        };
        checkStatus();
    }, []);

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setIsLoading(true);
        try {
            await api.post("/auth/setup-superadmin", { name, email, password });
            toast.success("Super Admin created successfully!");
            navigate("/admin/login");
        } catch (error: any) {
            const message = error.response?.data?.error || "Setup failed. Please try again.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (checkingStatus) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!needsSetup) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-center p-6">
                <div className="max-w-md">
                    <ShieldCheck className="h-16 w-16 text-green-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-white mb-2">Setup Already Completed</h1>
                    <p className="text-slate-400 mb-8">Your Super Admin account has already been initialized. Please use the login page to access your dashboard.</p>
                    <Button onClick={() => navigate("/admin/login")} className="bg-primary">
                        Go to Login <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />

            <Card className="w-full max-w-xl border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl animate-fade-in">
                <CardHeader className="space-y-3 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto border border-primary/20 mb-2">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-4xl font-bold tracking-tight text-white">Initial Setup</CardTitle>
                    <CardDescription className="text-slate-400 text-lg">
                        Create your Super Admin account to get started.
                        <br />
                        <span className="text-primary/80 font-medium">This page is only available for brand new installations.</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSetup} className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-200">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Super Admin"
                                    className="h-12 bg-slate-950 border-slate-800 focus:border-primary text-white"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-200">Admin Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="e.g., admin@amonarq.com"
                                        className="pl-10 h-12 bg-slate-950 border-slate-800 focus:border-primary text-white"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="password" title="Try admin123" className="text-slate-200">Admin Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="password"
                                            type="password"
                                            className="pl-10 h-12 bg-slate-950 border-slate-800 focus:border-primary text-white"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm" className="text-slate-200">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="confirm"
                                            type="password"
                                            className="pl-10 h-12 bg-slate-950 border-slate-800 focus:border-primary text-white"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg transition-all shadow-lg shadow-primary/20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Initialising System...
                                </>
                            ) : (
                                "Initialize System"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
