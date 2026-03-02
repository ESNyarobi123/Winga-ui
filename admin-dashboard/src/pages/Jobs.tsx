import { useEffect, useState } from "react";
import { getAdminJobs, getAdminJob, updateAdminJob, deleteAdminJob, createAdminJob, getCategories, getUsers, type JobRow, type UserRow } from "../api/client";
import { Pencil, Trash2, Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";
import AdminCard from "../components/AdminCard";
import AdminButton from "../components/AdminButton";
import Modal from "../components/Modal";
import { AdminInput, AdminTextarea, AdminSelect } from "../components/FormField";

const JOB_STATUSES = ["OPEN", "PAUSED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const MODERATION_STATUSES = ["PENDING_APPROVAL", "APPROVED", "REJECTED"];

export default function Jobs() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<JobRow | null>(null);
  const [error, setError] = useState("");
  const [acting, setActing] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  const load = () => {
    setLoading(true);
    getAdminJobs(page, 20, statusFilter || undefined)
      .then((res) => {
        const d = res.data as { content?: JobRow[]; totalElements?: number };
        setJobs(d?.content ?? []);
        setTotal(d?.totalElements ?? 0);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), [page, statusFilter]);
  useEffect(() => {
    getCategories().then((res) => setCategories((res.data as { id: number; name: string; slug: string }[]) ?? []));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Jobs"
        subtitle="Manage all platform jobs — create, edit, pause, feature, and moderate."
        action={
          <AdminButton className="btn-primary-winga" startContent={<Plus size={18} />} onPress={() => { setError(""); setCreateOpen(true); }}>
            Post New Job
          </AdminButton>
        }
      />
      <div className="flex gap-4 items-center flex-wrap">
        <AdminSelect
          label="Status"
          placeholder="All statuses"
          className="max-w-[180px]"
          value={statusFilter || "ALL"}
          onChange={(e) => { const v = e.target.value; setStatusFilter(v === "ALL" ? "" : v); setPage(0); }}
        >
          <option value="ALL">All</option>
          {JOB_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </AdminSelect>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}
      <AdminCard title="Job list">
          {loading ? (
            <div className="py-12 text-center text-winga-muted-foreground">Loading…</div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-winga-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-winga-border bg-gray-50/50">
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Title</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Category</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Budget</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Status</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Moderation</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Client</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((j) => (
                      <tr key={j.id} className="border-b border-winga-border/50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-foreground max-w-[200px] truncate" title={j.title}>{j.title ?? "—"}</td>
                        <td className="py-4 px-6 text-winga-muted-foreground">{j.category ?? "—"}</td>
                        <td className="py-4 px-6 font-medium text-foreground">{j.budget != null ? `TZS ${Number(j.budget).toLocaleString()}` : "—"}</td>
                        <td className="py-4 px-6">
                          <span className="text-[12px] font-bold px-2 py-0.5 rounded-full w-fit bg-gray-100 text-gray-700">
                            {j.status ?? "—"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full w-fit ${j.moderationStatus === "APPROVED" ? "bg-green-100 text-green-700" : j.moderationStatus === "REJECTED" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                            {j.moderationStatus ?? "—"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-winga-muted-foreground text-[14px]">{j.client?.email ?? j.client?.fullName ?? "—"}</td>
                        <td className="py-4 px-6 flex gap-2">
                          <AdminButton size="sm" variant="flat" isIconOnly aria-label="Edit" className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg" onPress={() => { setSelected(j); setError(""); setEditOpen(true); }}><Pencil size={15} /></AdminButton>
                          <AdminButton size="sm" variant="flat" className="text-red-600 hover:bg-red-50 rounded-lg" isIconOnly aria-label="Delete" onPress={() => { setSelected(j); setDeleteOpen(true); }}><Trash2 size={15} /></AdminButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-winga-muted-foreground">Total: {total}</p>
                <div className="flex gap-2">
                  <AdminButton size="sm" variant="flat" disabled={page === 0} onPress={() => setPage((p) => p - 1)}>Previous</AdminButton>
                  <AdminButton size="sm" variant="flat" disabled={(page + 1) * 20 >= total} onPress={() => setPage((p) => p + 1)}>Next</AdminButton>
                </div>
              </div>
            </>
          )}
      </AdminCard>

      <CreateJobModal open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={() => { setCreateOpen(false); load(); }} setError={setError} acting={acting} setActing={setActing} categories={categories} />
      {selected && <EditJobModal job={selected} categories={categories} open={editOpen} onClose={() => { setEditOpen(false); setSelected(null); }} onSuccess={() => { setEditOpen(false); setSelected(null); load(); }} setError={setError} acting={acting} setActing={setActing} />}
      {selected && <DeleteJobModal job={selected} open={deleteOpen} onClose={() => { setDeleteOpen(false); setSelected(null); }} onSuccess={() => { setDeleteOpen(false); setSelected(null); load(); }} setActing={setActing} />}
    </div>
  );
}

function CreateJobModal({ open, onClose, onSuccess, setError, acting, setActing, categories }: { open: boolean; onClose: () => void; onSuccess: () => void; setError: (s: string) => void; acting: boolean; setActing: (b: boolean) => void; categories: { id: number; name: string; slug: string }[] }) {
  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [clients, setClients] = useState<UserRow[]>([]);

  useEffect(() => {
    if (open) getUsers(0, 100).then((res) => {
      const d = res.data as { content?: UserRow[] };
      const list = d?.content ?? [];
      setClients(list.filter((u) => u.role === "CLIENT" || u.role === "EMPLOYER_ADMIN" || u.role === "ADMIN"));
    });
  }, [open]);

  const handleSubmit = () => {
    if (!clientId || !title.trim() || !description.trim() || !budget.trim()) {
      setError("Client, title, description and budget are required.");
      return;
    }
    const numBudget = parseFloat(budget);
    if (isNaN(numBudget) || numBudget < 0) {
      setError("Budget must be a positive number.");
      return;
    }
    setActing(true);
    setError("");
    createAdminJob({
      clientId: parseInt(clientId, 10),
      title: title.trim(),
      description: description.trim(),
      budget: numBudget,
      deadline: deadline.trim() || undefined,
      category: category || undefined,
      experienceLevel: experienceLevel || undefined,
    })
      .then(() => onSuccess())
      .catch((e) => setError(e.message || "Failed to create job"))
      .finally(() => setActing(false));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Post New Job"
      description="Create a job on behalf of a client."
      size="lg"
      footer={
        <>
          <AdminButton variant="flat" onPress={onClose} className="font-semibold text-gray-600 rounded-xl px-6">Cancel</AdminButton>
          <AdminButton className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold rounded-xl px-8" onPress={handleSubmit} isLoading={acting}>Post Job</AdminButton>
        </>
      }
    >
      <div className="gap-8 flex flex-col">
        <div className="flex flex-col gap-6">
          <h3 className="text-[13px] font-bold text-winga-primary uppercase tracking-widest pb-2 border-b border-winga-primary/10">Basic Information</h3>
          <AdminSelect label="Client" placeholder="Select a client" value={clientId} onChange={(e) => setClientId(e.target.value)} required>
            {clients.map((u) => (
              <option key={String(u.id)} value={String(u.id)}>{u.fullName ?? u.email} ({u.role})</option>
            ))}
          </AdminSelect>
          <AdminInput label="Title" placeholder="e.g. Senior Frontend Developer Needed" value={title} onValueChange={setTitle} required />
          <AdminTextarea label="Description" placeholder="Provide a detailed description of the job..." value={description} onValueChange={setDescription} minLength={30} required />
        </div>
        <div className="flex flex-col gap-6 mt-2">
          <h3 className="text-[13px] font-bold text-winga-primary uppercase tracking-widest pb-2 border-b border-winga-primary/10">Additional Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            <AdminInput label="Budget (TZS)" type="number" value={budget} onValueChange={setBudget} placeholder="e.g. 100000" required />
            <AdminInput label="Deadline" type="date" value={deadline} onValueChange={setDeadline} />
            <AdminSelect label="Category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Select category">
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </AdminSelect>
            <AdminSelect label="Experience Level" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} placeholder="Select experience">
              <option value="JUNIOR">Junior (1-3 yrs)</option>
              <option value="MID">Mid-Level (3-5 yrs)</option>
              <option value="SENIOR">Senior (5+ yrs)</option>
            </AdminSelect>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function EditJobModal({ job, categories, open, onClose, onSuccess, setError, acting, setActing }: { job: JobRow; categories: { id: number; name: string; slug: string }[]; open: boolean; onClose: () => void; onSuccess: () => void; setError: (s: string) => void; acting: boolean; setActing: (b: boolean) => void }) {
  const [title, setTitle] = useState(job.title ?? "");
  const [description, setDescription] = useState(job.description ?? "");
  const [budget, setBudget] = useState(job.budget != null ? String(job.budget) : "");
  const [category, setCategory] = useState(job.category ?? "");
  const [status, setStatus] = useState(job.status ?? "");
  const [moderationStatus, setModerationStatus] = useState(job.moderationStatus ?? "");
  const [isFeatured, setIsFeatured] = useState(job.isFeatured ?? false);
  const [isBoostedTelegram, setIsBoostedTelegram] = useState(job.isBoostedTelegram ?? false);

  const loadJob = () => {
    getAdminJob(job.id).then((res) => {
      const d = res.data as JobRow;
      if (d) {
        setTitle(d.title ?? "");
        setDescription(d.description ?? "");
        setBudget(d.budget != null ? String(d.budget) : "");
        setCategory(d.category ?? "");
        setStatus(d.status ?? "");
        setModerationStatus(d.moderationStatus ?? "");
        setIsFeatured(d.isFeatured ?? false);
        setIsBoostedTelegram(d.isBoostedTelegram ?? false);
      }
    });
  };

  useEffect(() => {
    if (open) loadJob();
  }, [open, job.id]);

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    const numBudget = budget ? parseFloat(budget) : undefined;
    if (budget && (isNaN(numBudget!) || numBudget! < 0)) {
      setError("Budget must be a positive number.");
      return;
    }
    setActing(true);
    setError("");
    updateAdminJob(job.id, {
      title: title.trim(),
      description: description.trim(),
      budget: numBudget,
      category: category || undefined,
      status: status || undefined,
      moderationStatus: moderationStatus || undefined,
      isFeatured,
      isBoostedTelegram,
    })
      .then(() => onSuccess())
      .catch((e) => setError(e.message || "Failed to update job"))
      .finally(() => setActing(false));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Job"
      description="Update job details and settings."
      size="lg"
      footer={
        <>
          <AdminButton variant="flat" onPress={onClose} className="font-semibold text-gray-600 rounded-xl px-6">Cancel</AdminButton>
          <AdminButton className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold rounded-xl px-8" onPress={handleSubmit} isLoading={acting}>Save Changes</AdminButton>
        </>
      }
    >
      <div className="gap-8 flex flex-col">
        <div className="flex flex-col gap-6">
          <h3 className="text-[13px] font-bold text-winga-primary uppercase tracking-widest pb-2 border-b border-winga-primary/10">Basic Information</h3>
          <AdminInput label="Title" value={title} onValueChange={setTitle} required />
          <AdminTextarea label="Description" value={description} onValueChange={setDescription} minLength={30} />
        </div>
        <div className="flex flex-col gap-6 mt-2">
          <h3 className="text-[13px] font-bold text-winga-primary uppercase tracking-widest pb-2 border-b border-winga-primary/10">Job Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            <AdminInput label="Budget (TZS)" type="number" value={budget} onValueChange={setBudget} placeholder="e.g. 100000" />
            <AdminSelect label="Category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Select category">
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </AdminSelect>
            <AdminSelect label="Status" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Select status">
              {JOB_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </AdminSelect>
            <AdminSelect label="Moderation" value={moderationStatus} onChange={(e) => setModerationStatus(e.target.value)} placeholder="Select moderation">
              {MODERATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </AdminSelect>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-5 border-t border-winga-primary/10">
          <label className="flex items-center gap-3 cursor-pointer group bg-white/60 p-3 rounded-xl border border-gray-100 shadow-sm hover:border-winga-primary/30 transition-all flex-1">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-winga-primary focus:ring-winga-primary transition-all" />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-winga-primary transition-colors">Featured Job</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group bg-white/60 p-3 rounded-xl border border-gray-100 shadow-sm hover:border-winga-primary/30 transition-all flex-1">
            <input type="checkbox" checked={isBoostedTelegram} onChange={(e) => setIsBoostedTelegram(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-winga-primary focus:ring-winga-primary transition-all" />
            <span className="text-sm font-semibold text-gray-700 group-hover:text-winga-primary transition-colors">Boosted on Telegram</span>
          </label>
        </div>
      </div>
    </Modal>
  );
}

function DeleteJobModal({ job, open, onClose, onSuccess, setActing }: { job: JobRow; open: boolean; onClose: () => void; onSuccess: () => void; setActing: (b: boolean) => void }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleConfirm = () => {
    setIsDeleting(true);
    setActing(true);
    deleteAdminJob(job.id)
      .then(() => onSuccess())
      .finally(() => {
        setIsDeleting(false);
        setActing(false);
      });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete / Cancel Job"
      description="Confirm job deletion."
      footer={
        <>
          <AdminButton variant="flat" onPress={onClose} className="font-semibold text-gray-600 rounded-xl px-6">Cancel</AdminButton>
          <AdminButton variant="danger" onPress={handleConfirm} className="font-bold rounded-xl px-6" isLoading={isDeleting}>Confirm Delete</AdminButton>
        </>
      }
    >
      <div className="py-4 text-center">
        <div className="bg-white p-4 rounded-[20px] shadow-sm border border-red-50 mb-3 inline-flex items-center justify-center mx-auto text-red-500 w-16 h-16">
          <Trash2 size={28} />
        </div>
        <p className="text-foreground text-[15px] leading-relaxed">
          Are you sure you want to remove or cancel<br />
          <strong className="text-lg block mt-2">{job.title}</strong>?
        </p>
        <p className="text-[13px] text-gray-500 mt-4 bg-gray-50/80 border border-gray-100 p-3 rounded-xl shadow-sm">If it has pending applications, it will be cancelled; otherwise it will be completely deleted.</p>
      </div>
    </Modal>
  );
}
