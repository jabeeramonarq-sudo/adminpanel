import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/shared/SEO";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useContent } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Shield, Heart, ArrowRight, UserCheck, Lock, FileCheck } from "lucide-react";

export default function ConsentPage() {
  const { getContent, isLoading, sections } = useContent();

  const hero = getContent('consent-hero');
  const first = getContent('consent-first');
  const mattersHeading = getContent('consent-matters-heading');
  const flowHeading = getContent('consent-flow-heading');
  const cta = getContent('consent-cta');

  const matters = sections
    .filter(s => s.sectionId.startsWith('consent-matters-'))
    .sort((a, b) => a.order - b.order);

  const steps = sections
    .filter(s => s.sectionId.startsWith('consent-step-'))
    .sort((a, b) => a.order - b.order);

  const icons = [Shield, CheckCircle, Heart];

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
        title="Consent & Approval"
        description="Every action requires explicit authorization. Learn about how MyNxt handles consent."
      />
      {/* Hero */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-30" />

        <div className="container relative mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {hero.title}
            </h1>
            <p className="text-xl text-muted-foreground font-light">
              {hero.subtitle}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Consent First */}
      <section className="py-16 md:py-24 surface-dark">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCheck className="h-10 w-10 text-primary" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              {first.title}
            </h2>

            <div className="text-center space-y-6">
              <p className="text-muted-foreground text-lg">
                {first.subtitle}
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-foreground">
                  <Lock className="h-5 w-5 text-primary" />
                  <span>{first.body.split('. ')[0]}</span>
                </div>
                <span className="hidden md:block text-muted-foreground">•</span>
                <div className="flex items-center gap-2 text-foreground">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <span>{first.body.split('. ')[1]}</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              {mattersHeading.title}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {matters.map((item, idx) => {
              const Icon = icons[idx % icons.length];
              const colorClass = idx === 0 ? "text-destructive/70" : idx === 1 ? "text-warning/70" : "text-primary";
              const bgColorClass = idx === 0 ? "bg-destructive/10" : idx === 1 ? "bg-warning/10" : "bg-primary/10";

              return (
                <AnimatedSection key={item._id} delay={idx * 100}>
                  <div className="bg-card border border-border/50 rounded-xl p-8 text-center hover:border-primary/30 transition-colors h-full">
                    <div className={`w-14 h-14 rounded-full ${bgColorClass} flex items-center justify-center mx-auto mb-6`}>
                      <Icon className={`h-7 w-7 ${colorClass}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Consent Flow */}
      <section className="py-16 md:py-24 surface-dark">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              {flowHeading.title}
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="max-w-3xl mx-auto bg-card border border-border/50 rounded-2xl p-8 md:p-10">
              <div className="space-y-8">
                {steps.map((item, idx) => (
                  <div key={item._id} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-bold text-sm">{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {cta.title}
            </h2>
            <p className="text-muted-foreground mb-8">
              {cta.body}
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/security">
                Learn About Security
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
