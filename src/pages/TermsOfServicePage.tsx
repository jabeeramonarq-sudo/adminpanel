import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/shared/SEO";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useContent } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";

export default function TermsOfServicePage() {
    const { getContent, isLoading } = useContent();
    const terms = getContent('terms-of-service');

    if (isLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-20">
                    <Skeleton className="h-12 w-1/2 mb-6" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SEO
                title="Terms of Service"
                description="These Terms govern the use of MyNxt, a continuity execution platform operated by Amonarq."
            />
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 md:px-6">
                    <AnimatedSection className="max-w-4xl mx-auto">
                        <Button variant="ghost" size="sm" asChild className="mb-8 -ml-2 text-muted-foreground hover:text-foreground">
                            <Link to="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                            {terms.title}
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            {terms.subtitle}
                        </p>

                        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                            {terms.body}
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </Layout>
    );
}
