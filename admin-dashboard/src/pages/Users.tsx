import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser, type UserRow } from "../api/client";
import { UserPlus, Pencil, UserX } from "lucide-react";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import AdminCard from "../components/AdminCard";
import AdminButton from "../components/AdminButton";
import { AdminInput, AdminSelect, AdminCheckbox } from "../components/FormField";

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
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Users"
        subtitle="Create, edit, and manage employers and job seekers."
        action={
          <AdminButton
            className="btn-primary-winga"
            startContent={<UserPlus size={18} />}
            onPress={() => { setError(""); setCreateOpen(true); }}
          >
            Create user
          </AdminButton>
        }
      />
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}
      <AdminCard title="All users">
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
                          <AdminButton
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
                          </AdminButton>
                          <AdminButton
                            size="sm"
                            variant="flat"
                            className="text-red-600 hover:bg-red-50"
                            isIconOnly
                            aria-label="Deactivate"
                            disabled={u.isActive === false}
                            onPress={() => {
                              setSelected(u);
                              setDeleteOpen(true);
                            }}
                          >
                            <UserX size={14} />
                          </AdminButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-winga-muted-foreground">Total: {total}</p>
                <div className="flex gap-2">
                  <AdminButton size="sm" variant="flat" disabled={page === 0} onPress={() => setPage((p) => p - 1)}>
                    Previous
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    variant="flat"
                    disabled={(page + 1) * 20 >= total}
                    onPress={() => setPage((p) => p + 1)}
                  >
                    Next
                  </AdminButton>
                </div>
              </div>
            </>
          )}
      </AdminCard>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create user"
        description="Add a new user to the platform. Choose role and set credentials."
        footer={
          <>
            <AdminButton variant="flat" onPress={() => setCreateOpen(false)}>Cancel</AdminButton>
            <AdminButton
              className="btn-primary-winga"
              onPress={() => {
                const form = document.getElementById("create-user-form") as HTMLFormElement | null;
                if (form) form.requestSubmit();
              }}
              isLoading={acting}
            >
              Create
            </AdminButton>
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
          description="Update user details and status."
          footer={
            <>
              <AdminButton variant="flat" onPress={() => { setEditOpen(false); setSelected(null); }}>Cancel</AdminButton>
              <AdminButton
                className="btn-primary-winga"
                onPress={() => {
                  const form = document.getElementById("edit-user-form") as HTMLFormElement | null;
                  if (form) form.requestSubmit();
                }}
                isLoading={acting}
              >
                Save
              </AdminButton>
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
          description="The user will not be able to log in. You can reactivate later from Edit user."
          footer={
            <>
              <AdminButton variant="flat" onPress={() => { setDeleteOpen(false); setSelected(null); }}>Cancel</AdminButton>
              <AdminButton
                variant="danger"
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
              </AdminButton>
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
    <form id="create-user-form" onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white">
      <AdminInput label="Email" type="email" value={email} onValueChange={setEmail} placeholder="user@example.com" required />
      <AdminInput label="Full name" value={fullName} onValueChange={setFullName} placeholder="John Doe" required />
      <AdminInput label="Password" type="password" value={password} onValueChange={setPassword} placeholder="Min 6 characters" required />
      <AdminSelect label="Role" value={role} onChange={(e) => setRole(e.target.value)} required placeholder="Select role">
        {ROLES.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </AdminSelect>
      <AdminInput label="Phone (optional)" value={phoneNumber} onValueChange={setPhoneNumber} placeholder="+255..." />
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
    <form id="edit-user-form" onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white">
      <AdminInput label="Full name" value={fullName} onValueChange={setFullName} required />
      <AdminInput label="Email" type="email" value={email} onValueChange={setEmail} required />
      <AdminInput label="New password (leave blank to keep)" type="password" value={password} onValueChange={setPassword} placeholder="Optional" />
      <AdminSelect label="Role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Select role">
        {ROLES.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </AdminSelect>
      <div className="flex flex-wrap gap-6 pt-1">
        <AdminCheckbox label="Verified" checked={isVerified} onChange={setIsVerified} description="User is verified" />
        <AdminCheckbox label="Active" checked={isActive} onChange={setIsActive} description="User can log in" />
      </div>
    </form>
  );
}
