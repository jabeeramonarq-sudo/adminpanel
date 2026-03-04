import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import api from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Search, Trash2 } from "lucide-react";

interface Lead {
  _id: string;
  name: string;
  email: string;
  sourceUrl?: string;
  userAgent?: string;
  createdAt: string;
}

interface FeatureFlags {
  emailCaptureEnabled: boolean;
}

const withEllipsis = (value: string, maxChars: number) => {
  if (!value) return "";
  return value.length > maxChars ? `${value.slice(0, maxChars).trimEnd()}...` : value;
};

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flags, setFlags] = useState<FeatureFlags>({ emailCaptureEnabled: true });
  const [isSavingFlags, setIsSavingFlags] = useState(false);

  const fetchLeads = async () => {
    try {
      const response = await api.get("/leads");
      setLeads(response.data);
    } catch (_error) {
      toast.error("Failed to fetch leads");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const response = await api.get("/settings");
        setFlags({
          emailCaptureEnabled: response.data?.featureFlags?.emailCaptureEnabled ?? true
        });
      } catch (_error) {
        toast.error("Failed to load popup setting");
      }
    };
    fetchFlags();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    try {
      await api.delete(`/leads/${id}`);
      setLeads(leads.filter((lead) => lead._id !== id));
      toast.success("Lead deleted");
    } catch (_error) {
      toast.error("Failed to delete lead");
    }
  };

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.sourceUrl || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = async (nextValue: boolean) => {
    setFlags({ emailCaptureEnabled: nextValue });
    setIsSavingFlags(true);
    try {
      await api.put("/settings", { featureFlags: { emailCaptureEnabled: nextValue } });
      toast.success("Popup setting updated");
    } catch (_error) {
      toast.error("Failed to update popup setting");
    } finally {
      setIsSavingFlags(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Visitor Leads</h1>
          <p className="text-slate-400">Captured from the footer banner.</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search leads..."
            className="pl-10 bg-slate-900 border-slate-800 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-semibold">Email popup</h3>
            <p className="text-xs text-slate-500">Toggle the name + email popup on the public site.</p>
          </div>
          <label className="flex items-center gap-2 text-slate-200 text-sm">
            <input
              type="checkbox"
              checked={flags.emailCaptureEnabled}
              disabled={isSavingFlags}
              onChange={(e) => handleToggle(e.target.checked)}
            />
            Enabled
          </label>
        </div>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-20 text-slate-500">Loading leads...</div>
        ) : filteredLeads.map((lead) => (
          <Card key={lead._id} className="bg-slate-900/50 border-slate-800 p-6 hover:bg-slate-900/80 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20" />
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-white leading-none">{lead.name}</h3>
                    <span className="text-xs text-slate-500 font-mono">{lead.email}</span>
                  </div>
                  {lead.sourceUrl && (
                    <p className="text-slate-500 text-sm mb-1">{withEllipsis(lead.sourceUrl, 120)}</p>
                  )}
                  <p className="text-xs text-slate-600">
                    {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                  onClick={() => window.location.href = `mailto:${lead.email}`}
                >
                  <Mail size={16} className="mr-2" /> Email
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                  onClick={() => handleDelete(lead._id)}
                >
                  <Trash2 size={16} className="mr-2" /> Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {!isLoading && filteredLeads.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl">
            <Mail className="h-12 w-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400">No leads captured yet</h3>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
