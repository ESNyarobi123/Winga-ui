import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { getAdminContracts, getAdminContract, terminateContract, type ContractRow } from "../api/client";
// removed unused lucide-react imports

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
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Contracts / Hires</h1>
        <p className="text-winga-muted-foreground mt-1 text-[15px]">View and manage all contracts — end contract (refund to client).</p>
      </div>
      <div className="flex gap-4 items-center flex-wrap">
        <Select
          label="Status"
          placeholder="All"
          className="max-w-[200px]"
          selectedKeys={statusFilter ? [statusFilter] : ["ALL"]}
          onSelectionChange={(s) => { const v = Array.from(s)[0] as string; setStatusFilter(v === "ALL" ? "" : v); setPage(0); }}
        >
          {[
            <SelectItem key="ALL">All</SelectItem>,
            ...CONTRACT_STATUSES.map((s) => <SelectItem key={s}>{s}</SelectItem>)
          ]}
        </Select>
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
      <Card className="border border-winga-border bg-white shadow-sm rounded-2xl overflow-hidden mt-6">
        <CardHeader className="px-6 pt-6 pb-3 border-b border-winga-border/50 bg-gray-50/50">
          <h3 className="font-bold text-lg text-foreground">All Contracts</h3>
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
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">ID</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Job</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Client</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Freelancer</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Amount</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Status</th>
                      <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((c) => (
                      <tr key={c.id} className="border-b border-winga-border/50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-foreground">#{c.id}</td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-foreground mr-1">#{c.jobId}</span> {c.jobTitle && <span className="text-winga-muted-foreground truncate max-w-[150px] inline-block align-bottom" title={c.jobTitle}>{c.jobTitle}</span>}
                        </td>
                        <td className="py-4 px-6 font-medium text-foreground">{c.client?.fullName ?? c.client?.email ?? "—"}</td>
                        <td className="py-4 px-6 font-medium text-foreground">{c.freelancer?.fullName ?? c.freelancer?.email ?? "—"}</td>
                        <td className="py-4 px-6 font-semibold">{c.totalAmount != null ? `TZS ${Number(c.totalAmount).toLocaleString()}` : "—"}</td>
                        <td className="py-4 px-6">
                          <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full w-fit ${c.status === "ACTIVE" ? "bg-green-100 text-green-700" : c.status === "TERMINATED" || c.status === "DISPUTED" ? "bg-red-100 text-red-700" : c.status === "COMPLETED" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>
                            {c.status ?? "—"}
                          </span>
                        </td>
                        <td className="py-4 px-6 flex gap-2">
                          <Button size="sm" variant="flat" className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-lg" onPress={() => openDetail(c)}>View</Button>
                          {(c.status === "ACTIVE" || c.status === "REVIEW_PENDING" || c.status === "PAUSED") && (
                            <Button size="sm" variant="flat" color="danger" className="font-semibold rounded-lg" onPress={() => { setSelected(c); setTerminateOpen(true); }}>End</Button>
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

      <Modal isOpen={detailOpen} onClose={() => { setDetailOpen(false); setSelected(null); setDetail(null); }} size="2xl" backdrop="blur">
        <ModalContent className="rounded-2xl shadow-2xl border border-gray-100">
          <ModalHeader className="border-b border-gray-100 bg-gray-50/50">
            <div className="flex flex-col gap-1 mt-2">
              <h2 className="text-xl font-bold">Contract #{selected?.id}</h2>
              <p className="text-sm font-normal text-gray-500">View contract details and milestones.</p>
            </div>
          </ModalHeader>
          <ModalBody className="py-6">
            {detail ? (
              <div className="space-y-4 text-[15px] p-4 bg-gray-50 rounded-xl border border-gray-100 text-foreground">
                <p><strong>Job:</strong> <span className="font-semibold text-winga-primary">#{detail.jobId}</span> {detail.jobTitle}</p>
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>Client:</strong> {detail.client?.fullName ?? detail.client?.email}</p>
                  <p><strong>Freelancer:</strong> {detail.freelancer?.fullName ?? detail.freelancer?.email}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-4">
                  <p><strong>Total Amount:</strong> <br /><span className="text-lg font-bold text-winga-primary">{detail.totalAmount != null ? `TZS ${Number(detail.totalAmount).toLocaleString()}` : "—"}</span></p>
                  <p><strong>Escrow:</strong> <br /><span className="text-lg font-bold">{detail.escrowAmount != null ? `TZS ${Number(detail.escrowAmount).toLocaleString()}` : "—"}</span></p>
                  <p><strong>Released:</strong> <br /><span className="text-lg font-bold text-green-600">{detail.releasedAmount != null ? `TZS ${Number(detail.releasedAmount).toLocaleString()}` : "—"}</span></p>
                </div>
                <p><strong>Status:</strong> <span className="text-xs font-bold px-2 py-1 rounded-full w-fit bg-gray-200 text-gray-800 ml-2">{detail.status}</span></p>
                {detail.milestones && detail.milestones.length > 0 && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <strong className="text-lg">Milestones:</strong>
                    <ul className="space-y-2 mt-2">
                      {detail.milestones.map((m) => (
                        <li key={m.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                          <span className="font-medium text-gray-800">{m.title}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">{m.amount != null ? `TZS ${Number(m.amount).toLocaleString()}` : ""}</span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 uppercase tracking-wider">{m.status}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500 font-medium animate-pulse">Loading details...</div>
            )}
          </ModalBody>
          <ModalFooter className="border-t border-gray-100 bg-gray-50/50">
            <Button variant="flat" onPress={() => setDetailOpen(false)} className="font-medium rounded-xl">Close</Button>
            {selected && (selected.status === "ACTIVE" || selected.status === "REVIEW_PENDING" || selected.status === "PAUSED") && (
              <Button color="danger" onPress={() => { setDetailOpen(false); setSelected(selected); setTerminateOpen(true); }} className="font-bold rounded-xl shadow-md">End Contract</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={terminateOpen} onClose={() => { setTerminateOpen(false); setSelected(null); }} backdrop="blur">
        <ModalContent className="rounded-2xl shadow-2xl border border-gray-100">
          <ModalHeader className="border-b border-gray-100 bg-gray-50/50">
            <div className="flex flex-col gap-1 mt-2">
              <h2 className="text-xl font-bold">End Contract</h2>
              <p className="text-sm font-normal text-gray-500">Confirm contract termination.</p>
            </div>
          </ModalHeader>
          <ModalBody className="py-6">
            <p className="text-foreground text-[15px]">Are you sure you want to end this contract? Remaining escrow will be refunded to the client and the job will be reopened.</p>
          </ModalBody>
          <ModalFooter className="border-t border-gray-100 bg-gray-50/50">
            <Button variant="flat" onPress={() => { setTerminateOpen(false); setSelected(null); }} className="font-medium rounded-xl">Cancel</Button>
            <Button color="danger" onPress={handleTerminate} isLoading={acting} className="font-bold rounded-xl shadow-md">Confirm End Contract</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
