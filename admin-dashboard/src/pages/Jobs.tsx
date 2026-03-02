import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button, Input, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem } from "@heroui/react";
import { getAdminJobs, getAdminJob, updateAdminJob, deleteAdminJob, createAdminJob, getCategories, getUsers, type JobRow, type UserRow } from "../api/client";
import { Pencil, Trash2, Plus } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Jobs</h1>
          <p className="text-winga-muted-foreground mt-1 text-[15px]">Manage all platform jobs — create, edit, pause, feature, and moderate.</p>
        </div>
        <Button
          className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold shadow-md h-11 px-5 rounded-xl transition-transform hover:-translate-y-0.5"
          startContent={<Plus size={18} />}
          onPress={() => { setError(""); setCreateOpen(true); }}
        >
          Post New Job
        </Button>
      </div>
      <div className="flex gap-4 items-center flex-wrap">
        <Select
          label="Status"
          placeholder="All statuses"
          className="max-w-[180px]"
          selectedKeys={statusFilter ? [statusFilter] : ["ALL"]}
          onSelectionChange={(s) => { const v = Array.from(s)[0] as string; setStatusFilter(v === "ALL" ? "" : v); setPage(0); }}
        >
          {[
            <SelectItem key="ALL">All</SelectItem>,
            ...JOB_STATUSES.map((s) => <SelectItem key={s}>{s}</SelectItem>)
          ]}
        </Select>
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
      <Card className="border border-winga-border bg-white shadow-sm rounded-2xl overflow-hidden mt-6">
        <CardHeader className="px-6 pt-6 pb-3 border-b border-winga-border/50 bg-gray-50/50">
          <h3 className="font-bold text-lg text-foreground">Job List</h3>
        </CardHeader>
        <CardBody className="px-6 pb-6">
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
                          <Button size="sm" variant="flat" isIconOnly aria-label="Edit" className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg" onPress={() => { setSelected(j); setError(""); setEditOpen(true); }}><Pencil size={15} /></Button>
                          <Button size="sm" variant="flat" color="danger" isIconOnly aria-label="Delete" className="rounded-lg" onPress={() => { setSelected(j); setDeleteOpen(true); }}><Trash2 size={15} /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-winga-muted-foreground">Total: {total}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="flat" isDisabled={page === 0} onPress={() => setPage((p) => p - 1)}>Previous</Button>
                  <Button size="sm" variant="flat" isDisabled={(page + 1) * 20 >= total} onPress={() => setPage((p) => p + 1)}>Next</Button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

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
    <Modal isOpen={open} onClose={onClose} size="2xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent className="rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_60,_0.1)] border border-winga-primary/20 bg-gradient-to-br from-white via-white to-green-50/50">
        <ModalHeader className="border-b border-winga-primary/10 bg-white/40 pb-4 pt-5 px-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-extrabold text-foreground">Post New Job</h2>
            <p className="text-sm font-medium text-winga-muted-foreground">Create a job on behalf of a client.</p>
          </div>
        </ModalHeader>
        <ModalBody className="gap-8 py-8 px-8">
          <div className="flex flex-col gap-6">
            <h3 className="text-[13px] font-bold text-winga-primary uppercase tracking-widest pb-2 border-b border-winga-primary/10">Basic Information</h3>
            <Select size="lg" label="Client" labelPlacement="outside" placeholder="Select a client" selectedKeys={clientId ? [clientId] : []} onSelectionChange={(s) => setClientId(Array.from(s)[0] as string)} isRequired variant="bordered" classNames={{ trigger: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-winga-primary/50 data-[focus=true]:border-winga-primary rounded-xl", label: "font-semibold text-gray-700 text-sm" }}>
              {clients.map((u) => <SelectItem key={String(u.id)}>{u.fullName ?? u.email} ({u.role})</SelectItem>)}
            </Select>
            <Input size="lg" label="Title" labelPlacement="outside" placeholder="e.g. Senior Frontend Developer Needed" value={title} onValueChange={setTitle} isRequired variant="bordered" classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-winga-primary/50 data-[focus=true]:border-winga-primary rounded-xl", label: "font-semibold text-gray-700 text-sm" }} />
            <Textarea size="lg" label="Description" labelPlacement="outside" placeholder="Provide a detailed description of the job..." value={description} onValueChange={setDescription} minLength={30} isRequired variant="bordered" classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-winga-primary/50 data-[focus=true]:border-winga-primary min-h-[140px] rounded-xl py-3", label: "font-semibold text-gray-700 text-sm" }} />
          </div>

          <div className="flex flex-col gap-6 mt-2">
            <h3 className="text-[13px] font-bold text-winga-primary uppercase tracking-widest pb-2 border-b border-winga-primary/10">Additional Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
              <Input size="lg" label="Budget (TZS)" labelPlacement="outside" type="number" value={budget} onValueChange={setBudget} placeholder="e.g. 100000" isRequired variant="bordered" classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-winga-primary/50 data-[focus=true]:border-winga-primary rounded-xl", label: "font-semibold text-gray-700 text-sm" }} />
              <Input size="lg" label="Deadline" labelPlacement="outside" type="date" value={deadline} onValueChange={setDeadline} placeholder="Optional" variant="bordered" classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-winga-primary/50 data-[focus=true]:border-winga-primary rounded-xl", label: "font-semibold text-gray-700 text-sm" }} />
              <Select size="lg" label="Category" labelPlacement="outside" selectedKeys={category ? [category] : []} onSelectionChange={(s) => setCategory(Array.from(s)[0] as string)} placeholder="Select category" variant="bordered" classNames={{ trigger: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-winga-primary/50 data-[focus=true]:border-winga-primary rounded-xl", label: "font-semibold text-gray-700 text-sm" }}>
                {categories.map((c) => <SelectItem key={c.slug}>{c.name}</SelectItem>)}
              </Select>
              <Select size="lg" label="Experience Level" labelPlacement="outside" selectedKeys={experienceLevel ? [experienceLevel] : []} onSelectionChange={(s) => setExperienceLevel(Array.from(s)[0] as string)} placeholder="Select experience" variant="bordered" classNames={{ trigger: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-winga-primary/50 data-[focus=true]:border-winga-primary rounded-xl", label: "font-semibold text-gray-700 text-sm" }}>
                <SelectItem key="JUNIOR">Junior (1-3 yrs)</SelectItem>
                <SelectItem key="MID">Mid-Level (3-5 yrs)</SelectItem>
                <SelectItem key="SENIOR">Senior (5+ yrs)</SelectItem>
              </Select>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-winga-primary/10 bg-white/40 px-8 py-5">
          <Button variant="light" onPress={onClose} className="font-semibold text-gray-600 rounded-xl px-6">Cancel</Button>
          <Button className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold rounded-xl shadow-[0_4px_14px_0_rgba(8,112,60,0.39)] px-8" onPress={handleSubmit} isLoading={acting}>Post Job</Button>
        </ModalFooter>
      </ModalContent>
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
    <Modal isOpen={open} onClose={onClose} size="2xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent className="rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_60,_0.1)] border border-winga-primary/20 bg-gradient-to-br from-white via-white to-green-50/50">
        <ModalHeader className="border-b border-winga-primary/10 bg-white/40 pb-4 pt-5 px-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-extrabold text-foreground">Edit Job</h2>
            <p className="text-sm font-medium text-winga-muted-foreground">Update job details and settings.</p>
          </div>
        </ModalHeader>
        <ModalBody className="gap-8 py-8 px-8">
          <div className="flex flex-col gap-6">
            <h3 className="text-[13px] font-bold text-winga-primary uppercase tracking-widest pb-2 border-b border-winga-primary/10">Basic Information</h3>
            <Input size="lg" label="Title" labelPlacement="outside" value={title} onValueChange={setTitle} isRequired variant="bordered" classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-winga-primary/50 data-[focus=true]:border-winga-primary rounded-xl", label: "font-semibold text-gray-700 text-sm" }} />
            <Textarea size="lg" label="Description" labelPlacement="outside" value={description} onValueChange={setDescription} minLength={30} variant="bordered" classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-winga-primary/50 data-[focus=true]:border-winga-primary min-h-[140px] rounded-xl py-3", label: "font-semibold text-gray-700 text-sm" }} />
          </div>

          <div className="flex flex-col gap-6 mt-2">
            <h3 className="text-[13px] font-bold text-winga-primary uppercase tracking-widest pb-2 border-b border-winga-primary/10">Job Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
              <Input size="lg" label="Budget (TZS)" labelPlacement="outside" type="number" value={budget} onValueChange={setBudget} placeholder="e.g. 100000" variant="bordered" classNames={{ inputWrapper: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-winga-primary/50 data-[focus=true]:border-winga-primary rounded-xl", label: "font-semibold text-gray-700 text-sm" }} />
              <Select size="lg" label="Category" labelPlacement="outside" selectedKeys={category ? [category] : []} onSelectionChange={(s) => setCategory(Array.from(s)[0] as string)} placeholder="Select category" variant="bordered" classNames={{ trigger: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-winga-primary/50 data-[focus=true]:border-winga-primary rounded-xl", label: "font-semibold text-gray-700 text-sm" }}>
                {categories.map((c) => <SelectItem key={c.slug}>{c.name}</SelectItem>)}
              </Select>
              <Select size="lg" label="Status" labelPlacement="outside" selectedKeys={status ? [status] : []} onSelectionChange={(s) => setStatus(Array.from(s)[0] as string)} variant="bordered" classNames={{ trigger: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-winga-primary/50 data-[focus=true]:border-winga-primary rounded-xl", label: "font-semibold text-gray-700 text-sm" }}>
                {JOB_STATUSES.map((s) => <SelectItem key={s}>{s}</SelectItem>)}
              </Select>
              <Select size="lg" label="Moderation" labelPlacement="outside" selectedKeys={moderationStatus ? [moderationStatus] : []} onSelectionChange={(s) => setModerationStatus(Array.from(s)[0] as string)} variant="bordered" classNames={{ trigger: "border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-winga-primary/50 data-[focus=true]:border-winga-primary rounded-xl", label: "font-semibold text-gray-700 text-sm" }}>
                {MODERATION_STATUSES.map((s) => <SelectItem key={s}>{s}</SelectItem>)}
              </Select>
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
        </ModalBody>
        <ModalFooter className="border-t border-winga-primary/10 bg-white/40 px-8 py-5">
          <Button variant="light" onPress={onClose} className="font-semibold text-gray-600 rounded-xl px-6">Cancel</Button>
          <Button className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold rounded-xl shadow-[0_4px_14px_0_rgba(8,112,60,0.39)] px-8" onPress={handleSubmit} isLoading={acting}>Save Changes</Button>
        </ModalFooter>
      </ModalContent>
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
    <Modal isOpen={open} onClose={onClose} backdrop="blur">
      <ModalContent className="rounded-3xl shadow-[0_20px_50px_rgba(220,_38,_38,_0.1)] border border-red-100 bg-gradient-to-br from-white to-red-50/50">
        <ModalHeader className="border-b border-red-100 bg-white/40 pb-4 pt-5 px-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-extrabold text-red-600">Delete / Cancel Job</h2>
            <p className="text-sm font-medium text-gray-500">Confirm job deletion.</p>
          </div>
        </ModalHeader>
        <ModalBody className="py-8 px-6 text-center">
          <div className="bg-white p-4 rounded-[20px] shadow-sm border border-red-50 mb-3 inline-flex items-center justify-center mx-auto text-red-500 w-16 h-16">
            <Trash2 size={28} />
          </div>
          <p className="text-foreground text-[15px] leading-relaxed">
            Are you sure you want to remove or cancel<br />
            <strong className="text-lg block mt-2">{job.title}</strong>?
          </p>
          <p className="text-[13px] text-gray-500 mt-4 bg-gray-50/80 border border-gray-100 p-3 rounded-xl shadow-sm">If it has pending applications, it will be cancelled; otherwise it will be completely deleted.</p>
        </ModalBody>
        <ModalFooter className="border-t border-red-100 bg-white/40 px-6 py-5">
          <Button variant="light" onPress={onClose} className="font-semibold text-gray-600 rounded-xl px-6">Cancel</Button>
          <Button color="danger" onPress={handleConfirm} className="font-bold rounded-xl shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] px-6" isLoading={isDeleting}>Confirm Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
