import { useEffect, useState } from "react";
import {
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  type SubscriptionPlanRow,
} from "../api/client";
import { Package, Pencil, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import AdminCard from "../components/AdminCard";
import AdminButton from "../components/AdminButton";
import Modal from "../components/Modal";
import { AdminInput, AdminCheckbox } from "../components/FormField";

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-TZ", { style: "currency", currency: currency || "TZS" }).format(price);
}

export default function SubscriptionPlans() {
  const [list, setList] = useState<SubscriptionPlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<SubscriptionPlanRow | null>(null);
  const [acting, setActing] = useState(false);

  const load = () => {
    setLoading(true);
    getSubscriptionPlans()
      .then((res) => setList((res.data as SubscriptionPlanRow[]) ?? []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Subscription Plans"
        subtitle="Manage freelancer subscription packages (price, duration, features)."
        action={
          <AdminButton
            className="btn-primary-winga"
            startContent={<Package size={18} />}
            onPress={() => {
              setError("");
              setCreateOpen(true);
            }}
          >
            Add Plan
          </AdminButton>
        }
      />
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}
      <AdminCard title="All subscription plans">
        {loading ? (
          <div className="py-12 text-center text-winga-muted-foreground">Loading…</div>
        ) : list.length === 0 ? (
          <div className="py-16 text-center text-winga-muted-foreground flex flex-col items-center">
            <Package size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-medium">No subscription plans yet.</p>
            <p className="text-sm">Add a plan to show freelancers on the pricing page.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-winga-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-winga-border bg-gray-50/50">
                  <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Name</th>
                  <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Slug</th>
                  <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Price</th>
                  <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Duration</th>
                  <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Active</th>
                  <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Order</th>
                  <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id} className="border-b border-winga-border/50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-foreground">{p.name}</td>
                    <td className="py-4 px-6 text-winga-muted-foreground">{p.slug}</td>
                    <td className="py-4 px-6 font-medium">{formatPrice(p.price, p.currency)}</td>
                    <td className="py-4 px-6 text-winga-muted-foreground">{p.durationDays} days</td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[12px] font-bold px-2 py-0.5 rounded-full w-fit ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {p.isActive ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium">{p.sortOrder}</td>
                    <td className="py-4 px-6 flex gap-2">
                      <AdminButton
                        size="sm"
                        variant="flat"
                        isIconOnly
                        aria-label="Edit"
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg"
                        onPress={() => {
                          setSelected(p);
                          setError("");
                          setEditOpen(true);
                        }}
                      >
                        <Pencil size={15} />
                      </AdminButton>
                      <AdminButton
                        size="sm"
                        variant="flat"
                        className="text-red-600 hover:bg-red-50 rounded-lg"
                        isIconOnly
                        aria-label="Delete"
                        onPress={() => {
                          setSelected(p);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 size={15} />
                      </AdminButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      <CreatePlanModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false);
          load();
        }}
        setError={setError}
        acting={acting}
        setActing={setActing}
      />
      {selected && (
        <EditPlanModal
          plan={selected}
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setSelected(null);
          }}
          onSuccess={() => {
            setEditOpen(false);
            setSelected(null);
            load();
          }}
          setError={setError}
          acting={acting}
          setActing={setActing}
        />
      )}
      {selected && (
        <DeletePlanModal
          plan={selected}
          open={deleteOpen}
          onClose={() => {
            setDeleteOpen(false);
            setSelected(null);
          }}
          onSuccess={() => {
            setDeleteOpen(false);
            setSelected(null);
            load();
          }}
          setActing={setActing}
        />
      )}
    </div>
  );
}

