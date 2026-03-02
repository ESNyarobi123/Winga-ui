import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button, Input } from "@heroui/react";
import { getUsers, createUser, updateUser, deleteUser, type UserRow } from "../api/client";
import { UserPlus, Pencil, UserX } from "lucide-react";
import Modal from "../components/Modal";

const ROLES = ["CLIENT", "FREELANCER", "MODERATOR", "EMPLOYER_ADMIN", "ADMIN", "SUPER_ADMIN"];

export default function Users() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<UserRow | null>(null);
  const [error, setError] = useState("");
  const [acting, setActing] = useState(false);

  const load = () => {
    setLoading(true);
    getUsers(page, 20)
      .then((res) => {
        const d = res.data as { content?: UserRow[]; totalElements?: number };
        setUsers(d?.content ?? []);
        setTotal(d?.totalElements ?? 0);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), [page]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-winga-muted-foreground">Create, edit, and manage employers and job seekers</p>
        </div>
        <Button
          className="btn-primary-winga"
          startContent={<UserPlus size={18} />}
          onPress={() => {
            setError("");
            setCreateOpen(true);
          }}
        >
          Create user
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
      )}
      <Card className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
        <CardHeader className="px-6 pt-6 flex flex-row justify-between items-center">
          <h3 className="font-semibold">All users</h3>
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
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-left py-3 px-4 font-medium">Verified</th>
                      <th className="text-left py-3 px-4 font-medium">Active</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-winga-border">
                        <td className="py-3 px-4">{u.fullName ?? "—"}</td>
                        <td className="py-3 px-4 text-winga-muted-foreground">{u.email ?? "—"}</td>
                        <td className="py-3 px-4 text-winga-muted-foreground">{u.role ?? "—"}</td>
                        <td className="py-3 px-4">{u.isVerified ? "Yes" : "No"}</td>
                        <td className="py-3 px-4">{u.isActive !== false ? "Yes" : "No"}</td>
                        <td className="py-3 px-4 flex gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            isIconOnly
                            aria-label="Edit"
                            onPress={() => {
                              setSelected(u);
                              setError("");
                              setEditOpen(true);
                            }}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            color="danger"
                            isIconOnly
                            aria-label="Deactivate"
                            isDisabled={u.isActive === false}
                            onPress={() => {
                              setSelected(u);
                              setDeleteOpen(true);
                            }}
                          >
                            <UserX size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-winga-muted-foreground">Total: {total}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="flat" isDisabled={page === 0} onPress={() => setPage((p) => p - 1)}>
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    isDisabled={(page + 1) * 20 >= total}
                    onPress={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* Create User Modal - custom overlay so it always shows */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create user"
        footer={
          <>
            <Button variant="flat" onPress={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              className="btn-primary-winga"
              onPress={() => {
                const form = document.getElementById("create-user-form") as HTMLFormElement | null;
                if (form) form.requestSubmit();
              }}
              isLoading={acting}
            >
              Create
            </Button>
          </>
        }
      >
        <CreateUserForm
          onSuccess={() => {
            setCreateOpen(false);
            load();
          }}
          setError={setError}
          setActing={setActing}
        />
      </Modal>

      {selected && (
        <Modal
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setSelected(null);
          }}
          title="Edit user"
          footer={
            <>
              <Button variant="flat" onPress={() => { setEditOpen(false); setSelected(null); }}>
                Cancel
              </Button>
              <Button
                className="btn-primary-winga"
                onPress={() => {
                  const form = document.getElementById("edit-user-form") as HTMLFormElement | null;
                  if (form) form.requestSubmit();
                }}
                isLoading={acting}
              >
                Save
              </Button>
            </>
          }
        >
          <EditUserForm
            user={selected}
            onSuccess={() => {
              setEditOpen(false);
              setSelected(null);
              load();
            }}
            onClose={() => { setEditOpen(false); setSelected(null); }}
            setError={setError}
            setActing={setActing}
            acting={acting}
          />
        </Modal>
      )}

      {selected && (
        <Modal
          open={deleteOpen}
          onClose={() => {
            setDeleteOpen(false);
            setSelected(null);
          }}
          title="Deactivate user"
          footer={
            <>
              <Button variant="flat" onPress={() => { setDeleteOpen(false); setSelected(null); }}>
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  setActing(true);
                  deleteUser(selected.id)
                    .then(() => {
                      setDeleteOpen(false);
                      setSelected(null);
                      load();
                    })
                    .finally(() => setActing(false));
                }}
                isLoading={acting}
              >
                Deactivate
              </Button>
            </>
          }
        >
          <p className="text-winga-muted-foreground">
            Deactivate <strong>{selected.fullName ?? selected.email}</strong>? They will not be able to log in. You
            can reactivate by editing the user and setting Active to Yes.
          </p>
        </Modal>
      )}
    </div>
  );
}

