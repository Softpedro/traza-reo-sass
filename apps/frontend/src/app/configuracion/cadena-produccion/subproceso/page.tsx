"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getColumns, type SubprocessRow } from "./columns";
import { SubprocesoModal } from "./subproceso-modal";
import { ProcedureSubprocessModal, type ProcedureSubprocessRow } from "./procedure-subprocess-modal";
import { ProcedureSubprocessListDialog } from "./procedure-subprocess-list-dialog";
import { InputSubprocessModal, type InputSubprocessRow } from "./input-subprocess-modal";
import { InputSubprocessListDialog } from "./input-subprocess-list-dialog";
import { OutputSubprocessModal, type OutputSubprocessRow } from "./output-subprocess-modal";
import { OutputSubprocessListDialog } from "./output-subprocess-list-dialog";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  subprocess: SubprocessRow | null;
};

type ProcedureListState = { open: boolean; subprocess: SubprocessRow | null; mode: "edit" | "view" };
type ProcedureModalState = { open: boolean; mode: "create" | "edit" | "view"; subprocess: SubprocessRow | null; procedure: ProcedureSubprocessRow | null };
type InputListState = { open: boolean; subprocess: SubprocessRow | null; mode: "edit" | "view" };
type InputModalState = { open: boolean; mode: "create" | "edit" | "view"; subprocess: SubprocessRow | null; input: InputSubprocessRow | null };
type OutputListState = { open: boolean; subprocess: SubprocessRow | null; mode: "edit" | "view" };
type OutputModalState = { open: boolean; mode: "create" | "edit" | "view"; subprocess: SubprocessRow | null; output: OutputSubprocessRow | null };

