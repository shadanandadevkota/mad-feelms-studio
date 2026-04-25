import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { MediaInput } from "./MediaInput";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "video" | "media" | "json";
  placeholder?: string;
};

type Item = Record<string, any> & {
  id: string;
  sort_order: number;
  is_visible: boolean;
};

type Table =
  | "work_items"
  | "wedding_films"
  | "wedding_photos"
  | "ad_projects"
  | "editorial_projects"
  | "media_cases"
  | "media_services";

type Props = {
  table: Table;
  title: string;
  fields: FieldDef[];
  defaults: Record<string, any>;
  /** Renders a small preview line for the collapsed item header */
  renderLabel: (item: Item) => string;
};

export const SectionManager = ({ table, title, fields, defaults, renderLabel }: Props) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    setItems(((data as unknown) as Item[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const updateLocal = (id: string, patch: Record<string, any>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const saveItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setSavingId(id);
    // strip immutable / managed fields
    const { id: _id, created_at, updated_at, ...payload } = item as any;
    const { error } = await (supabase.from(table) as any).update(payload).eq("id", id);
    setSavingId(null);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  };

  const addItem = async () => {
    const nextOrder = (items[items.length - 1]?.sort_order ?? 0) + 10;
    const payload = { ...defaults, sort_order: nextOrder, is_visible: true };
    const { data, error } = await (supabase.from(table) as any).insert(payload).select().single();
    if (error) return toast.error(error.message);
    setItems((p) => [...p, data as Item]);
    setOpenId((data as Item).id);
    toast.success("Added");
  };

  const duplicateItem = async (id: string) => {
    const it = items.find((i) => i.id === id);
    if (!it) return;
    const { id: _i, created_at, updated_at, ...rest } = it as any;
    const payload = {
      ...rest,
      sort_order: (it.sort_order ?? 0) + 1,
      // For tables with unique slug, append `-copy` to avoid collision
      ...(rest.slug ? { slug: `${rest.slug}-copy-${Date.now().toString(36).slice(-4)}` } : {}),
    };
    const { data, error } = await (supabase.from(table) as any).insert(payload).select().single();
    if (error) return toast.error(error.message);
    setItems((p) => [...p, data as Item].sort((a, b) => a.sort_order - b.sort_order));
    toast.success("Duplicated");
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this item permanently?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    setItems((p) => p.filter((i) => i.id !== id));
    toast.success("Deleted");
  };

  const toggleVisible = async (id: string, next: boolean) => {
    updateLocal(id, { is_visible: next });
    const { error } = await (supabase.from(table) as any)
      .update({ is_visible: next })
      .eq("id", id);
    if (error) toast.error(error.message);
  };

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex).map((it, idx) => ({
      ...it,
      sort_order: (idx + 1) * 10,
    }));
    setItems(reordered);
    // Persist new sort_order for everyone (small lists, fine)
    await Promise.all(
      reordered.map((it) =>
        (supabase.from(table) as any).update({ sort_order: it.sort_order }).eq("id", it.id),
      ),
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {items.length} item{items.length !== 1 && "s"} · drag to reorder
          </p>
        </div>
        <Button onClick={addItem} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((item) => (
              <SortableRow
                key={item.id}
                item={item}
                fields={fields}
                open={openId === item.id}
                saving={savingId === item.id}
                onToggleOpen={() => setOpenId(openId === item.id ? null : item.id)}
                onChange={(patch) => updateLocal(item.id, patch)}
                onSave={() => saveItem(item.id)}
                onDuplicate={() => duplicateItem(item.id)}
                onDelete={() => deleteItem(item.id)}
                onToggleVisible={(v) => toggleVisible(item.id, v)}
                renderLabel={renderLabel}
              />
            ))}
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No items yet. Click <span className="font-display">Add</span> to create one.
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

const SortableRow = ({
  item,
  fields,
  open,
  saving,
  onToggleOpen,
  onChange,
  onSave,
  onDuplicate,
  onDelete,
  onToggleVisible,
  renderLabel,
}: {
  item: Item;
  fields: FieldDef[];
  open: boolean;
  saving: boolean;
  onToggleOpen: () => void;
  onChange: (patch: Record<string, any>) => void;
  onSave: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleVisible: (v: boolean) => void;
  renderLabel: (item: Item) => string;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="bg-surface border-border">
      <div className="flex items-center gap-3 p-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          className="flex-1 text-left flex items-center gap-2 min-w-0"
          onClick={onToggleOpen}
        >
          <span className="font-display truncate">{renderLabel(item) || "Untitled"}</span>
          {!item.is_visible && (
            <span className="eyebrow text-muted-foreground">Hidden</span>
          )}
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleVisible(!item.is_visible)}
            className="p-2 text-muted-foreground hover:text-foreground"
            aria-label={item.is_visible ? "Hide" : "Show"}
            title={item.is_visible ? "Hide" : "Show"}
          >
            {item.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
          <button onClick={onDuplicate} className="p-2 text-muted-foreground hover:text-foreground" title="Duplicate">
            <Copy className="h-4 w-4" />
          </button>
          <button onClick={onDelete} className="p-2 text-muted-foreground hover:text-destructive" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
          <button onClick={onToggleOpen} className="p-2 text-muted-foreground hover:text-foreground">
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border p-5 space-y-4">
          {fields.map((f) => (
            <FieldEditor
              key={f.key}
              def={f}
              value={item[f.key]}
              onChange={(v) => onChange({ [f.key]: v })}
            />
          ))}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <Switch
                checked={item.is_visible}
                onCheckedChange={(v) => onToggleVisible(v)}
              />
              <Label className="text-sm">Visible on site</Label>
            </div>
            <Button onClick={onSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Save className="h-4 w-4 mr-2" /> Save</>)}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

const FieldEditor = ({
  def,
  value,
  onChange,
}: {
  def: FieldDef;
  value: any;
  onChange: (v: any) => void;
}) => {
  if (def.type === "text") {
    return (
      <div className="space-y-2">
        <Label className="eyebrow">{def.label}</Label>
        <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={def.placeholder} className="bg-background" />
      </div>
    );
  }
  if (def.type === "textarea") {
    return (
      <div className="space-y-2">
        <Label className="eyebrow">{def.label}</Label>
        <Textarea rows={3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={def.placeholder} className="bg-background" />
      </div>
    );
  }
  if (def.type === "image" || def.type === "video" || def.type === "media") {
    return (
      <MediaInput
        label={def.label}
        value={value ?? ""}
        onChange={onChange}
        resourceType={def.type === "video" ? "video" : def.type === "image" ? "image" : "auto"}
      />
    );
  }
  if (def.type === "json") {
    const text = typeof value === "string" ? value : JSON.stringify(value ?? [], null, 2);
    return (
      <div className="space-y-2">
        <Label className="eyebrow">{def.label} (JSON)</Label>
        <Textarea
          rows={6}
          defaultValue={text}
          onBlur={(e) => {
            try {
              onChange(JSON.parse(e.target.value || "[]"));
            } catch {
              toast.error(`${def.label}: invalid JSON`);
            }
          }}
          className="bg-background font-mono text-xs"
        />
        <p className="text-xs text-muted-foreground">Edits apply when you click outside the box.</p>
      </div>
    );
  }
  return null;
};
