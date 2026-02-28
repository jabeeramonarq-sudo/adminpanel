import { useState, useEffect } from "react";
import { Users as UsersIcon, Plus, Edit2, Trash2, Loader2, Shield, User, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "admin"
    });
    const [inviteMode, setInviteMode] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await api.get("/users");
            setUsers(response.data);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingUser) {
                // Update existing user
                await api.put(`/users/${editingUser._id}`, formData);
                toast.success("User updated successfully");
            } else if (inviteMode) {
                // Send invitation
                await api.post("/invitations/send", {
                    email: formData.email,
                    role: formData.role
                });
                toast.success("Invitation sent successfully");
            } else {
                // Create new user directly
                await api.post("/users", formData);
                toast.success("User created successfully");
            }
            fetchUsers();
            setOpen(false);
            resetForm();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to save user");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this user permanently?")) return;
        try {
            await api.delete(`/users/${id}`);
            toast.success("User deleted");
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to delete user");
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: "", // Don't pre-fill password
            role: user.role
        });
        setOpen(true);
    };

    const resetForm = () => {
        setEditingUser(null);
        setInviteMode(false);
        setFormData({ name: "", email: "", password: "", role: "admin" });
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            resetForm();
        }
    };

    return (
        <AdminLayout>
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-slate-400">Manage admin users and their permissions.</p>
                </div>
                <Dialog open={open} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" onClick={() => setInviteMode(true)}>
                            <Mail size={18} className="mr-2" /> Invite User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editingUser ? "Edit User" : inviteMode ? "Invite New User" : "Create New User"}</DialogTitle>
                            <DialogDescription className="text-slate-400">
                                {editingUser ? "Update user information and permissions." : inviteMode ? "Send an invitation email to a new admin user." : "Add a new admin user to the system."}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="user@example.com"
                                    className="bg-slate-950 border-slate-800 text-white"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            {!inviteMode && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            className="bg-slate-950 border-slate-800 text-white"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password {editingUser && "(leave blank to keep current)"}</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="bg-slate-950 border-slate-800 text-white"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            required={!editingUser}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                    <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="superadmin">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white">
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : inviteMode ? <Send size={18} className="mr-2" /> : <UsersIcon size={18} className="mr-2" />}
                                    {editingUser ? "Update User" : inviteMode ? "Send Invitation" : "Create User"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin" />
                        Loading users...
                    </div>
                ) : users.length === 0 ? (
                    <div className="py-20 text-center text-slate-500">
                        <UsersIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
                        <p>No users found. Create your first admin user.</p>
                    </div>
                ) : (
                    users.map((user) => (
                        <Card key={user._id} className="bg-slate-900/50 border-slate-800 p-6 flex items-center justify-between group hover:border-primary/30 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${user.role === 'superadmin'
                                    ? 'bg-primary/10 border-primary/20 text-primary'
                                    : 'bg-slate-950 border-slate-800 text-slate-400'
                                    } group-hover:scale-110 transition-transform`}>
                                    {user.role === 'superadmin' ? <Shield size={24} /> : <User size={24} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${user.role === 'superadmin'
                                            ? 'bg-primary/20 text-primary'
                                            : 'bg-slate-800 text-slate-400'
                                            }`}>
                                            {user.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400">{user.email}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Created: {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                                    onClick={() => handleEdit(user)}
                                >
                                    <Edit2 size={16} />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                                    onClick={() => handleDelete(user._id)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </AdminLayout >
    );
}
