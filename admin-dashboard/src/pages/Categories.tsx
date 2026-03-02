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
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Job Categories</h1>
        <p className="text-winga-muted-foreground mt-1 text-[15px]">Manage and organize job specializations on the platform.</p>
      </div>
      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100">{error}</div>}
      <Card className="border border-winga-border bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-2 border-b border-winga-border/50 bg-gray-50/50">
          <h3 className="font-bold text-lg text-foreground">Add New Category</h3>
        </CardHeader>
        <CardBody className="px-6 py-6 flex flex-col sm:flex-row gap-4 items-start">
          <Input
            label="Name"
            placeholder="e.g. OnlyFans Chatter"
            value={newName}
            onValueChange={setNewName}
            className="flex-1"
            variant="bordered"
            classNames={{
              inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-winga-primary h-14 rounded-xl",
            }}
          />
          <Input
            label="Slug"
            placeholder="e.g. onlyfans-chatter"
            value={newSlug}
            onValueChange={setNewSlug}
            className="flex-1"
            variant="bordered"
            classNames={{
              inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-winga-primary h-14 rounded-xl",
            }}
          />
          <Button
            className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold h-14 px-8 rounded-xl shadow-md sm:mt-1 hover:-translate-y-0.5 transition-transform"
            onPress={handleCreate}
          >
            Create Category
          </Button>
        </CardBody>
      </Card>

      <Card className="border border-winga-border bg-white shadow-sm rounded-2xl">
        <CardHeader className="px-6 pt-6 pb-2 border-b border-winga-border/50 bg-gray-50/50">
          <h3 className="font-bold text-lg text-foreground">Existing Categories</h3>
        </CardHeader>
        <CardBody className="px-6 pb-6">
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
                      <Button size="sm" variant="flat" isIconOnly aria-label="Edit" onPress={() => openEdit(c)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg">
                        <Pencil size={16} />
                      </Button>
                      <Button size="sm" color="danger" variant="flat" onPress={() => handleDelete(c.id)} className="rounded-lg font-medium">Delete</Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={editOpen} onClose={() => { setEditOpen(false); setEditing(null); }} backdrop="blur">
        <ModalContent className="rounded-2xl shadow-2xl border border-gray-100">
          <ModalHeader className="border-b border-gray-100 bg-gray-50/50">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">Edit Category</h2>
              <p className="text-sm font-normal text-gray-500">Update category details and sorting order.</p>
            </div>
          </ModalHeader>
          <ModalBody className="gap-5 py-6">
            <Input
              label="Name"
              value={editName}
              onValueChange={setEditName}
              variant="bordered"
              classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-winga-primary h-14 rounded-xl" }}
            />
            <Input
              label="Slug"
              value={editSlug}
              onValueChange={setEditSlug}
              variant="bordered"
              classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-winga-primary h-14 rounded-xl" }}
            />
            <Input
              label="Sort order"
              type="number"
              value={editSortOrder}
              onValueChange={setEditSortOrder}
              variant="bordered"
              classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-winga-primary h-14 rounded-xl" }}
            />
          </ModalBody>
          <ModalFooter className="border-t border-gray-100 bg-gray-50/50">
            <Button variant="flat" onPress={() => setEditOpen(false)} className="rounded-xl font-medium">Cancel</Button>
            <Button className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold rounded-xl shadow-md" onPress={handleUpdate} isLoading={acting}>Save Changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
