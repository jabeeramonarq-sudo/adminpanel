import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/shared/SEO";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useContent } from "@/hooks/useContent";
import { useSettings } from "@/hooks/useSettings";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";

const contactSchema = z.object({
  name: z.string().trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  subject: z.string().trim()
    .min(2, "Subject must be at least 2 characters")
    .max(200, "Subject must be less than 200 characters"),
  message: z.string().trim()
    .min(2, "Message must be at least 2 characters")
    .max(2000, "Message must be less than 2000 characters"),
});

export default function ContactPage() {
  const { getContent, isLoading: contentLoading } = useContent();
  const { settings, isLoading: settingsLoading } = useSettings();
  const fallbackAddress = "4-578, Row House, Prasanth Nagar, Madanapalle, Andhra Pradesh 517325, India.";
  const fallbackEmail = "business@amonarq.com";
  const contactAddress = settings?.contactInfo?.address?.trim() || fallbackAddress;
  const contactEmail = settings?.contactInfo?.email?.trim() || fallbackEmail;
  const mapsUrl =
    settings?.contactInfo?.mapsUrl?.trim() ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactAddress)}`;

  const hero = getContent('contact-hero');
  const info = getContent('contact-info-heading');
  const earlyAccess = getContent('contact-early-access-note');
  const success = getContent('contact-success-title');

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/inbox/submit', formData);

      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast.success("Thank you for your message. We'll get back to you soon!");
    } catch (error: any) {
      console.error('Error submitting form:', error);
      if (axios.isAxiosError(error) && !error.response) {
        toast.error("Cannot reach backend server. Please ensure API is running on port 5000.");
      } else {
        toast.error(error.response?.data?.error || error.message || "Failed to send message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = contentLoading || settingsLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Skeleton className="h-12 w-1/2 mx-auto mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Contact Us"
        description="Get in touch with Amonarq to learn more about MyNxt, request early access, or discuss business opportunities."
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

      {/* Contact Section */}
      <section className="py-16 md:py-24 surface-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
            {/* Contact Info */}
            <AnimatedSection>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                {info.title}
              </h2>
              <p className="text-muted-foreground mb-8">
                {info.body}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <a href={`mailto:${contactEmail}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Registered Office</h3>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <address className="not-italic text-sm leading-relaxed whitespace-pre-line">
                        Amonarq Systems Private Limited<br />
                        {contactAddress}
                      </address>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-primary/5 border border-primary/20 rounded-xl">
                <h3 className="font-semibold text-foreground mb-2">{earlyAccess.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {earlyAccess.body}
                </p>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection delay={200}>
              {isSubmitted ? (
                <div className="bg-card border border-border/50 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {success.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {success.body}
                  </p>
                  <Button
                    variant="heroOutline"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-xl p-6 md:p-8">
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="name" className="text-foreground">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="mt-1.5 bg-muted/50 border-border"
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-foreground">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="mt-1.5 bg-muted/50 border-border"
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-foreground">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Early Access Request / General Inquiry"
                        className="mt-1.5 bg-muted/50 border-border"
                      />
                      {errors.subject && (
                        <p className="text-sm text-destructive mt-1">{errors.subject}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-foreground">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us what you're interested in..."
                        rows={5}
                        className="mt-1.5 bg-muted/50 border-border resize-none"
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive mt-1">{errors.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
}
