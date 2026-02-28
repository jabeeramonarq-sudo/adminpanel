import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import api from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Search, Trash2, Send, CheckCircle } from "lucide-react";

interface Message {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    isReplied: boolean;
    createdAt: string;
}

const withEllipsis = (value: string, maxChars: number) => {
    if (!value) return "";
    return value.length > maxChars ? `${value.slice(0, maxChars).trimEnd()}...` : value;
};

export default function InboxPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const response = await api.get("/inbox");
            setMessages(response.data);
        } catch (error) {
            toast.error("Failed to fetch messages");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleMarkRead = async (id: string) => {
        try {
            await api.patch(`/inbox/${id}/read`);
            setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
            toast.success("Marked as read");
        } catch (error) {
            toast.error("Failed to update message");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            await api.delete(`/inbox/${id}`);
            setMessages(messages.filter(m => m._id !== id));
            toast.success("Message deleted");
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Contact Inbox</h1>
                    <p className="text-slate-400">Manage and reply to your user inquiries.</p>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search messages..."
                        className="pl-10 bg-slate-900 border-slate-800 text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-20 text-slate-500">Loading messages...</div>
                ) : filteredMessages.map((msg) => (
                    <Card key={msg._id} className="bg-slate-900/50 border-slate-800 p-6 hover:bg-slate-900/80 transition-all">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className={`mt-1 h-3 w-3 rounded-full ${msg.isRead ? 'bg-slate-700' : 'bg-primary ring-4 ring-primary/20'}`} />
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-white leading-none">{msg.name}</h3>
                                        <span className="text-xs text-slate-500 font-mono">{msg.email}</span>
                                    </div>
                                    <p className="text-slate-300 font-medium mb-1">{withEllipsis(msg.subject, 80)}</p>
                                    <p className="text-slate-500 text-sm mb-2">{withEllipsis(msg.message, 160)}</p>
                                    <p className="text-xs text-slate-600">
                                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                                    onClick={() => window.location.href = `mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                >
                                    <Send size={16} className="mr-2" /> Reply
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                                    onClick={() => handleDelete(msg._id)}
                                >
                                    <Trash2 size={16} className="mr-2" /> Delete
                                </Button>
                                {!msg.isRead && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-slate-400 hover:text-green-500 hover:bg-green-500/10"
                                        onClick={() => handleMarkRead(msg._id)}
                                    >
                                        <CheckCircle size={16} className="mr-2" /> Mark Read
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}

                {!isLoading && filteredMessages.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
                        <Mail className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-400">Your inbox is empty</h3>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
