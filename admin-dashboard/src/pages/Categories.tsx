import { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../api/client";
import { Pencil } from "lucide-react";
import PageHeader from "../components/PageHeader";
import AdminCard from "../components/AdminCard";
import AdminButton from "../components/AdminButton";
import Modal from "../components/Modal";
import { AdminInput } from "../components/FormField";

type Category = { id: number; name: string; slug: string; sortOrder: number };

export default function Categories() {
  const [list, setList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editSortOrder, setEditSortOrder] = useState("");
  const [acting, setActing] = useState(false);

  const load = () => {
    setLoading(true);
    getCategories()
      .then((res) => setList((res.data as Category[]) ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleCreate = () => {
    if (!newName.trim() || !newSlug.trim()) return;
    createCategory(newName.trim(), newSlug.trim())
      .then(() => { setNewName(""); setNewSlug(""); load(); })
      .catch((e) => setError(e.message));
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setEditName(c.name);
    setEditSlug(c.slug);
    setEditSortOrder(String(c.sortOrder ?? 0));
    setEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editing || !editName.trim() || !editSlug.trim()) return;
    setActing(true);
    updateCategory(editing.id, editName.trim(), editSlug.trim(), editSortOrder ? parseInt(editSortOrder, 10) : 0)
      .then(() => { setEditOpen(false); setEditing(null); load(); })
      .catch((e) => setError(e.message))
      .finally(() => setActing(false));
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this category?")) return;
    deleteCategory(id).then(() => load()).catch((e) => setError(e.message));
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Job Categories"
        subtitle="Manage and organize job specializations on the platform."
      />
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}
      <AdminCard title="Add new category" subtitle="Name and slug will appear in job posting.">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <AdminInput
            label="Name"
            placeholder="e.g. OnlyFans Chatter"
            value={newName}
            onValueChange={setNewName}
            className="flex-1"
          />
          <AdminInput
            label="Slug"
            placeholder="e.g. onlyfans-chatter"
            value={newSlug}
            onValueChange={setNewSlug}
            className="flex-1"
          />
          <AdminButton className="btn-primary-winga font-semibold h-12 px-6 rounded-xl shrink-0" onPress={handleCreate}>
            Create Category
          </AdminButton>
        </div>
      </AdminCard>

      <AdminCard title="Existing categories">
          {loading ? (
            <div className="py-12 text-center text-winga-muted-foreground">Loading…</div>
          ) : (
            <ul className="divide-y divide-winga-border">
              {list.map((c) => (
                <li key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-gray-50 px-6 -mx-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-[15px] text-foreground">{c.name}</span>
                    <span className="text-winga-muted-foreground text-[13px] bg-gray-100 px-2 py-0.5 rounded-md w-fit mt-1">{c.slug}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Order</span>
                      <span className="text-winga-muted-foreground font-medium">{c.sortOrder}</span>
                    </div>
                    <div className="flex gap-2">
                      <AdminButton size="sm" variant="flat" isIconOnly aria-label="Edit" onPress={() => openEdit(c)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg">
                        <Pencil size={16} />
                      </AdminButton>
                      <AdminButton size="sm" variant="flat" className="text-red-600 hover:bg-red-50 rounded-lg font-medium" onPress={() => handleDelete(c.id)}>Delete</AdminButton>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
      </AdminCard>

      <Modal
        open={editOpen}
        onClose={() => { setEditOpen(false); setEditing(null); }}
        title="Edit Category"
        description="Update category details and sorting order."
        footer={
          <>
            <AdminButton variant="flat" onPress={() => setEditOpen(false)} className="rounded-xl font-medium">Cancel</AdminButton>
            <AdminButton className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold rounded-xl shadow-md" onPress={handleUpdate} isLoading={acting}>Save Changes</AdminButton>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <AdminInput label="Name" value={editName} onValueChange={setEditName} />
          <AdminInput label="Slug" value={editSlug} onValueChange={setEditSlug} />
          <AdminInput label="Sort order" type="number" value={editSortOrder} onValueChange={setEditSortOrder} />
        </div>
      </Modal>
    </div>
  );
}
