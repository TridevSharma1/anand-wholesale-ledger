import { useMemo, useState } from "react";
import { Btn, ConfirmDialog, DataTable, Field, IconBtn, Modal, PageHeader, SearchBar, Select, TextArea, useToast } from "./ui";

/**
 * Generic list + add/edit/delete screen backed by a mock array in React state.
 * fields: [{ key, label, type: text|number|date|select|textarea, options, required }]
 */
export function CrudPage({ title, subtitle, noun, items, setItems, columns, fields, idPrefix, filter, readOnly = false, searchKeys }) {
  const { notify } = useToast();
  const [query, setQuery] = useState("");
  const [filterValue, setFilterValue] = useState("All");
  const [editing, setEditing] = useState(null); // {mode, data}
  const [deleting, setDeleting] = useState(null);

  const rows = useMemo(() => items.filter((r) => {
    const text = (searchKeys || fields.map((f) => f.key)).map((k) => r[k]).join(" ").toLowerCase();
    return text.includes(query.toLowerCase()) && (!filter || filterValue === "All" || r[filter.key] === filterValue);
  }), [items, query, filter, filterValue, fields, searchKeys]);

  const blank = () => Object.fromEntries(fields.map((f) => [f.key, f.type === "select" ? f.options[0] : f.type === "number" ? 0 : ""]));

  const save = () => {
    const data = editing.data;
    const missing = fields.find((f) => f.required && !String(data[f.key] ?? "").trim());
    if (missing) return notify(`${missing.label} is required.`, "error");
    const clean = { ...data };
    fields.forEach((f) => { if (f.type === "number") clean[f.key] = Number(clean[f.key]) || 0; });
    if (editing.mode === "add") {
      clean.id = `${idPrefix}-${String(items.length + 1).padStart(3, "0")}-${Date.now().toString().slice(-3)}`;
      setItems((list) => [clean, ...list]);
      notify(`${noun} added successfully.`);
    } else {
      setItems((list) => list.map((r) => (r.id === clean.id ? clean : r)));
      notify(`${noun} updated.`);
    }
    setEditing(null);
  };

  const actionCol = readOnly ? [] : [{ label: "Actions", right: true, render: (r) => (
    <div className="flex justify-end gap-1">
      <IconBtn icon="edit" label={`Edit ${r.name}`} onClick={() => setEditing({ mode: "edit", data: { ...r } })} />
      <IconBtn icon="trash" tone="danger" label={`Delete ${r.name}`} onClick={() => setDeleting(r)} />
    </div>
  ) }];

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} actions={!readOnly && <Btn icon="plus" onClick={() => setEditing({ mode: "add", data: blank() })}>Add {noun.toLowerCase()}</Btn>} />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder={`Search ${title.toLowerCase()}…`} />
        {filter && <Select value={filterValue} onChange={setFilterValue} options={["All", ...filter.options]} className="w-44" />}
        <span className="ml-auto text-xs text-muted-foreground">{rows.length} records</span>
      </div>
      <DataTable columns={[...columns, ...actionCol]} rows={rows} />

      <Modal open={!!editing} wide={fields.length > 6} title={editing?.mode === "add" ? `Add ${noun.toLowerCase()}` : `Edit ${noun.toLowerCase()}`} onClose={() => setEditing(null)}>
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); save(); }}>
            <div className={`grid gap-3 ${fields.length > 6 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              {fields.map((f) => {
                const set = (v) => setEditing((s) => ({ ...s, data: { ...s.data, [f.key]: v } }));
                if (f.type === "select") return <Select key={f.key} label={f.label} value={editing.data[f.key]} onChange={set} options={f.options} />;
                if (f.type === "textarea") return <TextArea key={f.key} className="sm:col-span-full" label={f.label} value={editing.data[f.key]} onChange={set} />;
                return <Field key={f.key} label={f.label + (f.required ? " *" : "")} type={f.type || "text"} value={editing.data[f.key]} onChange={set} />;
              })}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Btn type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Btn>
              <Btn type="submit" icon="check">{editing.mode === "add" ? "Save" : "Update"}</Btn>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title={`Delete ${noun.toLowerCase()}?`}
        message={`“${deleting?.name}” will be removed from this session. This can’t be undone.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => { setItems((list) => list.filter((r) => r.id !== deleting.id)); notify(`${noun} deleted.`); setDeleting(null); }}
      />
    </>
  );
}
