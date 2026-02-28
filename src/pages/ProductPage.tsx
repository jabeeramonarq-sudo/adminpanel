import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/shared/SEO";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useContent } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ShieldCheck,
    Smartphone,
    Lock,
    Users,
    Clock,
    Bell,
    CheckCircle2,
    ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductPage() {
    const { getContent, isLoading, sections } = useContent();

    const hero = getContent('product-hero');
    const notVault = getContent('product-not-vault');
    const realWorldHeading = getContent('product-real-world-heading');
    const cta = getContent('product-cta');
    const notVaultSection = sections.find((s) => s.sectionId === "product-not-vault");
    const conceptImage =
        (notVaultSection as any)?.images?.[0] ||
        (notVaultSection as any)?.image ||
        (notVault as any).image ||
        "";

    const miniFeatures = sections
        .filter(s => s.sectionId.startsWith('product-mini-'))
        .sort((a, b) => a.order - b.order);

    const mainFeatures = sections
        .filter(s => s.sectionId.startsWith('product-feature-'))
        .sort((a, b) => a.order - b.order);

    const icons = [Clock, Bell, CheckCircle2, Users, ShieldCheck, Smartphone];
    const miniIcons = [ShieldCheck, Lock, Users];

    if (isLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-20">
                    <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
                    <Skeleton className="h-64 w-full mb-12" />
                    <div className="grid md:grid-cols-3 gap-8">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SEO
                title="MyNxt - Life's Continuity Companion"
                description="MyNxt by Amonarq is your personal continuity companion."
            />
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                <div className="container mx-auto px-4 md:px-6">
                    <AnimatedSection className="max-w-4xl mx-auto">
                        <div className="relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2rem] p-6 md:p-12 shadow-xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="mb-8 animate-float">
                                    <img
                                        src="/mynxt-logo.png"
                                        alt="MyNxt Logo"
                                        className="h-14 md:h-20 w-auto object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                                    {hero.title.split('.')[0]}.<br />
                                    <span className="text-gradient">{hero.title.split('.')[1]}</span>
                                </h1>

                                <p className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed font-light">
                                    {hero.subtitle}
                                    <br />
                                    {hero.body}
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300" asChild>
                                        <Link to="/contact">Request Early Access</Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="rounded-full px-8 backdrop-blur-md border-border/60 hover:bg-muted/40 transition-all duration-300" asChild>
                                        <Link to="/how-it-works">Discover MyNxt</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Core Concept Section */}
            <section className="py-20 bg-surface-dark">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <AnimatedSection>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                {notVault.title.split('.')[0]}.<br />
                                {notVault.title.split('.')[1]}
                            </h2>
                            <p className="text-muted-foreground text-lg mb-8">
                                {notVault.body}
                            </p>
                            <div className="space-y-4">
                                {miniFeatures.map((item, i) => {
                                    const Icon = miniIcons[i % miniIcons.length];
                                    return (
                                        <div key={item._id} className="flex gap-4">
                                            <div className="mt-1 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground">{item.body}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={200} className="relative">
                            <div className="aspect-square relative rounded-3xl overflow-hidden border border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5 p-4 md:p-8 flex items-center justify-center">
                                {conceptImage ? (
                                    <img
                                        src={conceptImage}
                                        alt="MyNxt visual"
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                ) : (
                                    <div className="w-full max-w-[280px] aspect-[9/19] bg-background rounded-[40px] border-[8px] border-border shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-border rounded-b-2xl" />
                                        <div className="p-6 pt-10">
                                            <div className="w-12 h-12 rounded-xl bg-primary/20 mb-6" />
                                            <div className="space-y-4">
                                                <div className="h-4 w-3/4 bg-muted rounded" />
                                                <div className="h-4 w-full bg-muted rounded" />
                                                <div className="h-20 w-full bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col justify-end">
                                                    <div className="h-2 w-1/2 bg-primary/40 rounded" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="h-16 bg-muted/50 rounded-xl" />
                                                    <div className="h-16 bg-muted/50 rounded-xl" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-1/2 h-8 bg-primary rounded-full" />
                                    </div>
                                )}
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 md:px-6">
                    <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">{realWorldHeading.title}</h2>
                        <p className="text-muted-foreground text-lg">
                            {realWorldHeading.subtitle}
                        </p>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mainFeatures.map((feature, i) => {
                            const Icon = icons[i % icons.length];
                            return (
                                <AnimatedSection key={feature._id} delay={i * 100} className="p-8 rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.body}</p>
                                </AnimatedSection>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -ml-32 -mb-32" />

                        <AnimatedSection>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">{cta.title}</h2>
                            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
                                {cta.body}
                            </p>
                            <Button size="xl" className="rounded-full px-12" asChild>
                                <Link to="/contact">
                                    Get Started Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </AnimatedSection>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
