import { useEffect, useState } from "react";
import {
  getQualificationTests,
  createQualificationTest,
  updateQualificationTest,
  deleteQualificationTest,
  type QualificationTestRow,
} from "../api/client";
import { ClipboardList, Pencil, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import AdminCard from "../components/AdminCard";
import AdminButton from "../components/AdminButton";
import Modal from "../components/Modal";
import { AdminInput, AdminCheckbox } from "../components/FormField";

const TEST_TYPES = [
  "TYPING",
  "INTERNET_SPEED",
  "VERBAL",
  "ENGLISH_B1",
  "ENGLISH_B2",
  "ENGLISH_C1",
  "OTHER",
] as const;

export default function QualificationTests() {
  const [list, setList] = useState<QualificationTestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<QualificationTestRow | null>(null);
  const [acting, setActing] = useState(false);

  const load = () => {
    setLoading(true);
    getQualificationTests()
      .then((res) => setList((res.data as QualificationTestRow[]) ?? []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Qualification tests"
        subtitle="Tests workers take on My tests. When they pass (score ≥ min), the test is added to their profile."
        action={
          <AdminButton
            className="btn-primary-winga"
            startContent={<ClipboardList size={18} />}
            onPress={() => {
              setError("");
              setCreateOpen(true);
            }}
          >
            Add test
          </AdminButton>
        }
      />
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}
      <AdminCard title="All tests">
        {loading ? (
          <div className="py-12 text-center text-winga-muted-foreground">Loading…</div>
        ) : list.length === 0 ? (
          <div className="py-16 text-center text-winga-muted-foreground flex flex-col items-center">
            <ClipboardList size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-medium">No tests yet.</p>
            <p className="text-sm">Add a test so workers see it on My tests and can complete it.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-winga-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-winga-border bg-gray-50/50">
                  <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Name</th>
                  <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Slug</th>
                  <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Type</th>
                  <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Min / Max</th>
                  <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Max attempts</th>
                  <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Active</th>
                  <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Order</th>
                  <th className="text-left py-4 px-6 text-[13px] font-bold text-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((t) => (
                  <tr key={t.id} className="border-b border-winga-border/50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-foreground">{t.name}</td>
                    <td className="py-4 px-6 text-winga-muted-foreground">{t.slug}</td>
                    <td className="py-4 px-6 font-medium">{t.testType}</td>
                    <td className="py-4 px-6 text-winga-muted-foreground">{t.minScore} – {t.maxScore}</td>
                    <td className="py-4 px-6 font-medium">{t.maxAttempts}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[12px] font-bold px-2 py-0.5 rounded-full w-fit ${t.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {t.isActive ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium">{t.sortOrder}</td>
                    <td className="py-4 px-6 flex gap-2">
                      <AdminButton
                        size="sm"
                        variant="flat"
                        isIconOnly
                        aria-label="Edit"
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg"
                        onPress={() => {
                          setSelected(t);
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
                          setSelected(t);
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

      <CreateTestModal
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
        <EditTestModal
          test={selected}
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
        <DeleteTestModal
          test={selected}
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

function CreateTestModal({
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
  const [testType, setTestType] = useState("TYPING");
  const [minScore, setMinScore] = useState("0");
  const [maxScore, setMaxScore] = useState("100");
  const [maxAttempts, setMaxAttempts] = useState("10");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  const handleSubmit = () => {
    const min = parseInt(minScore, 10);
    const max = parseInt(maxScore, 10);
    const attempts = parseInt(maxAttempts, 10);
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    if (Number.isNaN(min) || Number.isNaN(max) || min < 0 || max < min) {
      setError("Min and max score must be valid (min ≤ max).");
      return;
    }
    if (Number.isNaN(attempts) || attempts < 1) {
      setError("Max attempts must be at least 1.");
      return;
    }
    setActing(true);
    setError("");
    createQualificationTest({
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      testType: testType.trim() || "TYPING",
      minScore: min,
      maxScore: max,
      maxAttempts: attempts,
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
      title="Add qualification test"
      description="Workers will see this on My tests. Passing score = min score or above."
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
            Add test
          </AdminButton>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <AdminInput label="Name" value={name} onValueChange={setName} placeholder="e.g. Typing Test" required />
        <AdminInput label="Slug" value={slug} onValueChange={setSlug} placeholder="e.g. typing" required />
        <div className="flex flex-col gap-0">
          <label className="text-foreground font-medium text-sm mb-2">Type</label>
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            className="border-2 border-gray-200 bg-white rounded-xl min-h-12 px-4 w-full text-foreground focus:outline-none focus:border-winga-primary"
          >
            {TEST_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <AdminInput label="Min score" type="number" value={minScore} onValueChange={setMinScore} required />
        <AdminInput label="Max score" type="number" value={maxScore} onValueChange={setMaxScore} required />
        <AdminInput label="Max attempts" type="number" value={maxAttempts} onValueChange={setMaxAttempts} required />
        <AdminInput label="Sort order" type="number" value={sortOrder} onValueChange={setSortOrder} />
        <AdminCheckbox label="Active" checked={isActive} onChange={setIsActive} description="Show to workers on My tests" />
      </div>
    </Modal>
  );
}

function EditTestModal({
  test,
  open,
  onClose,
  onSuccess,
  setError,
  acting,
  setActing,
}: {
  test: QualificationTestRow;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  setError: (s: string) => void;
  acting: boolean;
  setActing: (b: boolean) => void;
}) {
  const [name, setName] = useState(test.name);
  const [slug, setSlug] = useState(test.slug);
  const [testType, setTestType] = useState(test.testType);
  const [minScore, setMinScore] = useState(String(test.minScore));
  const [maxScore, setMaxScore] = useState(String(test.maxScore));
  const [maxAttempts, setMaxAttempts] = useState(String(test.maxAttempts));
  const [isActive, setIsActive] = useState(test.isActive);
  const [sortOrder, setSortOrder] = useState(String(test.sortOrder ?? 0));

  const handleSubmit = () => {
    const min = parseInt(minScore, 10);
    const max = parseInt(maxScore, 10);
    const attempts = parseInt(maxAttempts, 10);
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    if (Number.isNaN(min) || Number.isNaN(max) || min < 0 || max < min) {
      setError("Min and max score must be valid (min ≤ max).");
      return;
    }
    if (Number.isNaN(attempts) || attempts < 1) {
      setError("Max attempts must be at least 1.");
      return;
    }
    setActing(true);
    setError("");
    updateQualificationTest(test.id, {
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      testType: testType.trim() || "TYPING",
      minScore: min,
      maxScore: max,
      maxAttempts: attempts,
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
      title="Edit qualification test"
      description="Changes apply to workers' My tests list."
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
            Save changes
          </AdminButton>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <AdminInput label="Name" value={name} onValueChange={setName} required />
        <AdminInput label="Slug" value={slug} onValueChange={setSlug} required />
        <div className="flex flex-col gap-0">
          <label className="text-foreground font-medium text-sm mb-2">Type</label>
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            className="border-2 border-gray-200 bg-white rounded-xl min-h-12 px-4 w-full text-foreground focus:outline-none focus:border-winga-primary"
          >
            {TEST_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <AdminInput label="Min score" type="number" value={minScore} onValueChange={setMinScore} required />
        <AdminInput label="Max score" type="number" value={maxScore} onValueChange={setMaxScore} required />
        <AdminInput label="Max attempts" type="number" value={maxAttempts} onValueChange={setMaxAttempts} required />
        <AdminInput label="Sort order" type="number" value={sortOrder} onValueChange={setSortOrder} />
        <AdminCheckbox label="Active" checked={isActive} onChange={setIsActive} description="Show to workers on My tests" />
      </div>
    </Modal>
  );
}

function DeleteTestModal({
  test,
  open,
  onClose,
  onSuccess,
  setActing,
}: {
  test: QualificationTestRow;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  setActing: (b: boolean) => void;
}) {
  const handleConfirm = () => {
    setActing(true);
    deleteQualificationTest(test.id)
      .then(() => onSuccess())
      .finally(() => setActing(false));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete qualification test"
      description="Confirm test deletion."
      footer={
        <>
          <AdminButton variant="flat" onPress={onClose} className="font-medium rounded-xl">
            Cancel
          </AdminButton>
          <AdminButton variant="danger" onPress={handleConfirm} className="font-bold rounded-xl shadow-md">
            Confirm delete
          </AdminButton>
        </>
      }
    >
      <p className="text-foreground">
        Are you sure you want to delete <strong>{test.name}</strong>? Workers will no longer see this test. Existing results are kept.
      </p>
    </Modal>
  );
}
