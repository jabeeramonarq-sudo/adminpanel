import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/shared/SEO";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/button";
import { AmonarqLogo } from "@/components/brand/AmonarqLogo";
import { useContent } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Heart, Shield, Target, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const { getContent, isLoading, sections } = useContent();

  const hero = getContent('about-hero');
  const missionHeading = getContent('about-mission-heading');
  const productIntro = getContent('about-product-intro-heading');
  const quote = getContent('about-quote');
  const missionStatement = getContent('about-mission-statement');
  const vision = getContent('about-vision');
  const philosophyHeading = getContent('about-philosophy-heading');

  const philosophyItems = sections
    .filter(s => s.sectionId.startsWith('about-philosophy-'))
    .sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-12" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="About Amonarq"
        description="Amonarq builds systems focused on life continuity. We believe technology should reduce chaos, respect intent, and support people during critical moments."
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

      {/* About Us Content */}
      <section className="py-16 md:py-24 surface-dark">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-12">
              <AmonarqLogo className="h-16" showWordmark={false} />
            </div>

            <div className="space-y-12 text-center md:text-left">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                  {missionHeading.title.split('for')[0]}for <span className="text-gradient">{missionHeading.title.split('for')[1]}</span>
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                  {missionHeading.body}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                    {productIntro.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {productIntro.body}
                  </p>
                </div>
                <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
                  <p className="text-foreground text-lg leading-relaxed italic">
                    "{quote.body}"
                  </p>
                </div>
              </div>

              <div className="pt-12 text-center">
                <div className="inline-block p-1 rounded-full bg-primary/10 mb-6">
                  <div className="bg-background px-6 py-2 rounded-full border border-primary/20">
                    <span className="text-primary font-semibold tracking-wide uppercase text-sm">{missionStatement.title}</span>
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground max-w-3xl mx-auto leading-tight">
                  {missionStatement.body}
                </p>
              </div>

              {/* Added Vision & Philosophy */}
              <div className="grid md:grid-cols-2 gap-12 pt-16">
                <div className="space-y-6 p-8 rounded-2xl bg-primary/5 border border-primary/10 text-left">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-2">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{vision.title}</h3>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{vision.body}"
                  </p>
                </div>

                <div className="space-y-6 p-8 rounded-2xl bg-secondary/5 border border-secondary/10 text-left">
                  <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary mb-2">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Our Philosophy</h3>
                  <ul className="space-y-3 text-muted-foreground leading-relaxed">
                    {philosophyItems.map((item) => (
                      <li key={item._id} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                        {item.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Amonarq Systems Private Limited
            </h2>
            <address className="text-muted-foreground not-italic mb-8">
              4-578 & Row House, Prasanth Nagar,<br />
              Madanapalle, Andhra Pradesh<br />
              PIN-517325, India.
            </address>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
