import { useEffect, useState } from "react";
import { getPaymentOptions, createPaymentOption, updatePaymentOption, deletePaymentOption, type PaymentOptionRow } from "../api/client";
import { CreditCard, Pencil, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import AdminCard from "../components/AdminCard";
import AdminButton from "../components/AdminButton";
import Modal from "../components/Modal";
import { AdminInput, AdminCheckbox } from "../components/FormField";

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
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Payment Options"
        subtitle="Manage payment methods (M-Pesa, Bank Transfer, PayPal, etc.)."
        action={
          <AdminButton className="btn-primary-winga" startContent={<CreditCard size={18} />} onPress={() => { setError(""); setCreateOpen(true); }}>
            Add Payment Option
          </AdminButton>
        }
      />
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}
      <AdminCard title="All payment options">
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
                        <AdminButton size="sm" variant="flat" isIconOnly aria-label="Edit" className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg" onPress={() => { setSelected(o); setError(""); setEditOpen(true); }}><Pencil size={15} /></AdminButton>
                        <AdminButton size="sm" variant="flat" className="text-red-600 hover:bg-red-50 rounded-lg" isIconOnly aria-label="Delete" onPress={() => { setSelected(o); setDeleteOpen(true); }}><Trash2 size={15} /></AdminButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </AdminCard>

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
    <Modal
      open={open}
      onClose={onClose}
      title="Add Payment Option"
      description="Create a new available payment method."
      footer={
        <>
          <AdminButton variant="flat" onPress={onClose} className="font-medium rounded-xl">Cancel</AdminButton>
          <AdminButton className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold rounded-xl shadow-md" onPress={handleSubmit} isLoading={acting}>Add Option</AdminButton>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <AdminInput label="Name" value={name} onValueChange={setName} placeholder="e.g. M-Pesa" required />
        <AdminInput label="Slug" value={slug} onValueChange={setSlug} placeholder="e.g. mpesa" required />
        <AdminInput label="Description (optional)" value={description} onValueChange={setDescription} placeholder="Short description" />
        <AdminInput label="Sort order" type="number" value={sortOrder} onValueChange={setSortOrder} />
        <AdminCheckbox label="Active method" checked={isActive} onChange={setIsActive} description="Show this option to users" />
      </div>
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
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Payment Option"
      description="Modify existing payment method details."
      footer={
        <>
          <AdminButton variant="flat" onPress={onClose} className="font-medium rounded-xl">Cancel</AdminButton>
          <AdminButton className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold rounded-xl shadow-md" onPress={handleSubmit} isLoading={acting}>Save Changes</AdminButton>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <AdminInput label="Name" value={name} onValueChange={setName} required />
        <AdminInput label="Slug" value={slug} onValueChange={setSlug} required />
        <AdminInput label="Description" value={description} onValueChange={setDescription} />
        <AdminInput label="Sort order" type="number" value={sortOrder} onValueChange={setSortOrder} />
        <AdminCheckbox label="Active method" checked={isActive} onChange={setIsActive} description="Show this option to users" />
      </div>
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
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Payment Option"
      description="Confirm payment option deletion."
      footer={
        <>
          <AdminButton variant="flat" onPress={onClose} className="font-medium rounded-xl">Cancel</AdminButton>
          <AdminButton variant="danger" onPress={handleConfirm} className="font-bold rounded-xl shadow-md">Confirm Delete</AdminButton>
        </>
      }
    >
      <p className="text-foreground">Are you sure you want to delete <strong>{option.name}</strong>? This action cannot be undone.</p>
    </Modal>
  );
}
