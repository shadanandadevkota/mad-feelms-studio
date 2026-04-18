import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  project_type: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Tell us a little").max(2000),
});

export const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      project_type: String(fd.get("project_type") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Please check your inputs";
      toast.error(first);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      project_type: parsed.data.project_type || null,
      message: parsed.data.message,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setDone(true);
    toast.success("Message received. We'll be in touch soon.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="relative z-20 bg-gradient-fade-down py-24 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20"
        >
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6">Let's create</p>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-foreground text-balance">
              Tell us your <span className="italic text-primary">story.</span>
            </h2>
            <p className="text-muted-foreground mt-6 max-w-md">
              Weddings, commercials, editorial, brand films — if it has a heartbeat,
              we'd love to hear about it.
            </p>
            <div className="mt-10 space-y-3 text-sm">
              <div>
                <div className="eyebrow mb-1">Email</div>
                <a href="mailto:hello@madfeelms.com" className="font-display text-xl text-foreground nav-link">
                  hello@madfeelms.com
                </a>
              </div>
              <div className="pt-4">
                <div className="eyebrow mb-1">Studio</div>
                <p className="font-display text-xl text-foreground">Sydney · Melbourne · Anywhere</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-border bg-surface p-10 md:p-14 text-center"
              >
                <p className="eyebrow mb-4 text-primary">Sent</p>
                <h3 className="font-display text-3xl md:text-4xl text-foreground mb-3">
                  Thank you.
                </h3>
                <p className="text-muted-foreground">We'll reply within two business days.</p>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-8">
                <Field name="name" label="Your name" placeholder="Jordan Hayes" required />
                <Field name="email" type="email" label="Email" placeholder="you@studio.com" required />
                <Field name="project_type" label="Project type (optional)" placeholder="Wedding · Commercial · Editorial" />
                <Field name="message" label="Tell us about it" textarea required placeholder="Dates, vibe, references…" />

                <Button
                  type="submit"
                  disabled={submitting}
                  variant="outline"
                  className="rounded-none border-foreground/60 bg-transparent px-8 py-6 font-body uppercase tracking-[0.25em] text-xs hover:bg-foreground hover:text-background transition-all duration-500"
                >
                  {submitting ? "Sending…" : "Send Message →"}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

type FieldProps = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  required?: boolean;
};

const Field = ({ name, label, type = "text", placeholder, textarea, required }: FieldProps) => (
  <div className="group">
    <label htmlFor={name} className="eyebrow block mb-3">
      {label} {required && <span className="text-primary">*</span>}
    </label>
    {textarea ? (
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        rows={4}
        className="w-full bg-transparent border-b border-border/60 focus:border-primary outline-none py-3 text-foreground font-body text-lg placeholder:text-muted-foreground/60 transition-colors duration-300 resize-none"
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-border/60 focus:border-primary outline-none py-3 text-foreground font-body text-lg placeholder:text-muted-foreground/60 transition-colors duration-300"
      />
    )}
  </div>
);
