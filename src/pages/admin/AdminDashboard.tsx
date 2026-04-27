import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2, LogOut, Save, Trash2, Search, ExternalLink, Mail, Copy as CopyIcon,
  Home, Film, Camera, Megaphone, Newspaper, Briefcase, Wrench, FileText, PanelBottom, Share2, Inbox,
} from "lucide-react";
import { SectionManager, FieldDef } from "@/components/admin/SectionManager";

type NavItem = {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
  description: string;
};

const NAV_SECTIONS: NavItem[] = [
  { value: "work", label: "Home Work", icon: Home, group: "Collections", description: "Tiles in the Selected Work grid on the homepage." },
  { value: "wedding-films", label: "Wedding Films", icon: Film, group: "Collections", description: "Films featured on the Wedding page grid." },
  { value: "wedding-photos", label: "Wedding Photos", icon: Camera, group: "Collections", description: "Photo collage tiles on the Wedding Photos page." },
  { value: "ads", label: "Ad Projects", icon: Megaphone, group: "Collections", description: "Commercial case studies — list and detail pages." },
  { value: "editorials", label: "Editorials", icon: Newspaper, group: "Collections", description: "Fashion editorial projects with cover, gallery, credits." },
  { value: "media-cases", label: "Media Cases", icon: Briefcase, group: "Collections", description: "Case studies on the Media Production page." },
  { value: "media-services", label: "Services", icon: Wrench, group: "Collections", description: "Capabilities list on the Media Production page." },
  { value: "pages", label: "Page Copy", icon: FileText, group: "Site Settings", description: "Headings, eyebrows and intro copy for every page." },
  { value: "footer", label: "Footer", icon: PanelBottom, group: "Site Settings", description: "Footer tagline, contact email and CTA label." },
  { value: "socials", label: "Socials", icon: Share2, group: "Site Settings", description: "Public Instagram, YouTube and email URLs." },
  { value: "contacts", label: "Inbox", icon: Inbox, group: "Site Settings", description: "Submissions from the website contact form." },
];

type ContentRow = {
  id: string;
  key: string;
  value: Record<string, any>;
  description: string | null;
  updated_at: string;
};

type ContactRow = {
  id: string;
  name: string;
  email: string;
  project_type: string | null;
  message: string;
  created_at: string;
};

const FOOTER_FIELDS: Array<{ k: string; label: string; multiline?: boolean }> = [
  { k: "tagline", label: "Tagline", multiline: true },
  { k: "email", label: "Contact email" },
  { k: "cta_label", label: "CTA label" },
  { k: "copyright_note", label: "Copyright note" },
];

const SOCIAL_FIELDS: Array<{ k: string; label: string }> = [
  { k: "instagram", label: "Instagram URL" },
  { k: "youtube", label: "YouTube URL" },
  { k: "email", label: "Public email" },
];

const PAGE_KEYS: Array<{ key: string; label: string; fields: Array<{ k: string; label: string; multiline?: boolean }> }> = [
  {
    key: "hero",
    label: "Home — Hero",
    fields: [
      { k: "title_lead", label: "Title lead (e.g. MAD)" },
      { k: "title_accent", label: "Title accent (italic, e.g. FEELMS)" },
      { k: "eyebrow", label: "Tagline under title" },
      { k: "top_eyebrow", label: "Top eyebrow (e.g. Showreel · 2026)" },
      { k: "video_url", label: "Background video URL" },
      { k: "poster_url", label: "Video poster image URL" },
    ],
  },
  {
    key: "page_wedding",
    label: "Wedding",
    fields: [
      { k: "title_lead", label: "Title lead" },
      { k: "title_accent", label: "Title accent (italic)" },
      { k: "eyebrow", label: "Eyebrow" },
      { k: "intro", label: "Intro paragraph", multiline: true },
      { k: "side_image_url", label: "Side panel image URL" },
      { k: "showreel_video_url", label: "Showreel video URL" },
      { k: "philosophy", label: "Philosophy quote", multiline: true },
    ],
  },
  {
    key: "page_wedding_photos",
    label: "Wedding Photos",
    fields: [
      { k: "title_lead", label: "Title lead" },
      { k: "title_accent", label: "Title accent" },
      { k: "eyebrow", label: "Eyebrow" },
      { k: "intro", label: "Intro paragraph", multiline: true },
      { k: "book_title", label: "Book section title" },
      { k: "book_body", label: "Book section body", multiline: true },
    ],
  },
  {
    key: "page_ad_commercials",
    label: "Ad Commercials",
    fields: [
      { k: "list_title_lead", label: "List section — title lead" },
      { k: "list_title_accent", label: "List section — title accent" },
      { k: "list_eyebrow", label: "List section — eyebrow" },
    ],
  },
  {
    key: "page_fashion_editorial",
    label: "Fashion Editorial",
    fields: [
      { k: "title_lead", label: "Title lead" },
      { k: "title_accent", label: "Title accent" },
      { k: "eyebrow", label: "Eyebrow" },
      { k: "intro", label: "Intro paragraph", multiline: true },
    ],
  },
  {
    key: "page_media_production",
    label: "Media Production",
    fields: [
      { k: "title_line_1", label: "Title line 1" },
      { k: "title_line_2", label: "Title line 2" },
      { k: "title_accent", label: "Title accent (italic) — e.g. behave" },
      { k: "title_tail", label: "Title tail — e.g. like art." },
      { k: "intro", label: "Intro paragraph", multiline: true },
      { k: "services_title_lead", label: "Services — title lead" },
      { k: "services_title_accent", label: "Services — title accent" },
      { k: "cta_title_lead", label: "CTA — title lead" },
      { k: "cta_title_accent", label: "CTA — title accent" },
      { k: "cta_button_label", label: "CTA — button label" },
    ],
  },
  {
    key: "page_contact",
    label: "Home — Contact",
    fields: [
      { k: "title_lead", label: "Title lead" },
      { k: "title_accent", label: "Title accent" },
      { k: "eyebrow", label: "Eyebrow" },
      { k: "intro", label: "Intro paragraph", multiline: true },
    ],
  },
];

