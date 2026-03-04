import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Share2, Globe, ImageIcon, Save } from "lucide-react";

interface SocialMedia {
    platform: string;
    url: string;
    icon?: string;
}

interface Settings {
    logos: {
        main: string;
        footer: string;
        favicon: string;
    };
    contactInfo: {
        address: string;
        email: string;
        phone: string;
        mapsUrl: string;
    };
    contactForm: {
        recipientEmail: string;
    };
    footer: {
        badgeText: string;
        copyrightText: string;
    };
    seo?: {
        siteTitle?: string;
        defaultDescription?: string;
        ogImage?: string;
    };
    socialMedia: SocialMedia[];
    featureFlags?: {
        emailCaptureEnabled?: boolean;
        showPhoneNumber?: boolean;
        seoEnabled?: boolean;
    };
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        logos: { main: "", footer: "", favicon: "" },
        contactInfo: { address: "", email: "", phone: "", mapsUrl: "" },
        contactForm: { recipientEmail: "" },
        footer: { badgeText: "", copyrightText: "" },
        seo: { siteTitle: "", defaultDescription: "", ogImage: "" },
        socialMedia: [],
        featureFlags: { emailCaptureEnabled: true, showPhoneNumber: false, seoEnabled: true }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState<"" | "main" | "footer" | "favicon">("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get("/settings");
                setSettings({
                    ...response.data,
                    contactForm: {
                        recipientEmail: response.data?.contactForm?.recipientEmail || ""
                    },
                    footer: {
                        badgeText: response.data?.footer?.badgeText || "",
                        copyrightText: response.data?.footer?.copyrightText || ""
                    },
                    seo: {
                        siteTitle: response.data?.seo?.siteTitle || "",
                        defaultDescription: response.data?.seo?.defaultDescription || "",
                        ogImage: response.data?.seo?.ogImage || ""
                    },
                    featureFlags: {
                        emailCaptureEnabled: response.data?.featureFlags?.emailCaptureEnabled ?? true,
                        showPhoneNumber: response.data?.featureFlags?.showPhoneNumber ?? false,
                        seoEnabled: response.data?.featureFlags?.seoEnabled ?? true
                    }
                });
            } catch (error) {
                toast.error("Failed to load settings");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.put("/settings", settings);
            toast.success("Settings updated successfully!");
        } catch (error) {
            toast.error("Failed to update settings");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSocialAdd = () => {
        setSettings({
            ...settings,
            socialMedia: [...settings.socialMedia, { platform: "", url: "" }]
        });
    };

    const handleSocialDelete = (index: number) => {
        const updated = [...settings.socialMedia];
        updated.splice(index, 1);
        setSettings({ ...settings, socialMedia: updated });
    };

    const uploadLogo = async (type: "main" | "footer" | "favicon", file?: File) => {
        if (!file) return;
        setUploadingLogo(type);
        try {
            const formData = new FormData();
            formData.append("image", file);
            const token = localStorage.getItem("adminToken");
            const baseURL = api.defaults.baseURL || "";
            const response = await fetch(`${baseURL}/upload/image`, {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || "Logo upload failed");
            }
            const url = data?.url;
            if (!url) {
                throw new Error("Upload succeeded but no URL returned");
            }
            setSettings((prev) => ({
                ...prev,
                logos: { ...prev.logos, [type]: url }
            }));
            toast.success("Logo uploaded");
        } catch (error: any) {
            toast.error(error.message || "Logo upload failed");
        } finally {
            setUploadingLogo("");
        }
    };

    return (
        <AdminLayout>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white tracking-tight">Site Settings</h1>
                <p className="text-slate-400">Control your branding, company info, and integrations.</p>
            </div>

            <Tabs defaultValue="branding" className="space-y-8">
                <TabsList className="bg-slate-900 border-slate-800">
                    <TabsTrigger value="branding" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                        <ImageIcon size={16} className="mr-2" /> Branding
                    </TabsTrigger>
                    <TabsTrigger value="info" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                        <Building size={16} className="mr-2" /> Company Info
                    </TabsTrigger>
                    <TabsTrigger value="socials" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                        <Share2 size={16} className="mr-2" /> Social Media
                    </TabsTrigger>
                    <TabsTrigger value="contact-forms" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                        <Globe size={16} className="mr-2" /> Contact Forms
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                        <Globe size={16} className="mr-2" /> Maps & SEO
                    </TabsTrigger>
                    <TabsTrigger value="footer" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                        <Building size={16} className="mr-2" /> Footer Text
                    </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSave}>
                    <TabsContent value="branding" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-slate-900/50 border-slate-800 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Main Logo</h3>
                                <div className="space-y-4">
                                    <div className="h-32 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                                        {settings.logos.main ? (
                                            <img src={settings.logos.main} className="h-16 w-auto" alt="Logo preview" />
                                        ) : (
                                            <span className="text-slate-600">No logo uploaded</span>
                                        )}
                                    </div>
                                    <Input
                                        placeholder="Logo URL (or use upload tool)"
                                        className="bg-slate-950 border-slate-800 text-white"
                                        value={settings.logos.main}
                                        onChange={e => setSettings({ ...settings, logos: { ...settings.logos, main: e.target.value } })}
                                    />
                                    <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800">
                                        {uploadingLogo === "main" ? (
                                            <Loader2 size={14} className="mr-1 animate-spin" />
                                        ) : (
                                            <Upload size={14} className="mr-1" />
                                        )}
                                        Upload from PC
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                void uploadLogo("main", file);
                                                e.currentTarget.value = "";
                                            }}
                                        />
                                    </label>
                                </div>
                            </Card>
                            <Card className="bg-slate-900/50 border-slate-800 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Footer Logo</h3>
                                <div className="space-y-4">
                                    <div className="h-32 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                                        {settings.logos.footer ? (
                                            <img src={settings.logos.footer} className="h-16 w-auto" alt="Footer logo preview" />
                                        ) : (
                                            <span className="text-slate-600">No footer logo</span>
                                        )}
                                    </div>
                                    <Input
                                        placeholder="Footer logo URL (or use upload tool)"
                                        className="bg-slate-950 border-slate-800 text-white"
                                        value={settings.logos.footer}
                                        onChange={e => setSettings({ ...settings, logos: { ...settings.logos, footer: e.target.value } })}
                                    />
                                    <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800">
                                        {uploadingLogo === "footer" ? (
                                            <Loader2 size={14} className="mr-1 animate-spin" />
                                        ) : (
                                            <Upload size={14} className="mr-1" />
                                        )}
                                        Upload from PC
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                void uploadLogo("footer", file);
                                                e.currentTarget.value = "";
                                            }}
                                        />
                                    </label>
                                </div>
                            </Card>
                            <Card className="bg-slate-900/50 border-slate-800 p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Favicon</h3>
                                <div className="space-y-4">
                                    <div className="h-32 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                                        {settings.logos.favicon ? (
                                            <img src={settings.logos.favicon} className="h-8 w-8" alt="Favicon preview" />
                                        ) : (
                                            <span className="text-slate-600">No favicon</span>
                                        )}
                                    </div>
                                    <Input
                                        placeholder="Favicon URL"
                                        className="bg-slate-950 border-slate-800 text-white"
                                        value={settings.logos.favicon}
                                        onChange={e => setSettings({ ...settings, logos: { ...settings.logos, favicon: e.target.value } })}
                                    />
                                    <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800">
                                        {uploadingLogo === "favicon" ? (
                                            <Loader2 size={14} className="mr-1 animate-spin" />
                                        ) : (
                                            <Upload size={14} className="mr-1" />
                                        )}
                                        Upload from PC
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                void uploadLogo("favicon", file);
                                                e.currentTarget.value = "";
                                            }}
                                        />
                                    </label>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="info" className="space-y-6">
                        <Card className="bg-slate-900/50 border-slate-800 p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Contact Email</Label>
                                        <Input
                                            placeholder="contact@company.com"
                                            className="bg-slate-950 border-slate-800 text-white"
                                            value={settings.contactInfo.email}
                                            onChange={e => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, email: e.target.value } })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Phone Number</Label>
                                        <Input
                                            placeholder="+1 (555) 000-0000"
                                            className="bg-slate-950 border-slate-800 text-white"
                                            value={settings.contactInfo.phone}
                                            onChange={e => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, phone: e.target.value } })}
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 text-slate-200 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={settings.featureFlags?.showPhoneNumber ?? false}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    featureFlags: { ...settings.featureFlags, showPhoneNumber: e.target.checked }
                                                })
                                            }
                                        />
                                        Show phone number on frontend
                                    </label>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Registered Address</Label>
                                    <textarea
                                        className="w-full h-32 rounded-lg bg-slate-950 border border-slate-800 p-3 text-white focus:ring-1 focus:ring-primary outline-none"
                                        placeholder="Enter address..."
                                        value={settings.contactInfo.address}
                                        onChange={e => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, address: e.target.value } })}
                                    />
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="socials" className="space-y-6">
                        <Card className="bg-slate-900/50 border-slate-800 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-white">Social Media Links</h3>
                                <Button type="button" size="sm" onClick={handleSocialAdd} className="bg-slate-800 hover:bg-slate-700">
                                    <Plus size={16} className="mr-2" /> Add Platform
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {settings.socialMedia.map((social, idx) => (
                                    <div key={idx} className="flex gap-4 items-end bg-slate-950 p-4 rounded-xl border border-slate-800">
                                        <div className="flex-1 space-y-2">
                                            <Label>Platform Name</Label>
                                            <Input
                                                placeholder="e.g. LinkedIn"
                                                className="bg-slate-900 border-slate-800"
                                                value={social.platform}
                                                onChange={e => {
                                                    const updated = [...settings.socialMedia];
                                                    updated[idx].platform = e.target.value;
                                                    setSettings({ ...settings, socialMedia: updated });
                                                }}
                                            />
                                        </div>
                                        <div className="flex-[2] space-y-2">
                                            <Label>Profile URL</Label>
                                            <Input
                                                placeholder="https://..."
                                                className="bg-slate-900 border-slate-800"
                                                value={social.url}
                                                onChange={e => {
                                                    const updated = [...settings.socialMedia];
                                                    updated[idx].url = e.target.value;
                                                    setSettings({ ...settings, socialMedia: updated });
                                                }}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="text-slate-500 hover:text-red-500 hover:bg-red-500/10"
                                            onClick={() => handleSocialDelete(idx)}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                ))}
                                {settings.socialMedia.length === 0 && (
                                    <p className="text-center py-6 text-slate-500 italic">No social media links added yet.</p>
                                )}
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="integrations" className="space-y-6">
                        <Card className="bg-slate-900/50 border-slate-800 p-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Google Maps Embed URL</Label>
                                    <Input
                                        placeholder="https://google.com/maps/embed?..."
                                        className="bg-slate-950 border-slate-800 text-white"
                                        value={settings.contactInfo.mapsUrl}
                                        onChange={e => setSettings({ ...settings, contactInfo: { ...settings.contactInfo, mapsUrl: e.target.value } })}
                                    />
                                    <p className="text-[10px] text-slate-500">Paste the iframe src URL from Google Maps Share &gt; Embed a map</p>
                                </div>
                                <label className="flex items-center gap-2 text-slate-200 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={settings.featureFlags?.seoEnabled ?? true}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                featureFlags: { ...settings.featureFlags, seoEnabled: e.target.checked }
                                            })
                                        }
                                    />
                                    Enable SEO metadata
                                </label>
                                <div className="space-y-2 pt-4 border-t border-slate-800">
                                    <Label className="text-slate-300">Default SEO Title</Label>
                                    <Input
                                        placeholder="Amonarq - Designing Systems for Continuity"
                                        className="bg-slate-950 border-slate-800 text-white"
                                        value={settings.seo?.siteTitle || ""}
                                        onChange={e =>
                                            setSettings({
                                                ...settings,
                                                seo: { ...settings.seo, siteTitle: e.target.value }
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Default SEO Description</Label>
                                    <textarea
                                        className="w-full h-24 rounded-lg bg-slate-950 border border-slate-800 p-3 text-white focus:ring-1 focus:ring-primary outline-none"
                                        placeholder="Amonarq builds digital products focused on reducing chaos, protecting trust, and enabling uninterrupted human flow."
                                        value={settings.seo?.defaultDescription || ""}
                                        onChange={e =>
                                            setSettings({
                                                ...settings,
                                                seo: { ...settings.seo, defaultDescription: e.target.value }
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">OG Image URL</Label>
                                    <Input
                                        placeholder="/og-image.png"
                                        className="bg-slate-950 border-slate-800 text-white"
                                        value={settings.seo?.ogImage || ""}
                                        onChange={e =>
                                            setSettings({
                                                ...settings,
                                                seo: { ...settings.seo, ogImage: e.target.value }
                                            })
                                        }
                                    />
                                    <p className="text-[10px] text-slate-500">Shown when the site is shared on social media.</p>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contact-forms" className="space-y-6">
                        <Card className="bg-slate-900/50 border-slate-800 p-8">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Contact Form Receiver Email List</Label>
                                <Input
                                    placeholder="inbox@company.com, sales@company.com"
                                    className="bg-slate-950 border-slate-800 text-white"
                                    value={settings.contactForm.recipientEmail}
                                    onChange={e =>
                                        setSettings({
                                            ...settings,
                                            contactForm: { recipientEmail: e.target.value }
                                        })
                                    }
                                />
                                <p className="text-[11px] text-slate-500">
                                    Add one or more emails separated by comma. All contact form messages go to this list.
                                </p>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="footer" className="space-y-6">
                        <Card className="bg-slate-900/50 border-slate-800 p-8">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Footer Badge Text</Label>
                                    <Input
                                        placeholder="DPIIT Recognised Startup"
                                        className="bg-slate-950 border-slate-800 text-white"
                                        value={settings.footer.badgeText}
                                        onChange={e =>
                                            setSettings({
                                                ...settings,
                                                footer: { ...settings.footer, badgeText: e.target.value }
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Footer Copyright Text</Label>
                                    <Input
                                        placeholder="© {year} Amonarq Systems. All rights reserved."
                                        className="bg-slate-950 border-slate-800 text-white"
                                        value={settings.footer.copyrightText}
                                        onChange={e =>
                                            setSettings({
                                                ...settings,
                                                footer: { ...settings.footer, copyrightText: e.target.value }
                                            })
                                        }
                                    />
                                    <p className="text-[11px] text-slate-500">Use <code>{"{year}"}</code> to auto-insert current year.</p>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    <div className="mt-12 flex justify-end">
                        <Button type="submit" disabled={isSaving || isLoading} className="bg-primary hover:bg-primary/90 px-8 h-12 shadow-primary/20 shadow-lg min-w-[160px]">
                            {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                            {isSaving ? "Saving..." : "Save All Changes"}
                        </Button>
                    </div>
                </form>
            </Tabs>
        </AdminLayout>
    );
}
