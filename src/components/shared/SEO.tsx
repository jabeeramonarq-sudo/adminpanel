import { useEffect } from "react";

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
    ogType?: string;
    ogImage?: string;
    twitterCard?: string;
    schema?: object | object[];
}

export const SEO = ({
    title,
    description,
    canonical,
    ogType = "website",
    ogImage = "/og-image.png",
    twitterCard = "summary_large_image",
    schema,
}: SEOProps) => {
    useEffect(() => {
        const siteName = "Amonarq";
        const fullTitle = title ? `${title} | ${siteName}` : `Amonarq - Designing Systems for Continuity`;

        // Update Title
        document.title = fullTitle;

        // Update Meta Description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute("content", description || "Amonarq builds digital products focused on reducing chaos, protecting trust, and enabling uninterrupted human flow.");
        }

        // Update Canonical
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (!linkCanonical) {
            linkCanonical = document.createElement('link');
            linkCanonical.setAttribute('rel', 'canonical');
            document.head.appendChild(linkCanonical);
        }
        linkCanonical.setAttribute('href', canonical || window.location.href);

        // Update Open Graph
        const updateOG = (property: string, content: string) => {
            let el = document.querySelector(`meta[property="${property}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute('property', property);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        updateOG("og:title", fullTitle);
        updateOG("og:description", description || "amonarq builds digital products focused on reducing chaos, protecting trust, and enabling uninterrupted human flow.");
        updateOG("og:type", ogType);
        updateOG("og:url", window.location.href);
        updateOG("og:image", window.location.origin + ogImage);

        // Update Twitter
        const updateTwitter = (name: string, content: string) => {
            let el = document.querySelector(`meta[name="${name}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute('name', name);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        updateTwitter("twitter:card", twitterCard);
        updateTwitter("twitter:title", fullTitle);
        updateTwitter("twitter:description", description || "amonarq builds digital products focused on reducing chaos, protecting trust, and enabling uninterrupted human flow.");
        updateTwitter("twitter:image", window.location.origin + ogImage);

        // Update Structured Data (JSON-LD)
        let scriptSchema = document.querySelector('script[type="application/ld+json"]#structured-data');
        if (schema) {
            if (!scriptSchema) {
                scriptSchema = document.createElement('script');
                scriptSchema.setAttribute('type', 'application/ld+json');
                scriptSchema.id = 'structured-data';
                document.head.appendChild(scriptSchema);
            }
            scriptSchema.textContent = JSON.stringify(schema);
        } else if (scriptSchema) {
            // If no schema is provided, keep the existing one or clear it?
            // Usually, we want to remove it if the page doesn't define it to avoid stale global data
            // But index.html had one. We'll handle removal to ensure clean per-page SEO.
            scriptSchema.remove();
        }

    }, [title, description, canonical, ogType, ogImage, twitterCard, schema]);

    return null;
};
