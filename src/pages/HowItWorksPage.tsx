import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/shared/SEO";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useContent } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FolderOpen, Users, Settings, Shield, PlayCircle,
  ArrowRight, ChevronRight, FileText, Zap, Bell, CheckCircle
} from "lucide-react";

export default function HowItWorksPage() {
  const { getContent, isLoading, sections } = useContent();

  const hero = getContent('how-it-works-hero');
  const footerNote = getContent('how-footer-note');
  const cta = getContent('how-cta');

  const stepsList = sections
    .filter(s => s.sectionId.startsWith('how-step-'))
    .sort((a, b) => a.order - b.order);

  const icons = [
    FolderOpen, Users, Settings, Shield, PlayCircle,
    Bell, FileText, Zap, CheckCircle
  ];

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
        title="How It Works"
        description="Learn how MyNxt works through a simple flow to organise, protect, and ensure continuity for your life responsibilities."
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

      {/* Steps Section */}
      <section className="py-16 md:py-24 surface-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {stepsList.map((item, idx) => {
              const Icon = icons[idx % icons.length];
              const stepNumber = (idx + 1).toString().padStart(2, '0');

              return (
                <AnimatedSection key={item._id} delay={idx * 100}>
                  <div className={`flex gap-6 md:gap-10 ${idx !== stepsList.length - 1 ? 'pb-12 md:pb-16' : ''}`}>
                    {/* Step number and line */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-lg">{stepNumber}</span>
                      </div>
                      {idx !== stepsList.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/30 to-transparent mt-4" />
                      )}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-lg">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          <AnimatedSection className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-secondary/10 border border-secondary/20 rounded-2xl text-secondary text-lg font-medium shadow-sm animate-fade-in max-w-2xl mx-auto">
              <span>{footerNote.title}</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
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
                  Request Early Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/life-events">
                  Learn About Life Events
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
