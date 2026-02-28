import { useEffect, useMemo, useState } from "react";
import { Search, Save, Loader2, RefreshCw, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";
import { staticContent } from "@/data/staticContent";
import type { ContentSection } from "@/hooks/useContent";

type SaveState = Record<string, boolean>;
type UploadState = Record<string, boolean>;
type ContactSettings = {
    contactInfo: {
        email: string;
        address: string;
        phone: string;
        mapsUrl: string;
    };
    contactForm: {
        recipientEmail: string;
    };
};
type GroupKey =
    | "all"
    | "home"
    | "about"
    | "product"
    | "continuity"
    | "life-events"
    | "consent"
    | "consent-approval"
    | "security"
    | "how-it-works"
    | "contact"
    | "legal"
    | "other";

const groupLabels: Record<GroupKey, string> = {
    all: "All",
    home: "Home",
    about: "About",
    product: "MyNxt/Product",
    continuity: "Continuity",
    "life-events": "Life Events",
    consent: "Consent",
    "consent-approval": "Consent Approval",
    security: "Security",
    "how-it-works": "How It Works",
    contact: "Contact",
    legal: "Legal",
    other: "Other",
};

const creatableGroups: GroupKey[] = [
    "home",
    "about",
    "product",
    "continuity",
    "life-events",
    "consent",
    "consent-approval",
    "security",
    "how-it-works",
    "contact",
    "legal",
    "other",
];

const groupPrefix: Record<GroupKey, string> = {
    all: "",
    home: "home",
    about: "about",
    product: "product",
    continuity: "continuity",
    "life-events": "life-events",
    consent: "consent",
    "consent-approval": "consent-approval",
    security: "security",
    "how-it-works": "how",
    contact: "contact",
    legal: "legal",
    other: "custom",
};

const getGroupKey = (sectionId: string): GroupKey => {
    if (sectionId.startsWith("home-")) return "home";
    if (sectionId.startsWith("about-")) return "about";
    if (sectionId.startsWith("product-")) return "product";
    if (sectionId.startsWith("continuity-")) return "continuity";
    if (sectionId.startsWith("life-events-") || sectionId.startsWith("life-event-")) return "life-events";
    if (sectionId.startsWith("consent-approval-")) return "consent-approval";
    if (sectionId.startsWith("consent-")) return "consent";
    if (sectionId.startsWith("security-")) return "security";
    if (sectionId.startsWith("how-")) return "how-it-works";
    if (sectionId.startsWith("contact-")) return "contact";
    if (sectionId === "privacy-policy" || sectionId === "terms-of-service") return "legal";
    return "other";
};

const toPayload = (section: ContentSection) => {
    const normalizedImages = Array.isArray(section.images)
        ? section.images.filter((img) => (img || "").trim() !== "")
        : (section.image ? [section.image] : []);

    return {
        sectionId: section.sectionId,
        title: section.title || "",
        subtitle: section.subtitle || "",
        body: section.body || "",
        image: normalizedImages[0] || section.image || "",
        images: normalizedImages,
        order: section.order || 0,
        isActive: typeof section.isActive === "boolean" ? section.isActive : true,
    };
};

export default function ContentPage() {
    const [sections, setSections] = useState<ContentSection[]>([]);
    const [query, setQuery] = useState("");
    const [activeGroup, setActiveGroup] = useState<GroupKey>("all");
    const [selectedSectionId, setSelectedSectionId] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingAll, setIsSavingAll] = useState(false);
    const [saving, setSaving] = useState<SaveState>({});
    const [uploading, setUploading] = useState<UploadState>({});
    const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null);
    const [contactSettings, setContactSettings] = useState<ContactSettings>({
        contactInfo: { email: "", address: "", phone: "", mapsUrl: "" },
        contactForm: { recipientEmail: "" },
    });
    const [savingContact, setSavingContact] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [insertAfterSectionId, setInsertAfterSectionId] = useState("end");
    const [newSection, setNewSection] = useState({
        sectionName: "",
        title: "",
        subtitle: "",
        body: "",
        image: "",
        order: 1,
        isActive: true,
    });

    const openAddSectionForm = () => {
        const nextInsertAfter = selectedSectionId !== "all" ? selectedSectionId : "end";
        setInsertAfterSectionId(nextInsertAfter);
        setShowAddForm(true);
    };

    const mergeWithDefaults = (remoteSections: any[]) => {
        const merged = new Map<string, any>();
        staticContent.forEach((section: any) => {
            merged.set(section.sectionId, {
                ...section,
                images: section.image ? [section.image] : [],
            });
        });

        remoteSections.forEach((section: any) => {
            if (!section?.sectionId) return;
            if (section.isDeleted) {
                merged.delete(section.sectionId);
                return;
            }
            const existing = merged.get(section.sectionId) || {};
            const normalizedImages = Array.isArray(section.images)
                ? section.images
                : (section.image ? [section.image] : (existing.images || []));
            merged.set(section.sectionId, {
                ...existing,
                ...section,
                images: normalizedImages,
            });
        });

        return Array.from(merged.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
    };

    const loadSections = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/content");
            const remote = Array.isArray(response.data) ? response.data : [];
            setSections(mergeWithDefaults(remote));
        } catch (error) {
            setSections(mergeWithDefaults([]));
            toast.error("Failed to load content from API. Showing fallback content.");
        } finally {
            setIsLoading(false);
        }
    };

    const loadContactSettings = async () => {
        try {
            const res = await api.get("/settings");
            setContactSettings({
                contactInfo: {
                    email: res.data?.contactInfo?.email || "",
                    address: res.data?.contactInfo?.address || "",
                    phone: res.data?.contactInfo?.phone || "",
                    mapsUrl: res.data?.contactInfo?.mapsUrl || "",
                },
                contactForm: {
                    recipientEmail: res.data?.contactForm?.recipientEmail || "",
                },
            });
        } catch {
            // keep silent; content editing should still work
        }
    };

    useEffect(() => {
        loadSections();
        loadContactSettings();
    }, []);

    useEffect(() => {
        setSelectedSectionId("all");
    }, [activeGroup]);

    const filteredSections = useMemo(() => {
        const q = query.trim().toLowerCase();
        const byGroup = activeGroup === "all" ? sections : sections.filter((s) => getGroupKey(s.sectionId) === activeGroup);
        if (!q) return byGroup;
        return byGroup.filter((s) =>
            [s.sectionId, s.title, s.subtitle, s.body]
                .filter(Boolean)
                .some((v) => (v || "").toLowerCase().includes(q))
        );
    }, [sections, query, activeGroup]);

    const visibleSections = useMemo(() => {
        if (selectedSectionId === "all") return filteredSections;
        return filteredSections.filter((s) => s.sectionId === selectedSectionId);
    }, [filteredSections, selectedSectionId]);

    const getFriendlySectionName = (sectionId: string) => {
        const key = getGroupKey(sectionId);
        const prefix = key === "all" || key === "other" ? "" : `${key}-`;
        const cleaned = sectionId.startsWith(prefix) ? sectionId.slice(prefix.length) : sectionId;
        return cleaned
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const slugify = (value: string) =>
        value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const generatedSectionId = useMemo(() => {
        const key = activeGroup === "all" ? "other" : activeGroup;
        const prefix = groupPrefix[key] || "custom";
        const slug = slugify(newSection.sectionName);
        if (!slug) return "";
        return `${prefix}-${slug}`;
    }, [activeGroup, newSection.sectionName]);

    const nextOrderForActiveGroup = useMemo(() => {
        if (activeGroup === "all") return 1;
        const inGroup = sections.filter((s) => getGroupKey(s.sectionId) === activeGroup);
        if (!inGroup.length) return 1;
        return Math.max(...inGroup.map((s) => Number(s.order) || 0)) + 1;
    }, [sections, activeGroup]);

    const groupSectionsSorted = useMemo(() => {
        if (activeGroup === "all") return [];
        return sections
            .filter((s) => getGroupKey(s.sectionId) === activeGroup)
            .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    }, [sections, activeGroup]);

    const insertionOrderForActiveGroup = useMemo(() => {
        if (activeGroup === "all") return nextOrderForActiveGroup;
        if (insertAfterSectionId === "end") return nextOrderForActiveGroup;
        const selected = sections.find((s) => s.sectionId === insertAfterSectionId);
        if (!selected || getGroupKey(selected.sectionId) !== activeGroup) return nextOrderForActiveGroup;
        return (Number(selected.order) || 0) + 1;
    }, [sections, activeGroup, insertAfterSectionId, nextOrderForActiveGroup]);

    useEffect(() => {
        if (!showAddForm) return;
        setNewSection((prev) => ({ ...prev, order: insertionOrderForActiveGroup }));
    }, [insertionOrderForActiveGroup, showAddForm]);

    const groupCounts = useMemo(() => {
        const counts: Record<GroupKey, number> = {
            all: sections.length,
            home: 0,
            about: 0,
            product: 0,
            continuity: 0,
            "life-events": 0,
            consent: 0,
            "consent-approval": 0,
            security: 0,
            "how-it-works": 0,
            contact: 0,
            legal: 0,
            other: 0,
        };
        sections.forEach((s) => {
            counts[getGroupKey(s.sectionId)] += 1;
        });
        return counts;
    }, [sections]);

    const updateSection = (index: number, patch: Partial<ContentSection>) => {
        setSections((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], ...patch };
            return next;
        });
    };

    const addImageField = (index: number) => {
        const section = sections[index];
        const current = Array.isArray(section.images) ? section.images : (section.image ? [section.image] : []);
        updateSection(index, { images: [...current, ""] });
    };

    const updateImageField = (index: number, imageIndex: number, value: string) => {
        const section = sections[index];
        const current = Array.isArray(section.images) ? [...section.images] : (section.image ? [section.image] : []);
        current[imageIndex] = value;
        updateSection(index, { images: current, image: current[0] || "" });
    };

    const removeImageField = (index: number, imageIndex: number) => {
        const section = sections[index];
        const current = Array.isArray(section.images) ? [...section.images] : (section.image ? [section.image] : []);
        current.splice(imageIndex, 1);
        updateSection(index, { images: current, image: current[0] || "" });
    };

    const uploadImageFromPc = async (sectionIndex: number, imageIndex: number, file?: File) => {
        if (!file) return;
        const section = sections[sectionIndex];
        const uploadKey = `${section.sectionId}-${imageIndex}`;
        setUploading((prev) => ({ ...prev, [uploadKey]: true }));

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
                throw new Error(data?.error || "Image upload failed");
            }

            const uploadedUrl = data?.url;
            if (!uploadedUrl) {
                throw new Error("Upload succeeded but no URL returned");
            }

            const currentSection = sections[sectionIndex];
            const currentImages = Array.isArray(currentSection.images)
                ? [...currentSection.images]
                : (currentSection.image ? [currentSection.image] : []);
            currentImages[imageIndex] = uploadedUrl;
            const updatedSection = {
                ...currentSection,
                images: currentImages,
                image: currentImages[0] || "",
            };

            updateImageField(sectionIndex, imageIndex, uploadedUrl);
            await api.post("/content/bulk-upsert", { sections: [toPayload(updatedSection)] });
            toast.success("Image uploaded and saved");
        } catch (error: any) {
            toast.error(error.message || "Image upload failed");
        } finally {
            setUploading((prev) => ({ ...prev, [uploadKey]: false }));
        }
    };

    const saveSection = async (section: ContentSection) => {
        setSaving((prev) => ({ ...prev, [section.sectionId]: true }));
        try {
            await api.post("/content/bulk-upsert", { sections: [toPayload(section)] });
            toast.success(`Saved ${section.sectionId}`);
        } catch (error: any) {
            toast.error(error.response?.data?.error || `Failed to save ${section.sectionId}`);
        } finally {
            setSaving((prev) => ({ ...prev, [section.sectionId]: false }));
        }
    };

    const saveAll = async () => {
        setIsSavingAll(true);
        try {
            await api.post("/content/bulk-upsert", {
                sections: sections.map(toPayload),
            });
            toast.success("All content sections saved");
            await loadSections();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to save all content");
        } finally {
            setIsSavingAll(false);
        }
    };

    const deleteSection = async (sectionId: string) => {
        const ok = window.confirm(`Delete section "${sectionId}" permanently?`);
        if (!ok) return;

        setDeletingSectionId(sectionId);
        try {
            await api.delete(`/content/${sectionId}`);
            toast.success(`Deleted ${sectionId}`);

            setSections((prev) => prev.filter((s) => s.sectionId !== sectionId));
            if (selectedSectionId === sectionId) {
                setSelectedSectionId("all");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to delete section");
        } finally {
            setDeletingSectionId(null);
        }
    };

    const saveContactDetails = async () => {
        setSavingContact(true);
        try {
            await api.put("/settings", {
                contactInfo: contactSettings.contactInfo,
                contactForm: contactSettings.contactForm,
            });
            toast.success("Contact details saved");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to save contact details");
        } finally {
            setSavingContact(false);
        }
    };

    const createSection = async (e: React.FormEvent) => {
        e.preventDefault();
        if (activeGroup === "all") {
            toast.error("Please pick a page tab first, then add section.");
            return;
        }
        const sectionId = generatedSectionId;
        if (!sectionId) {
            toast.error("Section name is required");
            return;
        }
        if (sections.some((s) => s.sectionId === sectionId)) {
            toast.error("A section with this generated ID already exists");
            return;
        }

        setIsCreating(true);
        try {
            const inGroup = sections.filter((s) => getGroupKey(s.sectionId) === activeGroup);
            const insertOrder = insertionOrderForActiveGroup;
            const shiftedSections = inGroup
                .filter((s) => (Number(s.order) || 0) >= insertOrder)
                .map((s) => ({ ...s, order: (Number(s.order) || 0) + 1 }));

            await api.post("/content/bulk-upsert", {
                sections: [
                    ...shiftedSections.map(toPayload),
                    {
                        sectionId,
                        title: newSection.title,
                        subtitle: newSection.subtitle,
                        body: newSection.body,
                        image: newSection.image,
                        images: newSection.image ? [newSection.image] : [],
                        order: insertOrder,
                        isActive: newSection.isActive,
                    },
                ],
            });
            toast.success(`Section created: ${sectionId}`);
            setNewSection({
                sectionName: "",
                title: "",
                subtitle: "",
                body: "",
                image: "",
                order: insertOrder + 1,
                isActive: true,
            });
            setShowAddForm(false);
            await loadSections();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to create section");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Content Manager</h1>
                    <p className="text-slate-400">Pick a page tab, edit text, and upload photos directly from your PC.</p>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" className="border-slate-700 text-slate-200" onClick={loadSections}>
                        <RefreshCw size={16} className="mr-2" /> Refresh
                    </Button>
                    <Button type="button" disabled={isSavingAll || isLoading} onClick={saveAll}>
                        {isSavingAll ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                        Save All
                    </Button>
                </div>
            </div>

            <div className="mb-6 relative">
                <Search size={16} className="absolute left-3 top-3.5 text-slate-500" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search content..."
                    className="pl-9 bg-slate-900 border-slate-800 text-white"
                />
            </div>

            <Card className="mb-6 bg-slate-900/40 border-slate-800 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                        <Label className="text-slate-300">Choose Section</Label>
                        <select
                            className="mt-2 w-full rounded-md bg-slate-950 border border-slate-800 p-2 text-white"
                            value={selectedSectionId}
                            onChange={(e) => setSelectedSectionId(e.target.value)}
                        >
                            <option value="all">All sections in this page</option>
                            {filteredSections.map((s) => (
                                <option key={s.sectionId} value={s.sectionId}>
                                    {getFriendlySectionName(s.sectionId)} ({s.sectionId})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="text-sm text-slate-400">
                        Tip: Choose one section to edit so clients can focus without confusion.
                    </div>
                </div>
            </Card>

            {activeGroup === "contact" && (
                <Card className="mb-6 bg-slate-900/50 border-slate-800 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Contact Details (Email, Address, Form Receiver)</h3>
                        <Button type="button" onClick={saveContactDetails} disabled={savingContact}>
                            {savingContact ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                            Save Contact Details
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">Contact Email</Label>
                            <Input
                                className="bg-slate-950 border-slate-800 text-white"
                                value={contactSettings.contactInfo.email}
                                onChange={(e) =>
                                    setContactSettings((prev) => ({
                                        ...prev,
                                        contactInfo: { ...prev.contactInfo, email: e.target.value },
                                    }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Phone (optional)</Label>
                            <Input
                                className="bg-slate-950 border-slate-800 text-white"
                                value={contactSettings.contactInfo.phone}
                                onChange={(e) =>
                                    setContactSettings((prev) => ({
                                        ...prev,
                                        contactInfo: { ...prev.contactInfo, phone: e.target.value },
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <Label className="text-slate-300">Contact Form Receiver Email List</Label>
                        <Input
                            className="bg-slate-950 border-slate-800 text-white"
                            placeholder="email1@company.com, email2@company.com"
                            value={contactSettings.contactForm.recipientEmail}
                            onChange={(e) =>
                                setContactSettings((prev) => ({
                                    ...prev,
                                    contactForm: { ...prev.contactForm, recipientEmail: e.target.value },
                                }))
                            }
                        />
                        <p className="text-xs text-slate-500">
                            Add one or more emails separated by comma. Contact form messages go to all.
                        </p>
                    </div>
                    <div className="mt-4 space-y-2">
                        <Label className="text-slate-300">Address</Label>
                        <Textarea
                            className="min-h-[90px] bg-slate-950 border-slate-800 text-white"
                            value={contactSettings.contactInfo.address}
                            onChange={(e) =>
                                setContactSettings((prev) => ({
                                    ...prev,
                                    contactInfo: { ...prev.contactInfo, address: e.target.value },
                                }))
                            }
                        />
                    </div>
                </Card>
            )}

            <Tabs value={activeGroup} onValueChange={(v) => setActiveGroup(v as GroupKey)} className="mb-6">
                <TabsList className="bg-slate-900 border border-slate-800 h-auto flex-wrap gap-2 p-2">
                    {(Object.keys(groupLabels) as GroupKey[]).map((key) => (
                        <TabsTrigger key={key} value={key} className="data-[state=active]:bg-primary data-[state=active]:text-white">
                            {groupLabels[key]} ({groupCounts[key]})
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <Card className="mb-6 bg-slate-900/50 border-slate-800 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                        Add Section in: {groupLabels[activeGroup]}
                    </h3>
                    <Button
                        type="button"
                        variant="outline"
                        className="border-slate-700 text-slate-200"
                        onClick={() => {
                            if (showAddForm) {
                                setShowAddForm(false);
                                return;
                            }
                            openAddSectionForm();
                        }}
                        disabled={activeGroup === "all"}
                    >
                        <Plus size={16} className="mr-2" />
                        {showAddForm ? "Close" : "Add Section Here"}
                    </Button>
                </div>
                {activeGroup === "all" && (
                    <p className="text-sm text-slate-400">Select a page tab first to add section in that page only.</p>
                )}
                {showAddForm && activeGroup !== "all" && (
                    <form onSubmit={createSection} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Section Name</Label>
                                <Input
                                    className="bg-slate-950 border-slate-800 text-white"
                                    placeholder="example: phone visual"
                                    value={newSection.sectionName}
                                    onChange={(e) => setNewSection((p) => ({ ...p, sectionName: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Generated ID</Label>
                                <Input
                                    className="bg-slate-950 border-slate-800 text-slate-300"
                                    value={generatedSectionId}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Insert After</Label>
                            <select
                                className="w-full rounded-md bg-slate-950 border border-slate-800 p-2 text-white"
                                value={insertAfterSectionId}
                                onChange={(e) => setInsertAfterSectionId(e.target.value)}
                            >
                                <option value="end">At End</option>
                                {groupSectionsSorted.map((s) => (
                                    <option key={s.sectionId} value={s.sectionId}>
                                        {getFriendlySectionName(s.sectionId)} ({s.sectionId})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Title</Label>
                                <Input
                                    className="bg-slate-950 border-slate-800 text-white"
                                    value={newSection.title}
                                    onChange={(e) => setNewSection((p) => ({ ...p, title: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Subtitle</Label>
                                <Input
                                    className="bg-slate-950 border-slate-800 text-white"
                                    value={newSection.subtitle}
                                    onChange={(e) => setNewSection((p) => ({ ...p, subtitle: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Body</Label>
                            <Textarea
                                className="min-h-[100px] bg-slate-950 border-slate-800 text-white"
                                value={newSection.body}
                                onChange={(e) => setNewSection((p) => ({ ...p, body: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Image URL (optional)</Label>
                                <Input
                                    className="bg-slate-950 border-slate-800 text-white"
                                    value={newSection.image}
                                    onChange={(e) => setNewSection((p) => ({ ...p, image: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Position (Auto)</Label>
                                <Input
                                    type="number"
                                    className="bg-slate-950 border-slate-800 text-slate-300"
                                    value={insertionOrderForActiveGroup}
                                    readOnly
                                />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">
                            {insertAfterSectionId === "end"
                                ? "New section will be added at the end of this page."
                                : "New section will be inserted after selected section and orders will adjust automatically."}
                        </p>
                        <Label className="text-slate-300 text-xs flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={newSection.isActive}
                                onChange={(e) => setNewSection((p) => ({ ...p, isActive: e.target.checked }))}
                            />
                            Active
                        </Label>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isCreating}>
                                {isCreating ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Plus size={16} className="mr-2" />}
                                Create Section
                            </Button>
                        </div>
                    </form>
                )}
            </Card>

            {isLoading ? (
                <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Loading content...
                </div>
            ) : (
                <div className="space-y-4">
                    {visibleSections.length === 0 && (
                        <Card className="bg-slate-900/50 border-slate-800 p-6 text-slate-400">
                            No sections found for this page/filter.
                        </Card>
                    )}
                    {visibleSections.map((section) => {
                        const idx = sections.findIndex((s) => s.sectionId === section.sectionId);
                        return (
                            <Card key={section.sectionId} className="bg-slate-900/50 border-slate-800 p-5">
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-primary text-base font-semibold">{getFriendlySectionName(section.sectionId)}</p>
                                        <p className="text-xs text-slate-500">{section.sectionId}</p>
                                        <p className="text-xs text-slate-500">Order: {section.order}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Label className="text-slate-300 text-xs flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={section.isActive}
                                                onChange={(e) => updateSection(idx, { isActive: e.target.checked })}
                                            />
                                            Active
                                        </Label>
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => saveSection(section)}
                                            disabled={!!saving[section.sectionId]}
                                        >
                                            {saving[section.sectionId] ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Save size={14} className="mr-2" />}
                                            Save
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                            onClick={() => deleteSection(section.sectionId)}
                                            disabled={deletingSectionId === section.sectionId}
                                        >
                                            {deletingSectionId === section.sectionId ? (
                                                <Loader2 size={14} className="mr-2 animate-spin" />
                                            ) : (
                                                <Trash2 size={14} className="mr-2" />
                                            )}
                                            Delete
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Title</Label>
                                        <Input
                                            className="bg-slate-950 border-slate-800 text-white"
                                            placeholder="Main heading shown on page"
                                            value={section.title || ""}
                                            onChange={(e) => updateSection(idx, { title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">
                                            {section.sectionId === "continuity-explained" ? "Badges (comma separated)" : "Subtitle"}
                                        </Label>
                                        <Input
                                            className="bg-slate-950 border-slate-800 text-white"
                                            placeholder={section.sectionId === "continuity-explained"
                                                ? "Cautious, Rule-based, Consent-driven"
                                                : "Short supporting line"}
                                            value={section.subtitle || ""}
                                            onChange={(e) => updateSection(idx, { subtitle: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-slate-300">Body</Label>
                                        <Textarea
                                            className="min-h-[120px] bg-slate-950 border-slate-800 text-white"
                                            placeholder="Main paragraph/content for this section"
                                            value={section.body || ""}
                                            onChange={(e) => updateSection(idx, { body: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-slate-300">Images</Label>
                                            <Button type="button" size="sm" variant="outline" className="border-slate-700 text-slate-200" onClick={() => addImageField(idx)}>
                                                <Plus size={14} className="mr-1" /> Add Image
                                            </Button>
                                        </div>
                                        {(section.images && section.images.length > 0 ? section.images : (section.image ? [section.image] : [""])).map((img, imageIndex) => (
                                            <div key={`${section.sectionId}-img-${imageIndex}`} className="space-y-2 rounded border border-slate-800 p-3 bg-slate-950/60">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-16 w-16 rounded border border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                                                        {img ? (
                                                            <img
                                                                src={img}
                                                                alt={`${section.sectionId} thumbnail ${imageIndex + 1}`}
                                                                className="h-full w-full object-cover"
                                                                onError={(e) => {
                                                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                                                }}
                                                            />
                                                        ) : section.sectionId === "product-not-vault" ? (
                                                            <div className="h-12 w-7 rounded-md border-2 border-slate-500 bg-slate-800 relative">
                                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-3 bg-slate-600 rounded-b" />
                                                                <div className="absolute inset-x-1 top-2.5 bottom-2 bg-slate-700 rounded-sm" />
                                                            </div>
                                                        ) : (
                                                            <ImageIcon size={18} className="text-slate-500" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500">
                                                        {img
                                                            ? "Preview of selected image"
                                                            : section.sectionId === "product-not-vault"
                                                                ? "No custom image. Frontend shows default phone visual."
                                                                : "No image selected yet."}
                                                    </p>
                                                </div>
                                                {section.sectionId === "product-not-vault" && (
                                                    <p className="text-[11px] text-slate-500">
                                                        Current visual source: {img ? "Custom image URL set" : "Built-in phone visual (no URL)"}
                                                    </p>
                                                )}
                                                <div className="flex gap-2">
                                                    <Input
                                                        className="bg-slate-950 border-slate-800 text-white"
                                                        placeholder="Image URL (optional if uploaded from PC)"
                                                        value={img || ""}
                                                        onChange={(e) => updateImageField(idx, imageIndex, e.target.value)}
                                                    />
                                                    <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800">
                                                        {uploading[`${section.sectionId}-${imageIndex}`] ? (
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
                                                                void uploadImageFromPc(idx, imageIndex, file);
                                                                e.currentTarget.value = "";
                                                            }}
                                                        />
                                                    </label>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className="text-slate-400 hover:text-red-500"
                                                        onClick={() => removeImageField(idx, imageIndex)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                                {img ? (
                                                    <img
                                                        src={img}
                                                        alt={`${section.sectionId} preview ${imageIndex + 1}`}
                                                        className="h-24 w-full object-cover rounded border border-slate-800"
                                                        onError={(e) => {
                                                            (e.currentTarget as HTMLImageElement).style.display = "none";
                                                        }}
                                                    />
                                                ) : null}
                                            </div>
                                        ))}
                                        <Label className="text-slate-300 mt-2">Order</Label>
                                        <Input
                                            type="number"
                                            className="bg-slate-950 border-slate-800 text-white"
                                            value={section.order || 0}
                                            onChange={(e) => updateSection(idx, { order: Number(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </AdminLayout>
    );
}
