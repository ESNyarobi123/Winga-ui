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
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Payment Options</h1>
          <p className="text-winga-muted-foreground mt-1 text-[15px]">Manage payment methods (M-Pesa, Bank Transfer, PayPal, etc.)</p>
        </div>
        <Button
          className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold shadow-md h-11 px-5 rounded-xl transition-transform hover:-translate-y-0.5"
          startContent={<CreditCard size={18} />}
          onPress={() => { setError(""); setCreateOpen(true); }}
        >
          Add Payment Option
        </Button>
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
      <Card className="border border-winga-border bg-white shadow-sm rounded-2xl overflow-hidden mt-6">
        <CardHeader className="px-6 pt-6 pb-3 border-b border-winga-border/50 bg-gray-50/50">
          <h3 className="font-bold text-lg text-foreground">All Payment Options</h3>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          {loading ? (
            <div className="py-12 text-center text-winga-muted-foreground">Loading…</div>
          ) : list.length === 0 ? (
            <div className="py-16 text-center text-winga-muted-foreground flex flex-col items-center">
              <CreditCard size={48} className="text-gray-300 mb-4" />
              <p className="text-lg font-medium">No payment options yet.</p>
              <p className="text-sm">Add one to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-winga-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-winga-border bg-gray-50/50">
                    <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Name</th>
                    <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Slug</th>
                    <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Description</th>
                    <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Active</th>
                    <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Order</th>
                    <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((o) => (
                    <tr key={o.id} className="border-b border-winga-border/50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-foreground">{o.name}</td>
                      <td className="py-4 px-6 text-winga-muted-foreground">{o.slug}</td>
                      <td className="py-4 px-6 text-winga-muted-foreground max-w-[200px] truncate" title={o.description}>{o.description ?? "—"}</td>
                      <td className="py-4 px-6">
                        <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full w-fit ${o.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                          {o.isActive ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium">{o.sortOrder}</td>
                      <td className="py-4 px-6 flex gap-2">
                        <Button size="sm" variant="flat" isIconOnly aria-label="Edit" className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg" onPress={() => { setSelected(o); setError(""); setEditOpen(true); }}><Pencil size={15} /></Button>
                        <Button size="sm" variant="flat" color="danger" isIconOnly aria-label="Delete" className="rounded-lg" onPress={() => { setSelected(o); setDeleteOpen(true); }}><Trash2 size={15} /></Button>
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
    <Modal isOpen={open} onClose={onClose} backdrop="blur">
      <ModalContent className="rounded-2xl shadow-2xl border border-gray-100">
        <ModalHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col gap-1 mt-2">
            <h2 className="text-xl font-bold">Add Payment Option</h2>
            <p className="text-sm font-normal text-gray-500">Create a new available payment method.</p>
          </div>
        </ModalHeader>
        <ModalBody className="gap-5 py-6">
          <Input label="Name" value={name} onValueChange={setName} placeholder="e.g. M-Pesa" isRequired variant="bordered" classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-winga-primary h-14 rounded-xl" }} />
          <Input label="Slug" value={slug} onValueChange={setSlug} placeholder="e.g. mpesa" isRequired variant="bordered" classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-winga-primary h-14 rounded-xl" }} />
          <Input label="Description (optional)" value={description} onValueChange={setDescription} placeholder="Short description" variant="bordered" classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-winga-primary h-14 rounded-xl" }} />
          <Input label="Sort order" type="number" value={sortOrder} onValueChange={setSortOrder} variant="bordered" classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-winga-primary h-14 rounded-xl" }} />
          <label className="flex items-center gap-2 cursor-pointer group mt-2">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-winga-primary focus:ring-winga-primary transition-all" />
            <span className="text-sm font-medium group-hover:text-winga-primary transition-colors">Active Method</span>
          </label>
        </ModalBody>
        <ModalFooter className="border-t border-gray-100 bg-gray-50/50">
          <Button variant="flat" onPress={onClose} className="font-medium rounded-xl">Cancel</Button>
          <Button className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold rounded-xl shadow-md" onPress={handleSubmit} isLoading={acting}>Add Option</Button>
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
    <Modal isOpen={open} onClose={onClose} backdrop="blur">
      <ModalContent className="rounded-2xl shadow-2xl border border-gray-100">
        <ModalHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col gap-1 mt-2">
            <h2 className="text-xl font-bold">Edit Payment Option</h2>
            <p className="text-sm font-normal text-gray-500">Modify existing payment method details.</p>
          </div>
        </ModalHeader>
        <ModalBody className="gap-5 py-6">
          <Input label="Name" value={name} onValueChange={setName} isRequired variant="bordered" classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-winga-primary h-14 rounded-xl" }} />
          <Input label="Slug" value={slug} onValueChange={setSlug} isRequired variant="bordered" classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-winga-primary h-14 rounded-xl" }} />
          <Input label="Description" value={description} onValueChange={setDescription} variant="bordered" classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-winga-primary h-14 rounded-xl" }} />
          <Input label="Sort order" type="number" value={sortOrder} onValueChange={setSortOrder} variant="bordered" classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-winga-primary h-14 rounded-xl" }} />
          <label className="flex items-center gap-2 cursor-pointer group mt-2">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-winga-primary focus:ring-winga-primary transition-all" />
            <span className="text-sm font-medium group-hover:text-winga-primary transition-colors">Active Method</span>
          </label>
        </ModalBody>
        <ModalFooter className="border-t border-gray-100 bg-gray-50/50">
          <Button variant="flat" onPress={onClose} className="font-medium rounded-xl">Cancel</Button>
          <Button className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold rounded-xl shadow-md" onPress={handleSubmit} isLoading={acting}>Save Changes</Button>
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
    <Modal isOpen={open} onClose={onClose} backdrop="blur">
      <ModalContent className="rounded-2xl shadow-2xl border border-gray-100">
        <ModalHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col gap-1 mt-2">
            <h2 className="text-xl font-bold">Delete Payment Option</h2>
            <p className="text-sm font-normal text-gray-500">Confirm payment option deletion.</p>
          </div>
        </ModalHeader>
        <ModalBody className="py-6">
          <p className="text-foreground">Are you sure you want to delete <strong>{option.name}</strong>? This action cannot be undone.</p>
        </ModalBody>
        <ModalFooter className="border-t border-gray-100 bg-gray-50/50">
          <Button variant="flat" onPress={onClose} className="font-medium rounded-xl">Cancel</Button>
          <Button color="danger" onPress={handleConfirm} className="font-bold rounded-xl shadow-md">Confirm Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