function CreateUserForm({
  onSuccess,
  setError,
  setActing,
}: {
  onSuccess: () => void;
  setError: (s: string) => void;
  setActing: (b: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim() || !password.trim() || !role) {
      setError("Email, full name, password and role are required.");
      return;
    }
    setActing(true);
    setError("");
    createUser({
      email: email.trim(),
      fullName: fullName.trim(),
      password,
      role,
      phoneNumber: phoneNumber.trim() || undefined,
    })
      .then(() => onSuccess())
      .catch((e) => setError(e.message || "Failed to create user"))
      .finally(() => setActing(false));
  };

  return (
    <form id="create-user-form" onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white" style={{ backgroundColor: "#ffffff" }}>
      <Input
        label="Email"
        type="email"
        value={email}
        onValueChange={setEmail}
        placeholder="user@example.com"
        isRequired
        classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }}
      />
      <Input
        label="Full name"
        value={fullName}
        onValueChange={setFullName}
        placeholder="John Doe"
        isRequired
        classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }}
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onValueChange={setPassword}
        placeholder="Min 6 characters"
        isRequired
        classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }}
      />
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground">Role</span>
        <select
          className="border border-winga-border rounded-xl px-3 py-2.5 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-winga-primary focus:border-winga-primary"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select role</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>
      <Input
        label="Phone (optional)"
        value={phoneNumber}
        onValueChange={setPhoneNumber}
        placeholder="+255..."
        classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }}
      />
    </form>
  );
}

function EditUserForm({
  user,
  onSuccess,
  setError,
  setActing,
}: {
  user: UserRow;
  onSuccess: () => void;
  onClose: () => void;
  setError: (s: string) => void;
  setActing: (b: boolean) => void;
  acting: boolean;
}) {
  const [fullName, setFullName] = useState(user.fullName ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user.role ?? "");
  const [isVerified, setIsVerified] = useState(user.isVerified ?? false);
  const [isActive, setIsActive] = useState(user.isActive !== false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !role) {
      setError("Full name, email and role are required.");
      return;
    }
    setActing(true);
    setError("");
    const body: Parameters<typeof updateUser>[1] = { fullName: fullName.trim(), email: email.trim(), role, isVerified, isActive };
    if (password.trim()) body.password = password;
    updateUser(user.id, body)
      .then(() => onSuccess())
      .catch((e) => setError(e.message || "Failed to update user"))
      .finally(() => setActing(false));
  };

  return (
    <form id="edit-user-form" onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white" style={{ backgroundColor: "#ffffff" }}>
      <Input
        label="Full name"
        value={fullName}
        onValueChange={setFullName}
        isRequired
        classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }}
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onValueChange={setEmail}
        isRequired
        classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }}
      />
      <Input
        label="New password (leave blank to keep)"
        type="password"
        value={password}
        onValueChange={setPassword}
        placeholder="Optional"
        classNames={{ inputWrapper: "bg-white border-winga-border", input: "bg-white" }}
      />
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground">Role</span>
        <select
          className="border border-winga-border rounded-xl px-3 py-2.5 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-winga-primary focus:border-winga-primary"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} />
          <span className="text-sm text-foreground">Verified</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          <span className="text-sm text-foreground">Active</span>
        </label>
      </div>
    </form>
  );
}
