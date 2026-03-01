import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Checkbox } from "@heroui/react";
import { getAdminProposals, updateProposalStatus, bulkUpdateProposalStatus, type ProposalRow } from "../api/client";
import { FileText, CheckCircle, XCircle, UserCheck } from "lucide-react";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Applications</h1>
        <p className="text-winga-muted-foreground">All proposals — filter by job, status, bulk status update</p>
      </div>
      <div className="flex gap-4 items-center flex-wrap">
        <Select
          label="Status"
          placeholder="All"
          className="max-w-[180px]"
          selectedKeys={statusFilter ? [statusFilter] : ["ALL"]}
          onSelectionChange={(s) => { const v = Array.from(s)[0] as string; setStatusFilter(v === "ALL" ? "" : v); setPage(0); }}
        >
          <SelectItem key="ALL">All</SelectItem>
          {PROPOSAL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </Select>
        <input
          type="number"
          placeholder="Job ID (optional)"
          className="border border-winga-border rounded-lg px-3 py-2 w-36 text-sm"
          value={jobIdFilter}
          onChange={(e) => { setJobIdFilter(e.target.value); setPage(0); }}
        />
        {selectedIds.size > 0 && (
          <Button className="btn-primary-winga" onPress={() => setBulkStatusOpen(true)}>
            Update {selectedIds.size} selected
          </Button>
        )}
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
      <Card className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
        <CardHeader className="px-6 pt-6">
          <h3 className="font-semibold">All applications</h3>
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
                      <th className="text-left py-3 px-4 w-10">
                        <Checkbox isSelected={list.length > 0 && selectedIds.size === list.length} onValueChange={toggleSelectAll} />
                      </th>
                      <th className="text-left py-3 px-4 font-medium">Job</th>
                      <th className="text-left py-3 px-4 font-medium">Freelancer</th>
                      <th className="text-left py-3 px-4 font-medium">Bid</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((p) => (
                      <tr key={p.id} className="border-b border-winga-border">
                        <td className="py-3 px-4">
                          {p.status !== "HIRED" && <Checkbox isSelected={selectedIds.has(p.id)} onValueChange={() => toggleSelect(p.id)} />}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">#{p.jobId}</span> {p.jobTitle && <span className="text-winga-muted-foreground truncate max-w-[120px] inline-block" title={p.jobTitle}>{p.jobTitle}</span>}
                        </td>
                        <td className="py-3 px-4 text-winga-muted-foreground">{p.freelancer?.fullName ?? p.freelancer?.email ?? "—"}</td>
                        <td className="py-3 px-4">{p.bidAmount != null ? Number(p.bidAmount).toLocaleString() : "—"}</td>
                        <td className="py-3 px-4">{p.status ?? "—"}</td>
                        <td className="py-3 px-4 flex gap-2 flex-wrap">
                          {p.status !== "HIRED" && p.status !== "REJECTED" && (
                            <>
                              <Button size="sm" variant="flat" className="text-winga-primary" onPress={() => handleSingleStatus(p.id, "SHORTLISTED")} isLoading={acting}>Shortlist</Button>
                              <Button size="sm" variant="flat" color="danger" onPress={() => handleSingleStatus(p.id, "REJECTED")} isLoading={acting}>Reject</Button>
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
                  <Button size="sm" variant="flat" isDisabled={page === 0} onPress={() => setPage((p) => p - 1)}>Previous</Button>
                  <Button size="sm" variant="flat" isDisabled={(page + 1) * 20 >= total} onPress={() => setPage((p) => p + 1)}>Next</Button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={bulkStatusOpen} onClose={() => setBulkStatusOpen(false)}>
        <ModalContent className="heroui-modal-content" style={{ backgroundColor: "#ffffff" }}>
          <ModalHeader style={{ backgroundColor: "#ffffff" }}>Bulk update status</ModalHeader>
          <ModalBody style={{ backgroundColor: "#ffffff" }}>
            <Select label="New status" selectedKeys={bulkStatus ? [bulkStatus] : []} onSelectionChange={(s) => setBulkStatus(Array.from(s)[0] as string)} classNames={{ trigger: "bg-white border-winga-border" }}>
              {PROPOSAL_STATUSES.filter((s) => s !== "HIRED").map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </Select>
          </ModalBody>
          <ModalFooter style={{ backgroundColor: "#ffffff" }}>
            <Button variant="flat" onPress={() => setBulkStatusOpen(false)}>Cancel</Button>
            <Button className="btn-primary-winga" onPress={handleBulkStatus} isLoading={acting} isDisabled={!bulkStatus}>Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
