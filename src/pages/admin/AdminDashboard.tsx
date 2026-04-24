import { useEffect, useState, useCallback } from "react";
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
import { Loader2, LogOut, Save, Trash2 } from "lucide-react";

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

const PAGE_KEYS: Array<{ key: string; label: string }> = [
  { key: "hero", label: "Home — Hero" },
  { key: "page_wedding", label: "Wedding" },
  { key: "page_ad_commercials", label: "Ad Commercials" },
  { key: "page_fashion_editorial", label: "Fashion Editorial" },
  { key: "page_media_production", label: "Media Production" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAdminAuth();
  const [rows, setRows] = useState<Record<string, ContentRow>>({});
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  // Gate
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between py-5">
          <div>
            <p className="eyebrow text-muted-foreground">Mad Feelms</p>
            <h1 className="font-display text-2xl">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-10">
        <Tabs defaultValue="footer">
          <TabsList className="mb-8">
            <TabsTrigger value="footer">Footer</TabsTrigger>
            <TabsTrigger value="socials">Socials</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="contacts">Submissions ({contacts.length})</TabsTrigger>
          </TabsList>

          {/* Footer tab */}
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
                {busyKey === "footer" ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Save footer</>}
              </Button>
            </Card>
          </TabsContent>

          {/* Socials tab */}
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
                {busyKey === "socials" ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Save socials</>}
              </Button>
            </Card>
          </TabsContent>

          {/* Pages tab */}
          <TabsContent value="pages">
            <div className="grid gap-6">
              {PAGE_KEYS.map(({ key, label }) => {
                const row = rows[key];
                const fields = key === "hero"
                  ? ["title_lead", "title_accent", "eyebrow", "top_eyebrow"]
                  : ["title", "intro"];
                return (
                  <Card key={key} className="p-6 space-y-4 bg-surface border-border">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl">{label}</h3>
                      <Button
                        size="sm"
                        onClick={() => save(key)}
                        disabled={busyKey === key}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {busyKey === key ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Save</>}
                      </Button>
                    </div>
                    {fields.map((f) => (
                      <div key={f} className="space-y-2">
                        <Label className="eyebrow">{f.replace(/_/g, " ")}</Label>
                        {f === "intro" ? (
                          <Textarea
                            rows={3}
                            value={row?.value?.[f] ?? ""}
                            onChange={(e) => updateField(key, f, e.target.value)}
                          />
                        ) : (
                          <Input
                            value={row?.value?.[f] ?? ""}
                            onChange={(e) => updateField(key, f, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Contacts tab */}
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
        </Tabs>
      </div>
    </main>
  );
};

export default AdminDashboard;
