import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { getAdminContracts, getAdminContract, terminateContract, type ContractRow } from "../api/client";
import { FileText, XCircle } from "lucide-react";

const CONTRACT_STATUSES = ["ACTIVE", "PAUSED", "REVIEW_PENDING", "DISPUTED", "COMPLETED", "TERMINATED"];

export default function Contracts() {
  const [list, setList] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [selected, setSelected] = useState<ContractRow | null>(null);
  const [detail, setDetail] = useState<ContractRow | null>(null);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getAdminContracts(page, 20, statusFilter || undefined)
      .then((res) => {
        const d = res.data as { content?: ContractRow[]; totalElements?: number };
        setList(d?.content ?? []);
        setTotal(d?.totalElements ?? 0);
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), [page, statusFilter]);

  const openDetail = (c: ContractRow) => {
    setSelected(c);
    setDetail(null);
    setDetailOpen(true);
    getAdminContract(c.id).then((res) => setDetail(res.data as ContractRow)).catch(() => setDetail(c));
  };

  const handleTerminate = () => {
    if (!selected) return;
    setActing(true);
    terminateContract(selected.id)
      .then(() => { setTerminateOpen(false); setSelected(null); setDetailOpen(false); load(); })
      .catch((e) => setError(e.message))
      .finally(() => setActing(false));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Contracts / Hires</h1>
        <p className="text-winga-muted-foreground">View and manage all contracts — end contract (refund to client)</p>
      </div>
      <div className="flex gap-4 items-center flex-wrap">
        <Select
          label="Status"
          placeholder="All"
          className="max-w-[200px]"
          selectedKeys={statusFilter ? [statusFilter] : ["ALL"]}
          onSelectionChange={(s) => { const v = Array.from(s)[0] as string; setStatusFilter(v === "ALL" ? "" : v); setPage(0); }}
        >
          <SelectItem key="ALL">All</SelectItem>
          {CONTRACT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </Select>
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
      <Card className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
        <CardHeader className="px-6 pt-6">
          <h3 className="font-semibold">All contracts</h3>
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
                      <th className="text-left py-3 px-4 font-medium">ID</th>
                      <th className="text-left py-3 px-4 font-medium">Job</th>
                      <th className="text-left py-3 px-4 font-medium">Client</th>
                      <th className="text-left py-3 px-4 font-medium">Freelancer</th>
                      <th className="text-left py-3 px-4 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((c) => (
                      <tr key={c.id} className="border-b border-winga-border">
                        <td className="py-3 px-4 font-medium">{c.id}</td>
                        <td className="py-3 px-4">#{c.jobId} {c.jobTitle && <span className="text-winga-muted-foreground truncate max-w-[100px] inline-block" title={c.jobTitle}>{c.jobTitle}</span>}</td>
                        <td className="py-3 px-4 text-winga-muted-foreground">{c.client?.email ?? c.client?.fullName ?? "—"}</td>
                        <td className="py-3 px-4 text-winga-muted-foreground">{c.freelancer?.email ?? c.freelancer?.fullName ?? "—"}</td>
                        <td className="py-3 px-4">{c.totalAmount != null ? Number(c.totalAmount).toLocaleString() : "—"}</td>
                        <td className="py-3 px-4">{c.status ?? "—"}</td>
                        <td className="py-3 px-4 flex gap-2">
                          <Button size="sm" variant="flat" onPress={() => openDetail(c)}>View</Button>
                          {(c.status === "ACTIVE" || c.status === "REVIEW_PENDING" || c.status === "PAUSED") && (
                            <Button size="sm" variant="flat" color="danger" onPress={() => { setSelected(c); setTerminateOpen(true); }}>End</Button>
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

      <Modal isOpen={detailOpen} onClose={() => { setDetailOpen(false); setSelected(null); setDetail(null); }} size="2xl">
        <ModalContent className="heroui-modal-content" style={{ backgroundColor: "#ffffff" }}>
          <ModalHeader style={{ backgroundColor: "#ffffff" }}>Contract #{selected?.id}</ModalHeader>
          <ModalBody style={{ backgroundColor: "#ffffff" }}>
            {detail && (
              <div className="space-y-3 text-sm">
                <p><strong>Job:</strong> #{detail.jobId} {detail.jobTitle}</p>
                <p><strong>Client:</strong> {detail.client?.fullName ?? detail.client?.email}</p>
                <p><strong>Freelancer:</strong> {detail.freelancer?.fullName ?? detail.freelancer?.email}</p>
                <p><strong>Total:</strong> {detail.totalAmount != null ? Number(detail.totalAmount).toLocaleString() : "—"}</p>
                <p><strong>Escrow:</strong> {detail.escrowAmount != null ? Number(detail.escrowAmount).toLocaleString() : "—"}</p>
                <p><strong>Released:</strong> {detail.releasedAmount != null ? Number(detail.releasedAmount).toLocaleString() : "—"}</p>
                <p><strong>Status:</strong> {detail.status}</p>
                {detail.milestones && detail.milestones.length > 0 && (
                  <div>
                    <strong>Milestones:</strong>
                    <ul className="list-disc pl-5 mt-1">
                      {detail.milestones.map((m) => (
                        <li key={m.id}>{m.title} — {m.amount != null ? Number(m.amount).toLocaleString() : ""} ({m.status})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter style={{ backgroundColor: "#ffffff" }}>
            <Button variant="flat" onPress={() => setDetailOpen(false)}>Close</Button>
            {selected && (selected.status === "ACTIVE" || selected.status === "REVIEW_PENDING" || selected.status === "PAUSED") && (
              <Button color="danger" onPress={() => { setDetailOpen(false); setSelected(selected); setTerminateOpen(true); }}>End contract</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={terminateOpen} onClose={() => { setTerminateOpen(false); setSelected(null); }}>
        <ModalContent className="heroui-modal-content" style={{ backgroundColor: "#ffffff" }}>
          <ModalHeader style={{ backgroundColor: "#ffffff" }}>End contract</ModalHeader>
          <ModalBody style={{ backgroundColor: "#ffffff" }}>
            <p className="text-winga-muted-foreground">End this contract? Remaining escrow will be refunded to the client and the job will reopen.</p>
          </ModalBody>
          <ModalFooter style={{ backgroundColor: "#ffffff" }}>
            <Button variant="flat" onPress={() => { setTerminateOpen(false); setSelected(null); }}>Cancel</Button>
            <Button color="danger" onPress={handleTerminate} isLoading={acting}>End contract</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
