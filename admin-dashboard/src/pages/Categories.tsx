import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../api/client";
import { Pencil } from "lucide-react";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Job categories</h1>
        <p className="text-winga-muted-foreground">OFM-style: Chatter, VA, Editor, Telegram Closer, etc.</p>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Card className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
        <CardHeader className="px-6 pt-6">
          <h3 className="font-semibold">Add category</h3>
        </CardHeader>
        <CardBody className="px-6 pb-6 flex flex-col sm:flex-row gap-4">
          <Input label="Name" placeholder="OnlyFans Chatter" value={newName} onValueChange={setNewName} className="flex-1" />
          <Input label="Slug" placeholder="onlyfans-chatter" value={newSlug} onValueChange={setNewSlug} className="flex-1" />
          <Button className="btn-primary-winga self-end" onPress={handleCreate}>Add</Button>
        </CardBody>
      </Card>
      <Card className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
        <CardHeader className="px-6 pt-6">
          <h3 className="font-semibold">Categories</h3>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          {loading ? (
            <div className="py-12 text-center text-winga-muted-foreground">Loading…</div>
          ) : (
            <ul className="divide-y divide-winga-border">
              {list.map((c) => (
                <li key={c.id} className="py-3 flex items-center justify-between first:pt-0 gap-4">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-winga-muted-foreground text-sm">{c.slug}</span>
                  <span className="text-winga-muted-foreground text-xs">Order: {c.sortOrder}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="flat" isIconOnly aria-label="Edit" onPress={() => openEdit(c)}><Pencil size={14} /></Button>
                    <Button size="sm" color="danger" variant="flat" onPress={() => handleDelete(c.id)}>Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={editOpen} onClose={() => { setEditOpen(false); setEditing(null); }}>
        <ModalContent className="heroui-modal-content" style={{ backgroundColor: "#ffffff" }}>
          <ModalHeader style={{ backgroundColor: "#ffffff" }}>Edit category</ModalHeader>
          <ModalBody className="gap-4" style={{ backgroundColor: "#ffffff" }}>
            <Input label="Name" value={editName} onValueChange={setEditName} classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
            <Input label="Slug" value={editSlug} onValueChange={setEditSlug} classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
            <Input label="Sort order" type="number" value={editSortOrder} onValueChange={setEditSortOrder} classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
          </ModalBody>
          <ModalFooter style={{ backgroundColor: "#ffffff" }}>
            <Button variant="flat" onPress={() => setEditOpen(false)}>Cancel</Button>
            <Button className="btn-primary-winga" onPress={handleUpdate} isLoading={acting}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
