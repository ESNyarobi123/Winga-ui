import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem } from "@heroui/react";
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
          <h1 className="text-2xl font-bold text-foreground">Jobs</h1>
          <p className="text-winga-muted-foreground">All platform jobs — create, edit, pause, feature, moderate</p>
        </div>
        <Button className="btn-primary-winga" startContent={<Plus size={18} />} onPress={() => { setError(""); setCreateOpen(true); }}>Create job</Button>
      </div>
      <div className="flex gap-4 items-center flex-wrap">
        <Select
          label="Status"
          placeholder="All statuses"
          className="max-w-[180px]"
          selectedKeys={statusFilter ? [statusFilter] : ["ALL"]}
          onSelectionChange={(s) => { const v = Array.from(s)[0] as string; setStatusFilter(v === "ALL" ? "" : v); setPage(0); }}
        >
          <SelectItem key="ALL" value="ALL">All</SelectItem>
          {JOB_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </Select>
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
      <Card className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
        <CardHeader className="px-6 pt-6">
          <h3 className="font-semibold">All jobs</h3>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          {loading ? (
            <div className="py-12 text-center text-winga-muted-foreground">Loading…</div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-winga-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-winga-border bg-winga-muted">
                      <th className="text-left py-3 px-4 font-medium">Title</th>
                      <th className="text-left py-3 px-4 font-medium">Category</th>
                      <th className="text-left py-3 px-4 font-medium">Budget</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Moderation</th>
                      <th className="text-left py-3 px-4 font-medium">Client</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((j) => (
                      <tr key={j.id} className="border-b border-winga-border">
                        <td className="py-3 px-4 font-medium max-w-[200px] truncate" title={j.title}>{j.title ?? "—"}</td>
                        <td className="py-3 px-4 text-winga-muted-foreground">{j.category ?? "—"}</td>
                        <td className="py-3 px-4">{j.budget != null ? Number(j.budget).toLocaleString() : "—"}</td>
                        <td className="py-3 px-4">{j.status ?? "—"}</td>
                        <td className="py-3 px-4">{j.moderationStatus ?? "—"}</td>
                        <td className="py-3 px-4 text-winga-muted-foreground">{j.client?.email ?? j.client?.fullName ?? "—"}</td>
                        <td className="py-3 px-4 flex gap-2">
                          <Button size="sm" variant="flat" isIconOnly aria-label="Edit" onPress={() => { setSelected(j); setError(""); setEditOpen(true); }}><Pencil size={14} /></Button>
                          <Button size="sm" variant="flat" color="danger" isIconOnly aria-label="Delete" onPress={() => { setSelected(j); setDeleteOpen(true); }}><Trash2 size={14} /></Button>
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
    <Modal isOpen={open} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent className="heroui-modal-content" style={{ backgroundColor: "#ffffff" }}>
        <ModalHeader style={{ backgroundColor: "#ffffff" }}>Create job (on behalf of client)</ModalHeader>
        <ModalBody className="gap-4 heroui-modal-content" style={{ backgroundColor: "#ffffff" }}>
          <Select label="Client" placeholder="Select client" selectedKeys={clientId ? [clientId] : []} onSelectionChange={(s) => setClientId(Array.from(s)[0] as string)} isRequired classNames={{ trigger: "bg-white border-winga-border" }}>
            {clients.map((u) => <SelectItem key={String(u.id)} value={String(u.id)}>{u.fullName ?? u.email} ({u.role})</SelectItem>)}
          </Select>
          <Input label="Title" value={title} onValueChange={setTitle} isRequired classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
          <Input label="Description" value={description} onValueChange={setDescription} minLength={30} classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white min-h-[80px]" }} isRequired />
          <Input label="Budget" type="number" value={budget} onValueChange={setBudget} placeholder="e.g. 100000" isRequired classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
          <Input label="Deadline (YYYY-MM-DD)" value={deadline} onValueChange={setDeadline} placeholder="Optional" classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
          <Select label="Category" selectedKeys={category ? [category] : []} onSelectionChange={(s) => setCategory(Array.from(s)[0] as string)} placeholder="Optional" classNames={{ trigger: "bg-white border-winga-border" }}>
            {categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
          </Select>
          <Select label="Experience level" selectedKeys={experienceLevel ? [experienceLevel] : []} onSelectionChange={(s) => setExperienceLevel(Array.from(s)[0] as string)} placeholder="Optional" classNames={{ trigger: "bg-white border-winga-border" }}>
            <SelectItem key="JUNIOR" value="JUNIOR">JUNIOR</SelectItem>
            <SelectItem key="MID" value="MID">MID</SelectItem>
            <SelectItem key="SENIOR" value="SENIOR">SENIOR</SelectItem>
          </Select>
        </ModalBody>
        <ModalFooter style={{ backgroundColor: "#ffffff" }}>
          <Button variant="flat" onPress={onClose}>Cancel</Button>
          <Button className="btn-primary-winga" onPress={handleSubmit} isLoading={acting}>Create</Button>
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
    <Modal isOpen={open} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent className="heroui-modal-content" style={{ backgroundColor: "#ffffff" }}>
        <ModalHeader style={{ backgroundColor: "#ffffff" }}>Edit job</ModalHeader>
        <ModalBody className="gap-4" style={{ backgroundColor: "#ffffff" }}>
          <Input label="Title" value={title} onValueChange={setTitle} isRequired classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
          <Input label="Description" value={description} onValueChange={setDescription} minLength={30} classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white min-h-[100px]" }} />
          <Input label="Budget" type="number" value={budget} onValueChange={setBudget} placeholder="e.g. 100000" classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }} />
          <Select label="Category" selectedKeys={category ? [category] : []} onSelectionChange={(s) => setCategory(Array.from(s)[0] as string)} placeholder="Select or type" classNames={{ trigger: "bg-white border-winga-border" }}>
            {categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
          </Select>
          <Select label="Status" selectedKeys={status ? [status] : []} onSelectionChange={(s) => setStatus(Array.from(s)[0] as string)} classNames={{ trigger: "bg-white border-winga-border" }}>
            {JOB_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </Select>
          <Select label="Moderation" selectedKeys={moderationStatus ? [moderationStatus] : []} onSelectionChange={(s) => setModerationStatus(Array.from(s)[0] as string)} classNames={{ trigger: "bg-white border-winga-border" }}>
            {MODERATION_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </Select>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isBoostedTelegram} onChange={(e) => setIsBoostedTelegram(e.target.checked)} />
              <span className="text-sm">Boosted on Telegram</span>
            </label>
          </div>
        </ModalBody>
        <ModalFooter style={{ backgroundColor: "#ffffff" }}>
          <Button variant="flat" onPress={onClose}>Cancel</Button>
          <Button className="btn-primary-winga" onPress={handleSubmit} isLoading={acting}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function DeleteJobModal({ job, open, onClose, onSuccess, setActing }: { job: JobRow; open: boolean; onClose: () => void; onSuccess: () => void; setActing: (b: boolean) => void }) {
  const handleConfirm = () => {
    setActing(true);
    deleteAdminJob(job.id)
      .then(() => onSuccess())
      .finally(() => setActing(false));
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent className="heroui-modal-content" style={{ backgroundColor: "#ffffff" }}>
        <ModalHeader style={{ backgroundColor: "#ffffff" }}>Delete / cancel job</ModalHeader>
        <ModalBody style={{ backgroundColor: "#ffffff" }}>
          <p className="text-winga-muted-foreground">Remove or cancel job <strong>{job.title}</strong>? If it has applications, it will be cancelled; otherwise it will be deleted.</p>
        </ModalBody>
        <ModalFooter style={{ backgroundColor: "#ffffff" }}>
          <Button variant="flat" onPress={onClose}>Cancel</Button>
          <Button color="danger" onPress={handleConfirm}>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
