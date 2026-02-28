import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/shared/SEO";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useContent } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Lock, Eye, FileCheck, ArrowRight } from "lucide-react";

export default function SecurityPage() {
  const { getContent, isLoading, sections } = useContent();

  const hero = getContent('security-hero');
  const approach = getContent('security-approach-heading');
  const commitment = getContent('security-commitment');
  const badge = getContent('security-badge-text');
  const cta = getContent('security-cta');

  const approachItems = sections
    .filter(s => s.sectionId.startsWith('security-item-'))
    .sort((a, b) => a.order - b.order);

  const icons = [Lock, Eye, FileCheck, Shield];

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Security & Trust"
        description="MyNxt is built with responsibility at its foundation."
      />
      {/* Hero */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-30" />

        <div className="container relative mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {hero.title}
            </h1>
            <p className="text-xl text-muted-foreground font-light mb-8 italic">
              <b>{hero.subtitle}</b><br />
              {hero.body}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 md:py-24 surface-dark">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-10 w-10 text-primary" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              {approach.title}
            </h2>

            <p className="text-muted-foreground text-lg text-center mb-12">
              {approach.subtitle}
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {approachItems.map((item, idx) => {
                const Icon = icons[idx % icons.length];
                return (
                  <div key={item._id} className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {item.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Trust Statement */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {commitment.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {commitment.body}
            </p>
            <div className="inline-flex items-center gap-3 text-sm font-medium text-primary bg-primary/10 border border-primary/20 px-6 py-3 rounded-full shadow-sm hover:bg-primary/15 transition-colors">
              <Shield className="h-5 w-5" />
              <span>{badge.title}</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 surface-dark">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {cta.title}
            </h2>
            <p className="text-muted-foreground mb-8">
              {cta.body}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/about">About Amonarq</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
