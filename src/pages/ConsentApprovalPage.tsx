import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/shared/SEO";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { UserCheck, Lock, FileCheck, Shield, CheckCircle, Heart } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConsentApprovalPage() {
    const { getContent, isLoading } = useContent();
    const hero = getContent('consent-approval-hero');
    const consentFirst = getContent('consent-approval-first-heading');
    const principle1 = getContent('consent-approval-principle-1');
    const principle2 = getContent('consent-approval-principle-2');
    const whyHeading = getContent('consent-approval-why-heading');
    const benefit1 = getContent('consent-approval-benefit-1');
    const benefit2 = getContent('consent-approval-benefit-2');
    const benefit3 = getContent('consent-approval-benefit-3');

    if (isLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-20">
                    <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SEO
                title="Consent & Approval"
                description="MyNxt builds trust through explicit authorization, clear intent, and a robust consent framework."
            />
            {/* Hero / Header Section */}
            <section className="py-20 md:py-32 relative overflow-hidden">
                <div className="container relative mx-auto px-4 md:px-6">
                    <AnimatedSection className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
                            {hero.title}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                            {hero.subtitle}
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            {/* Section 1: Consent First */}
            <section className="py-20 md:py-32 surface-dark">
                <div className="container mx-auto px-4 md:px-6">
                    <AnimatedSection className="max-w-4xl mx-auto">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                                <UserCheck className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
                                {consentFirst.title}
                            </h2>

                            <div className="space-y-8 max-w-2xl">
                                <p className="text-xl md:text-2xl text-foreground font-medium">
                                    {consentFirst.subtitle}
                                </p>
                                <div className="grid sm:grid-cols-2 gap-6 pt-8">
                                    <div className="flex items-center gap-4 bg-card/50 p-6 rounded-xl border border-border/50">
                                        <Lock className="h-6 w-6 text-primary flex-shrink-0" />
                                        <span className="text-muted-foreground text-left">{principle1.title}</span>
                                    </div>
                                    <div className="flex items-center gap-4 bg-card/50 p-6 rounded-xl border border-border/50">
                                        <FileCheck className="h-6 w-6 text-primary flex-shrink-0" />
                                        <span className="text-muted-foreground text-left">{principle2.title}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Section 2: Why This Matters */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 md:px-6">
                    <AnimatedSection className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16 text-center">
                            {whyHeading.title}
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Shield,
                                    title: benefit1.title,
                                    color: "text-destructive",
                                    bg: "bg-destructive/10"
                                },
                                {
                                    icon: CheckCircle,
                                    title: benefit2.title,
                                    color: "text-warning",
                                    bg: "bg-warning/10"
                                },
                                {
                                    icon: Heart,
                                    title: benefit3.title,
                                    color: "text-primary",
                                    bg: "bg-primary/10"
                                }
                            ].map((point, idx) => (
                                <div key={idx} className="bg-card border border-border/50 rounded-2xl p-8 hover:border-primary/20 transition-all group">
                                    <div className={`w-12 h-12 rounded-xl ${point.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <point.icon className={`h-6 w-6 ${point.color}`} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground">
                                        {point.title}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </Layout>
    );
}
