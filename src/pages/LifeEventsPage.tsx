import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/shared/SEO";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useContent } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Users, Settings, Eye, Shield, Heart, ArrowRight, Lock } from "lucide-react";

export default function LifeEventsPage() {
  const { getContent, isLoading, sections } = useContent();

  const hero = getContent('life-events-hero');
  const what = getContent('life-event-what');
  const part1 = getContent('life-event-part-1');
  const part2 = getContent('life-event-part-2');
  const whyHeading = getContent('life-events-matter-heading');
  const cta = getContent('life-events-cta');

  const matters = sections
    .filter(s => s.sectionId.startsWith('life-events-matter-'))
    .sort((a, b) => a.order - b.order);

  const icons = [Eye, Shield, Heart, Lock];

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
        title="Life Events"
        description="A Life Event is a structured way to organise specific areas of life responsibility, information, and people."
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

      {/* What is a Life Event */}
      <section className="py-16 md:py-24 surface-dark">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              {what.title}
            </h2>
            <p className="text-muted-foreground text-lg text-center mb-12">
              {what.body}
            </p>

            <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto shadow-sm">
              <p className="text-foreground text-center text-lg mb-10 font-medium">
                It brings together
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="text-center group">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2 text-xl">{part1.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{part1.body}</p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                    <Settings className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2 text-xl">{part2.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{part2.body}</p>
                </div>
              </div>
              <p className="text-primary text-center mt-12 font-bold text-lg tracking-tight">
                All in one place.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Life Events Matter */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              {whyHeading.title}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {matters.map((item, idx) => {
              const Icon = icons[idx % icons.length];
              return (
                <AnimatedSection key={item._id} delay={idx * 100}>
                  <div className="bg-card border border-border/50 rounded-xl p-8 text-center hover:border-primary/30 transition-colors h-full">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-7 w-7 text-primary" />
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
            <Button variant="hero" size="lg" asChild>
              <Link to="/continuity">
                Learn About Continuity
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
