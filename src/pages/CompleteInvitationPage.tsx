import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2, Mail, Lock, User, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CompleteInvitationPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [isVerifying, setIsVerifying] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [invitationData, setInvitationData] = useState<{ email: string; role: string } | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        verifyToken();
    }, [token]);

    const verifyToken = async () => {
        try {
            const response = await api.get(`/invitations/verify/${token}`);
            setInvitationData(response.data);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Invalid or expired invitation link");
            setTimeout(() => navigate('/admin/login'), 3000);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post("/invitations/complete", {
                token,
                name: formData.name,
                password: formData.password
            });

            setIsCompleted(true);
            toast.success("Registration completed! Redirecting to login...");
            setTimeout(() => navigate('/admin/login'), 3000);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to complete registration");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
                <Card className="bg-slate-900/50 border-slate-800 p-8 text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-slate-400">Verifying invitation...</p>
                </Card>
            </div>
        );
    }

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
                <Card className="bg-slate-900/50 border-slate-800 p-8 text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Registration Complete!</h2>
                    <p className="text-slate-400">Your account has been activated. Redirecting to login...</p>
                </Card>
            </div>
        );
    }

    if (!invitationData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            <Card className="bg-slate-900/50 border-slate-800 p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Complete Your Registration</h1>
                    <p className="text-slate-400">You've been invited to join Amonarq Admin Panel</p>
                    <p className="text-sm text-slate-500 mt-2">{invitationData.email}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                id="name"
                                placeholder="John Doe"
                                className="bg-slate-950 border-slate-800 text-white pl-10"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="bg-slate-950 border-slate-800 text-white pl-10"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                className="bg-slate-950 border-slate-800 text-white pl-10"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={18} />
                                Completing Registration...
                            </>
                        ) : (
                            "Complete Registration"
                        )}
                    </Button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Already have an account?{" "}
                    <a href="/admin/login" className="text-primary hover:underline">
                        Sign in
                    </a>
                </p>
            </Card>
        </div>
    );
}
