import { useEffect, useState } from "react";
import { getAdminProposals, updateProposalStatus, bulkUpdateProposalStatus, type ProposalRow } from "../api/client";
import PageHeader from "../components/PageHeader";
import AdminCard from "../components/AdminCard";
import AdminButton from "../components/AdminButton";
import Modal from "../components/Modal";
import { AdminSelect } from "../components/FormField";

const PROPOSAL_STATUSES = ["PENDING", "SHORTLISTED", "REJECTED", "HIRED"];

export default function Applications() {
  const [list, setList] = useState<ProposalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [jobIdFilter, setJobIdFilter] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("");
  const [acting, setActing] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    const jobId = jobIdFilter ? parseInt(jobIdFilter, 10) : undefined;
    getAdminProposals(page, 20, jobId, statusFilter || undefined)
      .then((res) => {
        const d = res.data as { content?: ProposalRow[]; totalElements?: number };
        setList(d?.content ?? []);
        setTotal(d?.totalElements ?? 0);
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), [page, statusFilter, jobIdFilter]);

  const handleSingleStatus = (id: number, status: string) => {
    setActing(true);
    updateProposalStatus(id, status)
      .then(() => load())
      .catch((e) => setError(e.message))
      .finally(() => setActing(false));
  };

  const handleBulkStatus = () => {
    if (!bulkStatus || selectedIds.size === 0) return;
    setActing(true);
    bulkUpdateProposalStatus(Array.from(selectedIds), bulkStatus)
      .then(() => { setBulkStatusOpen(false); setSelectedIds(new Set()); load(); })
      .catch((e) => setError(e.message))
      .finally(() => setActing(false));
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === list.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(list.map((p) => p.id)));
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Applications"
        subtitle="Manage job proposals — filter by status or job, and perform bulk updates."
      />
      <div className="flex gap-4 items-center flex-wrap">
        <AdminSelect label="Status" placeholder="All" className="max-w-[180px]" value={statusFilter || "ALL"} onChange={(e) => { const v = e.target.value; setStatusFilter(v === "ALL" ? "" : v); setPage(0); }}>
          <option value="ALL">All</option>
          {PROPOSAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </AdminSelect>
        <input
          type="number"
          placeholder="Filter by Job ID"
          className="border border-gray-300 rounded-xl px-4 py-2 w-48 text-sm focus:outline-none focus:ring-2 focus:ring-winga-primary/50 focus:border-winga-primary transition-all h-10"
          value={jobIdFilter}
          onChange={(e) => { setJobIdFilter(e.target.value); setPage(0); }}
        />
        {selectedIds.size > 0 && (
          <AdminButton className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold shadow-md h-10 px-5 rounded-xl ml-auto" onPress={() => setBulkStatusOpen(true)}>
            Update {selectedIds.size} Selected
          </AdminButton>
        )}
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}
      <AdminCard title="All applications">
          {loading ? (
            <div className="py-12 text-center text-winga-muted-foreground">Loading…</div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-winga-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-winga-border bg-gray-50/50">
                      <th className="text-left py-4 px-6 w-10">
                        <input type="checkbox" checked={list.length > 0 && selectedIds.size === list.length} onChange={toggleSelectAll} className="w-5 h-5 rounded border-2 border-gray-300 text-winga-primary focus:ring-winga-primary" />
                      </th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Job</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Freelancer</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Bid Amount</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Status</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((p) => (
                      <tr key={p.id} className="border-b border-winga-border/50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          {p.status !== "HIRED" && <input type="checkbox" checked={selectedIds.has(p.id)} onChange={() => toggleSelect(p.id)} className="w-5 h-5 rounded border-2 border-gray-300 text-winga-primary focus:ring-winga-primary" />}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-foreground mr-1">#{p.jobId}</span> {p.jobTitle && <span className="text-winga-muted-foreground truncate max-w-[150px] inline-block align-bottom" title={p.jobTitle}>{p.jobTitle}</span>}
                        </td>
                        <td className="py-4 px-6 font-medium text-foreground">{p.freelancer?.fullName ?? p.freelancer?.email ?? "—"}</td>
                        <td className="py-4 px-6 font-semibold">{p.bidAmount != null ? `TZS ${Number(p.bidAmount).toLocaleString()}` : "—"}</td>
                        <td className="py-4 px-6">
                          <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full w-fit ${p.status === "HIRED" ? "bg-green-100 text-green-700" : p.status === "REJECTED" ? "bg-red-100 text-red-700" : p.status === "SHORTLISTED" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                            {p.status ?? "—"}
                          </span>
                        </td>
                        <td className="py-4 px-6 flex gap-2 flex-wrap">
                          {p.status !== "HIRED" && p.status !== "REJECTED" && (
                            <>
                              <AdminButton size="sm" variant="flat" className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-lg" onPress={() => handleSingleStatus(p.id, "SHORTLISTED")} isLoading={acting}>Shortlist</AdminButton>
                              <AdminButton size="sm" variant="flat" className="text-red-600 hover:bg-red-50 font-semibold rounded-lg" onPress={() => handleSingleStatus(p.id, "REJECTED")} isLoading={acting}>Reject</AdminButton>
                            </>
                          )}
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

      <Modal
        open={bulkStatusOpen}
        onClose={() => setBulkStatusOpen(false)}
        title="Bulk Update Status"
        description={`Update status for ${selectedIds.size} applications.`}
        footer={
          <>
            <AdminButton variant="flat" onPress={() => setBulkStatusOpen(false)} className="font-medium rounded-xl">Cancel</AdminButton>
            <AdminButton className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold rounded-xl shadow-md" onPress={handleBulkStatus} isLoading={acting} disabled={!bulkStatus}>Apply Updates</AdminButton>
          </>
        }
      >
        <AdminSelect label="New Status" value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)} placeholder="Select status">
          {PROPOSAL_STATUSES.filter((s) => s !== "HIRED").map((s) => <option key={s} value={s}>{s}</option>)}
        </AdminSelect>
      </Modal>
    </div>
  );
}