function CreatePlanModal({
  open,
  onClose,
  onSuccess,
  setError,
  acting,
  setActing,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  setError: (s: string) => void;
  acting: boolean;
  setActing: (b: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("TZS");
  const [durationDays, setDurationDays] = useState("30");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  const handleSubmit = () => {
    const p = parseFloat(price);
    const d = parseInt(durationDays, 10);
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    if (isNaN(p) || p < 0) {
      setError("Price must be a non-negative number.");
      return;
    }
    if (isNaN(d) || d < 1) {
      setError("Duration must be at least 1 day.");
      return;
    }
    setActing(true);
    setError("");
    createSubscriptionPlan({
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, "_"),
      description: description.trim() || undefined,
      price: p,
      currency: currency.trim() || "TZS",
      durationDays: d,
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
      title="Add Subscription Plan"
      description="Create a new plan for freelancers."
      footer={
        <>
          <AdminButton variant="flat" onPress={onClose} className="font-medium rounded-xl">
            Cancel
          </AdminButton>
          <AdminButton
            className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold rounded-xl shadow-md"
            onPress={handleSubmit}
            isLoading={acting}
          >
            Add Plan
          </AdminButton>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <AdminInput label="Name" value={name} onValueChange={setName} placeholder="e.g. Monthly Provider" required />
        <AdminInput label="Slug" value={slug} onValueChange={setSlug} placeholder="e.g. monthly_provider" required />
        <AdminInput label="Description (optional)" value={description} onValueChange={setDescription} placeholder="Short description" />
        <AdminInput label="Price" type="number" min="0" step="0.01" value={price} onValueChange={setPrice} placeholder="e.g. 10000" required />
        <AdminInput label="Currency" value={currency} onValueChange={setCurrency} placeholder="TZS" />
        <AdminInput label="Duration (days)" type="number" min="1" value={durationDays} onValueChange={setDurationDays} required />
        <AdminInput label="Sort order" type="number" value={sortOrder} onValueChange={setSortOrder} />
        <AdminCheckbox label="Active" checked={isActive} onChange={setIsActive} description="Show this plan to freelancers" />
      </div>
    </Modal>
  );
}

function EditPlanModal({
  plan,
  open,
  onClose,
  onSuccess,
  setError,
  acting,
  setActing,
}: {
  plan: SubscriptionPlanRow;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  setError: (s: string) => void;
  acting: boolean;
  setActing: (b: boolean) => void;
}) {
  const [name, setName] = useState(plan.name);
  const [slug, setSlug] = useState(plan.slug);
  const [description, setDescription] = useState(plan.description ?? "");
  const [price, setPrice] = useState(String(plan.price));
  const [currency, setCurrency] = useState(plan.currency ?? "TZS");
  const [durationDays, setDurationDays] = useState(String(plan.durationDays));
  const [isActive, setIsActive] = useState(plan.isActive);
  const [sortOrder, setSortOrder] = useState(String(plan.sortOrder ?? 0));

  const handleSubmit = () => {
    const p = parseFloat(price);
    const d = parseInt(durationDays, 10);
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    if (isNaN(p) || p < 0) {
      setError("Price must be a non-negative number.");
      return;
    }
    if (isNaN(d) || d < 1) {
      setError("Duration must be at least 1 day.");
      return;
    }
    setActing(true);
    setError("");
    updateSubscriptionPlan(plan.id, {
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, "_"),
      description: description.trim() || undefined,
      price: p,
      currency: currency.trim() || "TZS",
      durationDays: d,
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
      title="Edit Subscription Plan"
      description="Modify plan details."
      footer={
        <>
          <AdminButton variant="flat" onPress={onClose} className="font-medium rounded-xl">
            Cancel
          </AdminButton>
          <AdminButton
            className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold rounded-xl shadow-md"
            onPress={handleSubmit}
            isLoading={acting}
          >
            Save Changes
          </AdminButton>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <AdminInput label="Name" value={name} onValueChange={setName} required />
        <AdminInput label="Slug" value={slug} onValueChange={setSlug} required />
        <AdminInput label="Description" value={description} onValueChange={setDescription} />
        <AdminInput label="Price" type="number" min="0" step="0.01" value={price} onValueChange={setPrice} required />
        <AdminInput label="Currency" value={currency} onValueChange={setCurrency} />
        <AdminInput label="Duration (days)" type="number" min="1" value={durationDays} onValueChange={setDurationDays} required />
        <AdminInput label="Sort order" type="number" value={sortOrder} onValueChange={setSortOrder} />
        <AdminCheckbox label="Active" checked={isActive} onChange={setIsActive} description="Show this plan to freelancers" />
      </div>
    </Modal>
  );
}

function DeletePlanModal({
  plan,
  open,
  onClose,
  onSuccess,
  setActing,
}: {
  plan: SubscriptionPlanRow;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  setActing: (b: boolean) => void;
}) {
  const handleConfirm = () => {
    setActing(true);
    deleteSubscriptionPlan(plan.id)
      .then(() => onSuccess())
      .finally(() => setActing(false));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Subscription Plan"
      description="Confirm plan deletion."
      footer={
        <>
          <AdminButton variant="flat" onPress={onClose} className="font-medium rounded-xl">
            Cancel
          </AdminButton>
          <AdminButton variant="danger" onPress={handleConfirm} className="font-bold rounded-xl shadow-md">
            Confirm Delete
          </AdminButton>
        </>
      }
    >
      <p className="text-foreground">
        Are you sure you want to delete <strong>{plan.name}</strong>? This action cannot be undone.
      </p>
    </Modal>
  );
}
