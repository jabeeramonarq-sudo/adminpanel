import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/shared/SEO";
import { useContent } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FolderOpen, Users, Shield, Clock, CheckCircle, XCircle,
  ArrowRight, Lock, FileCheck, AlertTriangle, Heart
} from "lucide-react";
import heroImage from "@/assets/hero-abstract.jpg";

export default function HomePage() {
  const { getContent, isLoading, sections } = useContent();

  const hero = getContent('home-hero');
  const problem = getContent('home-problem');
  const values = getContent('home-values-heading');
  const lifeEvents = getContent('home-life-events');
  const continuity = getContent('home-continuity');
  const diffHeading = getContent('home-different-heading');
  const trust = getContent('home-trust');

  const featureSections = sections
    .filter(s => s.sectionId.startsWith('home-value-'))
    .sort((a, b) => a.order - b.order);

  const doesSections = sections
    .filter(s => s.sectionId.startsWith('home-does-') && !s.sectionId.includes('not'))
    .sort((a, b) => a.order - b.order);

  const doesNotSections = sections
    .filter(s => s.sectionId.startsWith('home-does-not-'))
    .sort((a, b) => a.order - b.order);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FolderOpen': return FolderOpen;
      case 'Users': return Users;
      case 'Lock': return Lock;
      case 'Shield': return Shield;
      default: return FolderOpen;
    }
  };

  // Helper icons for the 4 main features
  const featureIcons = [FolderOpen, Users, Lock, Shield];

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-12" />
          <div className="grid md:grid-cols-2 gap-8">
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
        title="Home"
        description="Amonarq builds digital products focused on reducing chaos, protecting trust, and enabling uninterrupted human flow."
      />

      {/* Section 1: Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />

        <div className="container relative mx-auto px-4 md:px-6 py-20 md:py-32">
          <AnimatedSection className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
              {hero.title.split(',')[0]},<br />
              <span className="text-gradient">{hero.title.split(',')[1]}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {hero.subtitle}
            </p>

            <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-10 shadow-sm animate-fade-in text-left md:text-center">
              <Shield className="h-4 w-4 flex-shrink-0" />
              <span>{hero.body}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/how-it-works">
                  See How MyNxt Works
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/contact">Request Early Access</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 2: The Problem */}
      <section className="py-20 md:py-32 surface-dark">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {problem.title}
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>{problem.subtitle}</p>
              <p>{problem.body.split('.')[0]}.</p>
            </div>
            <div className="mt-10 pt-8 border-t border-border/30">
              <p className="text-primary font-medium">
                {problem.body.split('.')[1]}.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 3: Features */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
              {values.title}
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
              {values.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {featureSections.map((item, idx) => {
              const Icon = featureIcons[idx % featureIcons.length];
              return (
                <AnimatedSection key={item._id} delay={idx * 100}>
                  <div className="flex items-start gap-4 bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-colors h-full">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-foreground font-medium pt-2">{item.title}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Life Events */}
      <section className="py-20 md:py-32 surface-dark">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {lifeEvents.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-4">
              {lifeEvents.subtitle}
            </p>
            <p className="text-muted-foreground text-lg mb-8">
              {lifeEvents.body.split('.')[0]}.
            </p>
            <div className="bg-card/50 border border-border/50 rounded-xl p-6 inline-block">
              <p className="text-primary">
                {lifeEvents.body.split('.')[1]}.
              </p>
            </div>
            <div className="mt-10">
              <Button variant="heroOutline" asChild>
                <Link to="/life-events">
                  Learn About Life Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 5: Continuity */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {continuity.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {continuity.subtitle}
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground/80 px-4">
              <div className="inline-flex items-center gap-2">
                <Lock className="h-4 w-4 flex-shrink-0" />
                <span>{continuity.body.split('.')[0]}.</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <div style={{ paddingBottom: '10px', paddingLeft: '50px' }}>
                  <FileCheck className="h-4 w-4 flex-shrink-0" />
                </div>
                <span>{continuity.body.split('.')[1]}.</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 6: Different */}
      <section className="py-20 md:py-32 surface-dark">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
              {diffHeading.title}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <AnimatedSection delay={100}>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">MyNxt DOES</h3>
                </div>
                <ul className="space-y-4">
                  {doesSections.map((item) => (
                    <li key={item._id} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="bg-muted/30 border border-border/50 rounded-xl p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">MyNxt DOES NOT</h3>
                </div>
                <ul className="space-y-4">
                  {doesNotSections.map((item) => (
                    <li key={item._id} className="flex items-start gap-3 text-muted-foreground">
                      <XCircle className="h-5 w-5 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section 7: Trust */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {trust.title}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {trust.subtitle} {trust.body}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/security">
                  Learn About Security
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/contact">Request Early Access</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
