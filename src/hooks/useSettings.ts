import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export interface Settings {
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
    socialMedia: Array<{
        platform: string;
        url: string;
        icon: string;
    }>;
}

export const useSettings = () => {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await api.get("/settings");
            setSettings(response.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch settings:", err);
            setError("Failed to load site settings");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return { settings, isLoading, error, refresh: fetchSettings };
};