// ===== Per-section field schemas for the SectionManager =====
const WORK_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "category", label: "Category", type: "text", placeholder: "Wedding Film, Ad Commercial…" },
  { key: "href", label: "Link", type: "text", placeholder: "/wedding" },
  { key: "image_url", label: "Image", type: "image" },
  { key: "video_url", label: "Hover video", type: "video" },
  { key: "meta", label: "Meta (e.g. Byron Bay · 2025)", type: "text" },
];

const WEDDING_FILMS_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "place", label: "Place", type: "text" },
  { key: "year", label: "Year", type: "text" },
  { key: "image_url", label: "Image", type: "image" },
];

const WEDDING_PHOTOS_FIELDS: FieldDef[] = [
  { key: "image_url", label: "Image", type: "image" },
  { key: "col_span", label: "Column span", type: "text", placeholder: "md:col-span-6" },
  { key: "aspect", label: "Aspect ratio class", type: "text", placeholder: "aspect-[4/5]" },
  { key: "caption", label: "Caption (alt text)", type: "text" },
];

const AD_PROJECT_FIELDS: FieldDef[] = [
  { key: "slug", label: "Slug (URL)", type: "text", placeholder: "maison-noir" },
  { key: "title", label: "Title", type: "text" },
  { key: "title_lead", label: "Title lead", type: "text" },
  { key: "title_accent", label: "Title accent (italic)", type: "text" },
  { key: "year", label: "Year", type: "text" },
  { key: "eyebrow", label: "Eyebrow", type: "text" },
  { key: "intro", label: "Intro", type: "textarea" },
  { key: "hero_image_url", label: "Hero image", type: "image" },
  { key: "hero_video_url", label: "Hero video", type: "video" },
  { key: "credits", label: "Credits — array of {label, value}", type: "json" },
  { key: "story_blocks", label: "Story blocks — array of {side, img, eyebrow, title, body}", type: "json" },
];

const EDITORIAL_FIELDS: FieldDef[] = [
  { key: "slug", label: "Slug (URL)", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "publication", label: "Publication", type: "text" },
  { key: "year", label: "Year", type: "text" },
  { key: "cover_url", label: "Cover image", type: "image" },
  { key: "intro", label: "Intro", type: "textarea" },
  { key: "grid_pos", label: "Grid position class", type: "text", placeholder: "col-span-1 md:col-span-3 md:row-span-1" },
  { key: "credits", label: "Credits — array of {label, value}", type: "json" },
  { key: "gallery", label: "Gallery — array of image URLs", type: "json" },
];

const MEDIA_CASE_FIELDS: FieldDef[] = [
  { key: "client", label: "Client", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "discipline", label: "Discipline", type: "text" },
  { key: "image_url", label: "Image", type: "image" },
];

