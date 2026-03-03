import { useEffect, useState } from "react";
import {
  getFilterOptions,
  createFilterOption,
  updateFilterOption,
  deleteFilterOption,
  type FilterOptionRow,
  type FilterOptionType,
  FILTER_OPTION_TYPES,
} from "../api/client";
import { Filter, Pencil, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import AdminCard from "../components/AdminCard";
import AdminButton from "../components/AdminButton";
import Modal from "../components/Modal";
import { AdminInput } from "../components/FormField";

const TYPE_LABELS: Record<FilterOptionType, string> = {
  EMPLOYMENT_TYPE: "Employment Type",
  SOCIAL_MEDIA: "Social Media",
  SOFTWARE: "Software",
  LANGUAGE: "Languages",
};

export default function FilterOptionsPage() {
  const [error, setError] = useState("");
  const [byType, setByType] = useState<Record<FilterOptionType, FilterOptionRow[]>>({
    EMPLOYMENT_TYPE: [],
    SOCIAL_MEDIA: [],
    SOFTWARE: [],
    LANGUAGE: [],
  });
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState<FilterOptionType | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState<FilterOptionRow | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<FilterOptionRow | null>(null);
  const [acting, setActing] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all(FILTER_OPTION_TYPES.map((type) => getFilterOptions(type)))
      .then((results) => {
        const next: Record<FilterOptionType, FilterOptionRow[]> = {
          EMPLOYMENT_TYPE: [],
          SOCIAL_MEDIA: [],
          SOFTWARE: [],
          LANGUAGE: [],
        };
        results.forEach((res, i) => {
          next[FILTER_OPTION_TYPES[i]] = (res.data as FilterOptionRow[]) ?? [];
        });
        setByType(next);
      })
      .catch(() => setError("Failed to load filter options"))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Filter Options"
        subtitle="Options for find-jobs dropdowns: Employment Type, Social Media, Software, Languages. Add or edit so they appear on the worker find-jobs page."
      />
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-winga-muted-foreground">Loading…</div>
      ) : (
        FILTER_OPTION_TYPES.map((type) => (
          <AdminCard key={type} title={TYPE_LABELS[type]} subtitle={`Options for "${TYPE_LABELS[type]}" dropdown on find-jobs.`}>
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <AdminButton
                  className="btn-primary-winga"
                  startContent={<Filter size={18} />}
                  onPress={() => {
                    setError("");
                    setAddOpen(type);
                  }}
                >
                  Add option
                </AdminButton>
              </div>
              {byType[type].length === 0 ? (
                <p className="text-winga-muted-foreground py-4">No options yet. Add one so it appears in the find-jobs dropdown.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-winga-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-winga-border bg-gray-50/50">
                        <th className="text-left py-3 px-4 font-bold text-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-bold text-foreground">Slug</th>
                        <th className="text-left py-3 px-4 font-bold text-foreground">Order</th>
                        <th className="text-left py-3 px-4 font-bold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byType[type].map((row) => (
                        <tr key={row.id} className="border-b border-winga-border/50 hover:bg-gray-50/50">
                          <td className="py-3 px-4 font-medium">{row.name}</td>
                          <td className="py-3 px-4 text-winga-muted-foreground">{row.slug}</td>
                          <td className="py-3 px-4">{row.sortOrder ?? 0}</td>
                          <td className="py-3 px-4 flex gap-2">
                            <AdminButton
                              size="sm"
                              variant="flat"
                              isIconOnly
                              aria-label="Edit"
                              className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg"
                              onPress={() => {
                                setEditRow(row);
                                setEditOpen(true);
                              }}
                            >
                              <Pencil size={14} />
                            </AdminButton>
                            <AdminButton
                              size="sm"
                              variant="flat"
                              className="text-red-600 hover:bg-red-50 rounded-lg"
                              isIconOnly
                              aria-label="Delete"
                              onPress={() => setDeleteOpen(row)}
                            >
                              <Trash2 size={14} />
                            </AdminButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </AdminCard>
        ))
      )}

      {addOpen !== null && (
        <AddModal
          type={addOpen}
          onClose={() => setAddOpen(null)}
          onSuccess={() => {
            setAddOpen(null);
            load();
          }}
          setError={setError}
          acting={acting}
          setActing={setActing}
        />
      )}
      {editRow && (
        <EditModal
          row={editRow}
          onClose={() => {
            setEditOpen(false);
            setEditRow(null);
          }}
          onSuccess={() => {
            setEditOpen(false);
            setEditRow(null);
            load();
          }}
          setError={setError}
          acting={acting}
          setActing={setActing}
        />
      )}
      {deleteOpen && (
        <DeleteModal
          row={deleteOpen}
          onClose={() => setDeleteOpen(null)}
          onSuccess={() => {
            setDeleteOpen(null);
            load();
          }}
          setActing={setActing}
        />
      )}
    </div>
  );
}