export default function SubprocesoPage() {
  const [items, setItems] = useState<SubprocessRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [generalDiagramOpen, setGeneralDiagramOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({ open: false, mode: "create", subprocess: null });
  const [procedureListOpen, setProcedureListOpen] = useState<ProcedureListState>({ open: false, subprocess: null, mode: "edit" });
  const [procedureModal, setProcedureModal] = useState<ProcedureModalState>({ open: false, mode: "create", subprocess: null, procedure: null });
  const [inputListOpen, setInputListOpen] = useState<InputListState>({ open: false, subprocess: null, mode: "edit" });
  const [inputModal, setInputModal] = useState<InputModalState>({ open: false, mode: "create", subprocess: null, input: null });
  const [outputListOpen, setOutputListOpen] = useState<OutputListState>({ open: false, subprocess: null, mode: "edit" });
  const [outputModal, setOutputModal] = useState<OutputModalState>({ open: false, mode: "create", subprocess: null, output: null });

  const fetchItems = useCallback(() => {
    setLoading(true);
    fetch(apiUrl("/api/subprocesses"))
      .then((res) => res.json())
      .then((data: SubprocessRow[]) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar subprocesos:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const s = search.trim().toLowerCase();
    return items.filter(
      (row) =>
        row.nameSubprocess.toLowerCase().includes(s) ||
        row.codSubprocess?.toLowerCase().includes(s) ||
        row.descriptionSubprocess?.toLowerCase().includes(s) ||
        row.process.nameProcess.toLowerCase().includes(s) ||
        row.process.productionChain.nameProductionChain.toLowerCase().includes(s)
    );
  }, [items, search]);

  const openCreate = () => setModal({ open: true, mode: "create", subprocess: null });
  const openEdit = useCallback((row: SubprocessRow) => setModal({ open: true, mode: "edit", subprocess: row }), []);
  const openVerDiagrama = useCallback((_row: SubprocessRow) => {}, []);

  const openProcedureCreate = useCallback((row: SubprocessRow) => {
    setProcedureListOpen((prev) => ({ ...prev, open: false }));
    setProcedureModal({ open: true, mode: "create", subprocess: row, procedure: null });
  }, []);
  const openProcedureEdit = useCallback((row: SubprocessRow) => {
    setProcedureModal((prev) => ({ ...prev, open: false }));
    setProcedureListOpen({ open: true, subprocess: row, mode: "edit" });
  }, []);
  const openProcedureView = useCallback((row: SubprocessRow) => {
    setProcedureModal((prev) => ({ ...prev, open: false }));
    setProcedureListOpen({ open: true, subprocess: row, mode: "view" });
  }, []);
  const openProcedureFromListCrear = useCallback(() => {
    const sub = procedureListOpen.subprocess;
    if (!sub) return;
    setProcedureListOpen((prev) => ({ ...prev, open: false }));
    setProcedureModal({ open: true, mode: "create", subprocess: sub, procedure: null });
  }, [procedureListOpen.subprocess]);
  const openProcedureFromListSelect = useCallback((procedure: ProcedureSubprocessRow) => {
    const sub = procedureListOpen.subprocess;
    if (!sub) return;
    setProcedureModal({ open: true, mode: procedureListOpen.mode as "edit" | "view", subprocess: sub, procedure });
  }, [procedureListOpen.subprocess, procedureListOpen.mode]);

  const openInputCreate = useCallback((row: SubprocessRow) => {
    setInputListOpen((prev) => ({ ...prev, open: false }));
    setInputModal({ open: true, mode: "create", subprocess: row, input: null });
  }, []);
  const openInputEdit = useCallback((row: SubprocessRow) => {
    setInputModal((prev) => ({ ...prev, open: false }));
    setInputListOpen({ open: true, subprocess: row, mode: "edit" });
  }, []);
  const openInputView = useCallback((row: SubprocessRow) => {
    setInputModal((prev) => ({ ...prev, open: false }));
    setInputListOpen({ open: true, subprocess: row, mode: "view" });
  }, []);
  const openInputFromListCrear = useCallback(() => {
    const sub = inputListOpen.subprocess;
    if (!sub) return;
    setInputListOpen((prev) => ({ ...prev, open: false }));
    setInputModal({ open: true, mode: "create", subprocess: sub, input: null });
  }, [inputListOpen.subprocess]);
  const openInputFromListSelect = useCallback((input: InputSubprocessRow) => {
    const sub = inputListOpen.subprocess;
    if (!sub) return;
    setInputModal({ open: true, mode: inputListOpen.mode as "edit" | "view", subprocess: sub, input });
  }, [inputListOpen.subprocess, inputListOpen.mode]);

  const openOutputCreate = useCallback((row: SubprocessRow) => {
    setOutputListOpen((prev) => ({ ...prev, open: false }));
    setOutputModal({ open: true, mode: "create", subprocess: row, output: null });
  }, []);
  const openOutputEdit = useCallback((row: SubprocessRow) => {
    setOutputModal((prev) => ({ ...prev, open: false }));
    setOutputListOpen({ open: true, subprocess: row, mode: "edit" });
  }, []);
  const openOutputView = useCallback((row: SubprocessRow) => {
    setOutputModal((prev) => ({ ...prev, open: false }));
    setOutputListOpen({ open: true, subprocess: row, mode: "view" });
  }, []);
  const openOutputFromListCrear = useCallback(() => {
    const sub = outputListOpen.subprocess;
    if (!sub) return;
    setOutputListOpen((prev) => ({ ...prev, open: false }));
    setOutputModal({ open: true, mode: "create", subprocess: sub, output: null });
  }, [outputListOpen.subprocess]);
  const openOutputFromListSelect = useCallback((output: OutputSubprocessRow) => {
    const sub = outputListOpen.subprocess;
    if (!sub) return;
    setOutputModal({ open: true, mode: outputListOpen.mode as "edit" | "view", subprocess: sub, output });
  }, [outputListOpen.subprocess, outputListOpen.mode]);

  const columns = useMemo(
    () =>
      getColumns(
        openEdit,
        openVerDiagrama,
        openProcedureCreate,
        openProcedureEdit,
        openProcedureView,
        openInputCreate,
        openInputEdit,
        openInputView,
        openOutputCreate,
        openOutputEdit,
        openOutputView
      ),
    [
      openEdit,
      openVerDiagrama,
      openProcedureCreate,
      openProcedureEdit,
      openProcedureView,
      openInputCreate,
      openInputEdit,
      openInputView,
      openOutputCreate,
      openOutputEdit,
      openOutputView,
    ]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Configuración &gt; Cadena de Producción &gt; Subproceso
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Buscar por nombre, código, proceso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setGeneralDiagramOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Diagrama general
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Crear +
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando subprocesos...</p>
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}

      <SubprocesoModal
        open={modal.open}
        onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}
        mode={modal.mode}
        subprocess={modal.subprocess}
        onSuccess={fetchItems}
      />

      <ProcedureSubprocessListDialog
        open={procedureListOpen.open}
        onOpenChange={(open) => setProcedureListOpen((prev) => ({ ...prev, open }))}
        subprocess={procedureListOpen.subprocess}
        mode={procedureListOpen.mode}
        onCrear={openProcedureFromListCrear}
        onSelectProcedure={openProcedureFromListSelect}
      />
      <ProcedureSubprocessModal
        open={procedureModal.open}
        onOpenChange={(open) => setProcedureModal((prev) => ({ ...prev, open }))}
        mode={procedureModal.mode}
        subprocess={procedureModal.subprocess}
        procedure={procedureModal.procedure}
        onSuccess={fetchItems}
      />

      <InputSubprocessListDialog
        open={inputListOpen.open}
        onOpenChange={(open) => setInputListOpen((prev) => ({ ...prev, open }))}
        subprocess={inputListOpen.subprocess}
        mode={inputListOpen.mode}
        onCrear={openInputFromListCrear}
        onSelectInput={openInputFromListSelect}
      />
      <InputSubprocessModal
        open={inputModal.open}
        onOpenChange={(open) => setInputModal((prev) => ({ ...prev, open }))}
        mode={inputModal.mode}
        subprocess={inputModal.subprocess}
        input={inputModal.input}
        onSuccess={fetchItems}
      />

      <OutputSubprocessListDialog
        open={outputListOpen.open}
        onOpenChange={(open) => setOutputListOpen((prev) => ({ ...prev, open }))}
        subprocess={outputListOpen.subprocess}
        mode={outputListOpen.mode}
        onCrear={openOutputFromListCrear}
        onSelectOutput={openOutputFromListSelect}
      />
      <OutputSubprocessModal
        open={outputModal.open}
        onOpenChange={(open) => setOutputModal((prev) => ({ ...prev, open }))}
        mode={outputModal.mode}
        subprocess={outputModal.subprocess}
        output={outputModal.output}
        onSuccess={fetchItems}
      />

      {generalDiagramOpen && (
        <div className="rounded-md border p-4 text-sm text-muted-foreground">
          Modal Diagrama general (por implementar).
          <button
            type="button"
            className="ml-2 text-primary hover:underline"
            onClick={() => setGeneralDiagramOpen(false)}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}
