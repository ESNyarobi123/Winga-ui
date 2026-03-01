import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { getPaymentOptions, createPaymentOption, updatePaymentOption, deletePaymentOption, type PaymentOptionRow } from "../api/client";
import { CreditCard, Pencil, Trash2 } from "lucide-react";

export default function PaymentOptions() {
  const [list, setList] = useState<PaymentOptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<PaymentOptionRow | null>(null);
  const [acting, setActing] = useState(false);

  const load = () => {
    setLoading(true);
    getPaymentOptions()
      .then((res) => setList((res.data as PaymentOptionRow[]) ?? []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payment options</h1>
          <p className="text-winga-muted-foreground">Manage payment methods (M-Pesa, Bank Transfer, PayPal, etc.)</p>
        </div>
        <Button className="btn-primary-winga" startContent={<CreditCard size={18} />} onPress={() => { setError(""); setCreateOpen(true); }}>
          Add payment option
        </Button>
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
      <Card className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
        <CardHeader className="px-6 pt-6">
          <h3 className="font-semibold">All payment options</h3>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          {loading ? (
            <div className="py-12 text-center text-winga-muted-foreground">Loading…</div>
          ) : list.length === 0 ? (
            <p className="py-12 text-center text-winga-muted-foreground">No payment options yet. Add one to get started.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-winga-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-winga-border bg-winga-muted">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Slug</th>
                    <th className="text-left py-3 px-4 font-medium">Description</th>
                    <th className="text-left py-3 px-4 font-medium">Active</th>
                    <th className="text-left py-3 px-4 font-medium">Order</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((o) => (
                    <tr key={o.id} className="border-b border-winga-border">
                      <td className="py-3 px-4 font-medium">{o.name}</td>
                      <td className="py-3 px-4 text-winga-muted-foreground">{o.slug}</td>
                      <td className="py-3 px-4 text-winga-muted-foreground max-w-[200px] truncate" title={o.description}>{o.description ?? "—"}</td>
                      <td className="py-3 px-4">{o.isActive ? "Yes" : "No"}</td>
                      <td className="py-3 px-4">{o.sortOrder}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button size="sm" variant="flat" isIconOnly aria-label="Edit" onPress={() => { setSelected(o); setError(""); setEditOpen(true); }}><Pencil size={14} /></Button>
                        <Button size="sm" variant="flat" color="danger" isIconOnly aria-label="Delete" onPress={() => { setSelected(o); setDeleteOpen(true); }}><Trash2 size={14} /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <CreatePaymentOptionModal open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={() => { setCreateOpen(false); load(); }} setError={setError} acting={acting} setActing={setActing} />
      {selected && <EditPaymentOptionModal option={selected} open={editOpen} onClose={() => { setEditOpen(false); setSelected(null); }} onSuccess={() => { setEditOpen(false); setSelected(null); load(); }} setError={setError} acting={acting} setActing={setActing} />}
      {selected && <DeletePaymentOptionModal option={selected} open={deleteOpen} onClose={() => { setDeleteOpen(false); setSelected(null); }} onSuccess={() => { setDeleteOpen(false); setSelected(null); load(); }} setActing={setActing} />}
    </div>
  );
}

function CreatePaymentOptionModal({ open, onClose, onSuccess, setError, acting, setActing }: { open: boolean; onClose: () => void; onSuccess: () => void; setError: (s: string) => void; acting: boolean; setActing: (b: boolean) => void }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  const handleSubmit = () => {
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    setActing(true);
    setError("");
    createPaymentOption({
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      description: description.trim() || undefined,
      isActive,
      sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
    })
      .then(() => onSuccess())
      .catch((e) => setError(e.message || "Failed to create"))
      .finally(() => setActing(false));
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent className="heroui-modal-content" style={{ backgroundColor: "#ffffff" }}>
        <ModalHeader style={{ backgroundColor: "#ffffff" }}>Add payment option</ModalHeader>
        <ModalBody className="gap-4" style={{ backgroundColor: "#ffffff" }}>
          <Input label="Name" value={name} onValueChange={setName} placeholder="e.g. M-Pesa" isRequired classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
          <Input label="Slug" value={slug} onValueChange={setSlug} placeholder="e.g. mpesa" classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
          <Input label="Description (optional)" value={description} onValueChange={setDescription} placeholder="Short description" classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
          <Input label="Sort order" type="number" value={sortOrder} onValueChange={setSortOrder} classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            <span className="text-sm">Active</span>
          </label>
        </ModalBody>
        <ModalFooter style={{ backgroundColor: "#ffffff" }}>
          <Button variant="flat" onPress={onClose}>Cancel</Button>
          <Button className="btn-primary-winga" onPress={handleSubmit} isLoading={acting}>Create</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function EditPaymentOptionModal({ option, open, onClose, onSuccess, setError, acting, setActing }: { option: PaymentOptionRow; open: boolean; onClose: () => void; onSuccess: () => void; setError: (s: string) => void; acting: boolean; setActing: (b: boolean) => void }) {
  const [name, setName] = useState(option.name);
  const [slug, setSlug] = useState(option.slug);
  const [description, setDescription] = useState(option.description ?? "");
  const [isActive, setIsActive] = useState(option.isActive);
  const [sortOrder, setSortOrder] = useState(String(option.sortOrder ?? 0));

  const handleSubmit = () => {
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    setActing(true);
    setError("");
    updatePaymentOption(option.id, {
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      description: description.trim() || undefined,
      isActive,
      sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
    })
      .then(() => onSuccess())
      .catch((e) => setError(e.message || "Failed to update"))
      .finally(() => setActing(false));
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent className="heroui-modal-content" style={{ backgroundColor: "#ffffff" }}>
        <ModalHeader style={{ backgroundColor: "#ffffff" }}>Edit payment option</ModalHeader>
        <ModalBody className="gap-4" style={{ backgroundColor: "#ffffff" }}>
          <Input label="Name" value={name} onValueChange={setName} isRequired classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
          <Input label="Slug" value={slug} onValueChange={setSlug} classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
          <Input label="Description" value={description} onValueChange={setDescription} classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
          <Input label="Sort order" type="number" value={sortOrder} onValueChange={setSortOrder} classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            <span className="text-sm">Active</span>
          </label>
        </ModalBody>
        <ModalFooter style={{ backgroundColor: "#ffffff" }}>
          <Button variant="flat" onPress={onClose}>Cancel</Button>
          <Button className="btn-primary-winga" onPress={handleSubmit} isLoading={acting}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function DeletePaymentOptionModal({ option, open, onClose, onSuccess, setActing }: { option: PaymentOptionRow; open: boolean; onClose: () => void; onSuccess: () => void; setActing: (b: boolean) => void }) {
  const handleConfirm = () => {
    setActing(true);
    deletePaymentOption(option.id)
      .then(() => onSuccess())
      .finally(() => setActing(false));
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent className="heroui-modal-content" style={{ backgroundColor: "#ffffff" }}>
        <ModalHeader style={{ backgroundColor: "#ffffff" }}>Delete payment option</ModalHeader>
        <ModalBody style={{ backgroundColor: "#ffffff" }}>
          <p className="text-winga-muted-foreground">Delete <strong>{option.name}</strong>? This cannot be undone.</p>
        </ModalBody>
        <ModalFooter style={{ backgroundColor: "#ffffff" }}>
          <Button variant="flat" onPress={onClose}>Cancel</Button>
          <Button color="danger" onPress={handleConfirm}>Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