const MEDIA_SERVICE_FIELDS: FieldDef[] = [
  { key: "name", label: "Name", type: "text" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAdminAuth();
  const [rows, setRows] = useState<Record<string, ContentRow>>({});
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/maddyy/login", { replace: true });
  }, [loading, user, isAdmin, navigate]);

  const loadAll = useCallback(async () => {
    const [{ data: content }, { data: msgs }] = await Promise.all([
      supabase.from("site_content").select("*").order("key"),
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
    ]);
    if (content) {
      const map: Record<string, ContentRow> = {};
      (content as ContentRow[]).forEach((r) => (map[r.key] = r));
      setRows(map);
    }
    if (msgs) setContacts(msgs as ContactRow[]);
  }, []);

  useEffect(() => {
    if (isAdmin) loadAll();
  }, [isAdmin, loadAll]);

  const updateField = (key: string, field: string, val: string) => {
    setRows((prev) => {
      const cur = prev[key] ?? { id: "", key, value: {}, description: null, updated_at: "" };
      return { ...prev, [key]: { ...cur, value: { ...cur.value, [field]: val } } };
    });
  };

  const save = async (key: string) => {
    setBusyKey(key);
    const row = rows[key];
    const payload = { key, value: row?.value ?? {} };
    const { error } = await supabase
      .from("site_content")
      .upsert(payload, { onConflict: "key" });
    setBusyKey(null);
    if (error) toast.error(error.message);
    else toast.success(`Saved “${key}”`);
  };

  const deleteContact = async (id: string) => {
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setContacts((prev) => prev.filter((c) => c.id !== id));
    toast.success("Submission removed");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </main>
    );
  }
  if (!user || !isAdmin) return null;

  const groups = Array.from(new Set(NAV_SECTIONS.map((s) => s.group)));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Tabs defaultValue="work" orientation="vertical" className="flex min-h-screen w-full">
        {/* === Left sidebar === */}
        <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-border/60 bg-surface/40 backdrop-blur-xl flex flex-col">
          <div className="px-5 py-5 border-b border-border/60 flex items-center gap-3">
            <div className="h-10 w-10 rounded-sm bg-primary flex items-center justify-center shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)]">
              <span className="font-display text-primary-foreground text-lg leading-none">M</span>
            </div>
            <div className="min-w-0">
              <p className="eyebrow text-primary truncate">Studio CMS</p>
              <h1 className="font-display text-base tracking-tight truncate">Mad Feelms</h1>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {groups.map((g) => (
              <div key={g} className="space-y-1">
                <p className="eyebrow text-[10px] px-3 mb-2 text-muted-foreground/70">{g}</p>
                <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1 w-full">
                  {NAV_SECTIONS.filter((s) => s.group === g).map((s) => {
                    const Icon = s.icon;
                    return (
                      <TabsTrigger
                        key={s.value}
                        value={s.value}
                        className="w-full justify-start gap-3 px-3 py-2.5 rounded-md text-sm font-body normal-case tracking-normal text-muted-foreground hover:text-foreground hover:bg-surface data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_24px_-8px_hsl(var(--primary)/0.7)] transition-all"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 text-left">{s.label}</span>
                        {s.value === "contacts" && contacts.length > 0 && (
                          <span className="px-1.5 py-0.5 bg-primary/20 text-primary rounded text-[10px]">
                            {contacts.length}
                          </span>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-border/60 space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-surface border border-border">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => signOut()} className="w-full border-border hover:bg-surface justify-start">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>
        </aside>

        {/* === Main content === */}
        <div className="flex-1 min-w-0 relative">
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />
          <div className="relative px-6 md:px-10 py-10 space-y-8">

          <TabsContent value="work">
            <SectionManager
              table="work_items"
              title="Home — Selected Work tiles"
              fields={WORK_FIELDS}
              defaults={{ title: "New work", category: "Project", href: "/", image_url: "", video_url: "", meta: "" }}
              renderLabel={(it) => `${it.title} — ${it.category}`}
            />
          </TabsContent>

          <TabsContent value="wedding-films">
            <SectionManager
              table="wedding_films"
              title="Wedding Photos — Films grid"
              fields={WEDDING_FILMS_FIELDS}
              defaults={{ title: "New film", place: "", year: "", image_url: "" }}
              renderLabel={(it) => `${it.title} · ${it.place ?? ""}`}
            />
          </TabsContent>

          <TabsContent value="wedding-photos">
            <SectionManager
              table="wedding_photos"
              title="Wedding Photos — Photo grid"
              fields={WEDDING_PHOTOS_FIELDS}
              defaults={{ image_url: "", col_span: "md:col-span-6", aspect: "aspect-[4/5]", caption: "" }}
              renderLabel={(it) => it.caption || it.image_url?.split("/").pop() || "Photo"}
            />
          </TabsContent>

          <TabsContent value="ads">
            <SectionManager
              table="ad_projects"
              title="Ad Commercials"
              fields={AD_PROJECT_FIELDS}
              defaults={{
                slug: `project-${Date.now().toString(36).slice(-5)}`,
                title: "New project",
                title_lead: "New",
                title_accent: "Project",
                year: new Date().getFullYear().toString(),
                hero_image_url: "",
                hero_video_url: "",
                eyebrow: "",
                intro: "",
                credits: [],
                story_blocks: [],
                is_featured: false,
              }}
              renderLabel={(it) => `${it.title}${it.is_featured ? " · ★" : ""}`}
            />
          </TabsContent>

          <TabsContent value="editorials">
            <SectionManager
              table="editorial_projects"
              title="Fashion Editorials"
              fields={EDITORIAL_FIELDS}
              defaults={{
                slug: `editorial-${Date.now().toString(36).slice(-5)}`,
                title: "New editorial",
                publication: "",
                year: new Date().getFullYear().toString(),
                cover_url: "",
                intro: "",
                grid_pos: "col-span-1 md:col-span-3 md:row-span-1",
                credits: [],
                gallery: [],
              }}
              renderLabel={(it) => `${it.title} · ${it.publication ?? ""}`}
            />
          </TabsContent>

          <TabsContent value="media-cases">
            <SectionManager
              table="media_cases"
              title="Media Production — Case studies"
              fields={MEDIA_CASE_FIELDS}
              defaults={{ client: "New client", title: "Case title", discipline: "", image_url: "" }}
              renderLabel={(it) => `${it.client} — ${it.title}`}
            />
          </TabsContent>

          <TabsContent value="media-services">
            <SectionManager
              table="media_services"
              title="Media Production — Services list"
              fields={MEDIA_SERVICE_FIELDS}
              defaults={{ name: "New service" }}
              renderLabel={(it) => it.name}
            />
          </TabsContent>

          <TabsContent value="pages">
            <div className="grid gap-6">
              {PAGE_KEYS.map(({ key, label, fields }) => (
                <Card key={key} className="p-6 space-y-4 bg-surface border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl">{label}</h3>
                    <Button
                      size="sm"
                      onClick={() => save(key)}
                      disabled={busyKey === key}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {busyKey === key ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Save className="h-4 w-4 mr-2" /> Save</>)}
                    </Button>
                  </div>
                  {fields.map((f) => (
                    <div key={f.k} className="space-y-2">
                      <Label className="eyebrow">{f.label}</Label>
                      {f.multiline ? (
                        <Textarea
                          rows={3}
                          value={rows[key]?.value?.[f.k] ?? ""}
                          onChange={(e) => updateField(key, f.k, e.target.value)}
                        />
                      ) : (
                        <Input
                          value={rows[key]?.value?.[f.k] ?? ""}
                          onChange={(e) => updateField(key, f.k, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="footer">
            <Card className="p-6 space-y-5 bg-surface border-border">
              {FOOTER_FIELDS.map((f) => (
                <div key={f.k} className="space-y-2">
                  <Label className="eyebrow">{f.label}</Label>
                  {f.multiline ? (
                    <Textarea
                      rows={3}
                      value={rows.footer?.value?.[f.k] ?? ""}
                      onChange={(e) => updateField("footer", f.k, e.target.value)}
                    />
                  ) : (
                    <Input
                      value={rows.footer?.value?.[f.k] ?? ""}
                      onChange={(e) => updateField("footer", f.k, e.target.value)}
                    />
                  )}
                </div>
              ))}
              <Button onClick={() => save("footer")} disabled={busyKey === "footer"} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {busyKey === "footer" ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Save className="h-4 w-4 mr-2" /> Save footer</>)}
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="socials">
            <Card className="p-6 space-y-5 bg-surface border-border">
              {SOCIAL_FIELDS.map((f) => (
                <div key={f.k} className="space-y-2">
                  <Label className="eyebrow">{f.label}</Label>
                  <Input
                    value={rows.socials?.value?.[f.k] ?? ""}
                    onChange={(e) => updateField("socials", f.k, e.target.value)}
                    placeholder="https://…"
                  />
                </div>
              ))}
              <Button onClick={() => save("socials")} disabled={busyKey === "socials"} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {busyKey === "socials" ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Save className="h-4 w-4 mr-2" /> Save socials</>)}
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <div className="grid gap-4">
              {contacts.length === 0 && (
                <p className="text-muted-foreground text-sm">No submissions yet.</p>
              )}
              {contacts.map((c) => (
                <Card key={c.id} className="p-5 bg-surface border-border">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-lg">{c.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {c.email}
                        {c.project_type ? ` · ${c.project_type}` : ""} ·{" "}
                        {new Date(c.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteContact(c.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-3 text-sm whitespace-pre-wrap">{c.message}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
          </div>
        </div>
      </Tabs>
    </main>
  );
};

export default AdminDashboard;
