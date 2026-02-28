import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/shared/SEO";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useContent } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Shield, AlertCircle, ArrowRight, Lock, CheckCircle } from "lucide-react";

export default function ContinuityPage() {
  const { getContent, isLoading, sections } = useContent();

  const hero = getContent('continuity-hero');
  const explained = getContent('continuity-explained');
  const note = getContent('continuity-note');
  const howHeading = getContent('continuity-how-heading');
  const cta = getContent('continuity-cta');
  const explainedBadges = (explained.subtitle || "Cautious, Rule-based, Consent-driven")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const steps = sections
    .filter(s => s.sectionId.startsWith('continuity-step-'))
    .sort((a, b) => a.order - b.order);

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
        title="Continuity & Triggers"
        description="Learn how MyNxt ensures responsibilities don't get stuck through smart continuity checks and predefined triggers."
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

      {/* Continuity Explained */}
      <section className="py-16 md:py-24 surface-dark">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
                <Clock className="h-10 w-10 text-secondary" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              {explained.title}
            </h2>

            <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-10 text-center">
              <p className="text-muted-foreground text-lg mb-6">
                {explained.body}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                {explainedBadges.map((badge, idx) => {
                  const Icon = [Shield, CheckCircle, Lock][idx % 3];
                  return (
                    <span key={`${badge}-${idx}`} className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                      <Icon className="h-4 w-4" />
                      {badge}
                    </span>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Important Note */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-3xl mx-auto">
            <div className="bg-warning/5 border border-warning/20 rounded-2xl p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {note.title}
                  </h3>
                  <p className="text-muted-foreground text-lg mb-4 font-bold">
                    {note.subtitle}
                  </p>
                  <p className="text-muted-foreground">
                    {note.body}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How Triggers Work */}
      <section className="py-16 md:py-24 surface-dark">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              {howHeading.title}
            </h2>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-6">
            {steps.map((item, idx) => (
              <AnimatedSection key={item._id} delay={idx * 100}>
                <div className="flex gap-4 bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">{idx + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.body}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
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
              <Link to="/consent">
                Learn About Consent
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