function AddModal({
  type,
  onClose,
  onSuccess,
  setError,
  acting,
  setActing,
}: {
  type: FilterOptionType;
  onClose: () => void;
  onSuccess: () => void;
  setError: (s: string) => void;
  acting: boolean;
  setActing: (b: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  const handleSubmit = () => {
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    setActing(true);
    setError("");
    createFilterOption({
      type,
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
    })
      .then(() => onSuccess())
      .catch((e) => setError(e.message || "Failed to create"))
      .finally(() => setActing(false));
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`Add ${TYPE_LABELS[type]} option`}
      description="This will appear in the find-jobs dropdown."
      footer={
        <>
          <AdminButton variant="flat" onPress={onClose} className="font-medium rounded-xl">
            Cancel
          </AdminButton>
          <AdminButton className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold rounded-xl" onPress={handleSubmit} isLoading={acting}>
            Add
          </AdminButton>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <AdminInput label="Name" value={name} onValueChange={setName} placeholder="e.g. Full-time" required />
        <AdminInput label="Slug" value={slug} onValueChange={setSlug} placeholder="e.g. full-time" required />
        <AdminInput label="Sort order" type="number" value={sortOrder} onValueChange={setSortOrder} />
      </div>
    </Modal>
  );
}

function EditModal({
  row,
  onClose,
  onSuccess,
  setError,
  acting,
  setActing,
}: {
  row: FilterOptionRow;
  onClose: () => void;
  onSuccess: () => void;
  setError: (s: string) => void;
  acting: boolean;
  setActing: (b: boolean) => void;
}) {
  const type = (row.type ?? "LANGUAGE") as FilterOptionType;
  const [name, setName] = useState(row.name);
  const [slug, setSlug] = useState(row.slug);
  const [sortOrder, setSortOrder] = useState(String(row.sortOrder ?? 0));

  const handleSubmit = () => {
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    setActing(true);
    setError("");
    updateFilterOption(row.id, {
      type,
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
    })
      .then(() => onSuccess())
      .catch((e) => setError(e.message || "Failed to update"))
      .finally(() => setActing(false));
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`Edit ${TYPE_LABELS[type]} option`}
      footer={
        <>
          <AdminButton variant="flat" onPress={onClose} className="font-medium rounded-xl">
            Cancel
          </AdminButton>
          <AdminButton className="bg-winga-primary text-white hover:bg-winga-primary-dark font-bold rounded-xl" onPress={handleSubmit} isLoading={acting}>
            Save
          </AdminButton>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <AdminInput label="Name" value={name} onValueChange={setName} required />
        <AdminInput label="Slug" value={slug} onValueChange={setSlug} required />
        <AdminInput label="Sort order" type="number" value={sortOrder} onValueChange={setSortOrder} />
      </div>
    </Modal>
  );
}

function DeleteModal({
  row,
  onClose,
  onSuccess,
  setActing,
}: {
  row: FilterOptionRow;
  onClose: () => void;
  onSuccess: () => void;
  setActing: (b: boolean) => void;
}) {
  const handleConfirm = () => {
    setActing(true);
    deleteFilterOption(row.id)
      .then(() => onSuccess())
      .finally(() => setActing(false));
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Delete filter option"
      description="This will remove the option from find-jobs dropdowns."
      footer={
        <>
          <AdminButton variant="flat" onPress={onClose} className="font-medium rounded-xl">
            Cancel
          </AdminButton>
          <AdminButton variant="danger" onPress={handleConfirm} className="font-bold rounded-xl">
            Delete
          </AdminButton>
        </>
      }
    >
      <p className="text-foreground">
        Delete <strong>{row.name}</strong>?
      </p>
    </Modal>
  );
}
