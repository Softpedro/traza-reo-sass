"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getColumns, type ProcessRow } from "./columns";
import { ProcesoModal } from "./proceso-modal";
import { InputProcessModal, type InputProcessRow } from "./input-process-modal";
import { InputListDialog } from "./input-list-dialog";
import { OutputProcessModal, type OutputProcessRow } from "./output-process-modal";
import { OutputListDialog } from "./output-list-dialog";
import { ProcedureProcessModal, type ProcedureProcessRow } from "./procedure-process-modal";
import { ProcedureListDialog } from "./procedure-list-dialog";
import { ProcessDiagramDialog } from "./process-diagram-dialog";
import { ProcessGeneralDiagramDialog } from "./process-general-diagram-dialog";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  process: ProcessRow | null;
};

type InputModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  process: ProcessRow | null;
  input: InputProcessRow | null;
};

type InputListState = {
  open: boolean;
  process: ProcessRow | null;
  mode: "edit" | "view";
};

type OutputModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  process: ProcessRow | null;
  output: OutputProcessRow | null;
};

type OutputListState = {
  open: boolean;
  process: ProcessRow | null;
  mode: "edit" | "view";
};

type ProcedureModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  process: ProcessRow | null;
  procedure: ProcedureProcessRow | null;
};

type ProcedureListState = {
  open: boolean;
  process: ProcessRow | null;
  mode: "edit" | "view";
};

export default function ProcesoPage() {
  const [items, setItems] = useState<ProcessRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    process: null,
  });
  const [inputModal, setInputModal] = useState<InputModalState>({
    open: false,
    mode: "create",
    process: null,
    input: null,
  });
  const [inputListOpen, setInputListOpen] = useState<InputListState>({
    open: false,
    process: null,
    mode: "edit",
  });
  const [outputModal, setOutputModal] = useState<OutputModalState>({
    open: false,
    mode: "create",
    process: null,
    output: null,
  });
  const [outputListOpen, setOutputListOpen] = useState<OutputListState>({
    open: false,
    process: null,
    mode: "edit",
  });
  const [procedureModal, setProcedureModal] = useState<ProcedureModalState>({
    open: false,
    mode: "create",
    process: null,
    procedure: null,
  });
  const [procedureListOpen, setProcedureListOpen] = useState<ProcedureListState>({
    open: false,
    process: null,
    mode: "edit",
  });
  const [diagramProcess, setDiagramProcess] = useState<ProcessRow | null>(null);
  const [generalDiagramOpen, setGeneralDiagramOpen] = useState(false);

  const fetchItems = useCallback(() => {
    setLoading(true);
    fetch(apiUrl("/api/processes"))
      .then((res) => res.json())
      .then((data: ProcessRow[]) => setItems(data))
      .catch((err) => console.error("Error al cargar procesos:", err))
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
        row.nameProcess.toLowerCase().includes(s) ||
        row.codProcess?.toLowerCase().includes(s) ||
        row.desProcess?.toLowerCase().includes(s) ||
        row.parentCompany?.nameParentCompany?.toLowerCase().includes(s) ||
        row.parentCompany?.codParentCompany?.toLowerCase().includes(s)
    );
  }, [items, search]);

  const openCreate = () => setModal({ open: true, mode: "create", process: null });
  const openEdit = useCallback((process: ProcessRow) => {
    setModal({ open: true, mode: "edit", process });
  }, []);
  const openView = useCallback((process: ProcessRow) => {
    setModal({ open: true, mode: "view", process });
  }, []);
  const openDiagrama = useCallback((process: ProcessRow) => {
    setDiagramProcess(process);
  }, []);

  const openInputCreate = useCallback((process: ProcessRow) => {
    setInputListOpen((prev) => ({ ...prev, open: false }));
    setInputModal({ open: true, mode: "create", process, input: null });
  }, []);
  const openInputEdit = useCallback((process: ProcessRow) => {
    setInputModal((prev) => ({ ...prev, open: false }));
    setInputListOpen({ open: true, process, mode: "edit" });
  }, []);
  const openInputView = useCallback((process: ProcessRow) => {
    setInputModal((prev) => ({ ...prev, open: false }));
    setInputListOpen({ open: true, process, mode: "view" });
  }, []);
  const openInputFromListCrear = useCallback(() => {
    const process = inputListOpen.process;
    if (!process) return;
    setInputListOpen((prev) => ({ ...prev, open: false }));
    setInputModal({ open: true, mode: "create", process, input: null });
  }, [inputListOpen.process]);
  const openInputFromListSelect = useCallback((input: InputProcessRow) => {
    const process = inputListOpen.process;
    if (!process) return;
    setInputModal({ open: true, mode: inputListOpen.mode, process, input });
  }, [inputListOpen.process, inputListOpen.mode]);

  const openOutputCreate = useCallback((process: ProcessRow) => {
    setOutputListOpen((prev) => ({ ...prev, open: false }));
    setOutputModal({ open: true, mode: "create", process, output: null });
  }, []);
  const openOutputEdit = useCallback((process: ProcessRow) => {
    setOutputModal((prev) => ({ ...prev, open: false }));
    setOutputListOpen({ open: true, process, mode: "edit" });
  }, []);
  const openOutputView = useCallback((process: ProcessRow) => {
    setOutputModal((prev) => ({ ...prev, open: false }));
    setOutputListOpen({ open: true, process, mode: "view" });
  }, []);
  const openOutputFromListCrear = useCallback(() => {
    const process = outputListOpen.process;
    if (!process) return;
    setOutputListOpen((prev) => ({ ...prev, open: false }));
    setOutputModal({ open: true, mode: "create", process, output: null });
  }, [outputListOpen.process]);
  const openOutputFromListSelect = useCallback((output: OutputProcessRow) => {
    const process = outputListOpen.process;
    if (!process) return;
    setOutputModal({ open: true, mode: outputListOpen.mode, process, output });
  }, [outputListOpen.process, outputListOpen.mode]);

  const openProcedureCreate = useCallback((process: ProcessRow) => {
    setProcedureListOpen((prev) => ({ ...prev, open: false }));
    setProcedureModal({ open: true, mode: "create", process, procedure: null });
  }, []);
  const openProcedureEdit = useCallback((process: ProcessRow) => {
    setProcedureModal((prev) => ({ ...prev, open: false }));
    setProcedureListOpen({ open: true, process, mode: "edit" });
  }, []);
  const openProcedureView = useCallback((process: ProcessRow) => {
    setProcedureModal((prev) => ({ ...prev, open: false }));
    setProcedureListOpen({ open: true, process, mode: "view" });
  }, []);
  const openProcedureFromListCrear = useCallback(() => {
    const process = procedureListOpen.process;
    if (!process) return;
    setProcedureListOpen((prev) => ({ ...prev, open: false }));
    setProcedureModal({ open: true, mode: "create", process, procedure: null });
  }, [procedureListOpen.process]);
  const openProcedureFromListSelect = useCallback((procedure: ProcedureProcessRow) => {
    const process = procedureListOpen.process;
    if (!process) return;
    setProcedureModal({ open: true, mode: procedureListOpen.mode, process, procedure });
  }, [procedureListOpen.process, procedureListOpen.mode]);

  const columns = useMemo(
    () =>
      getColumns(
        openEdit,
        openView,
        openDiagrama,
        openInputCreate,
        openInputEdit,
        openInputView,
        openOutputCreate,
        openOutputEdit,
        openOutputView,
        openProcedureCreate,
        openProcedureEdit,
        openProcedureView
      ),
    [
      openEdit,
      openView,
      openDiagrama,
      openInputCreate,
      openInputEdit,
      openInputView,
      openOutputCreate,
      openOutputEdit,
      openOutputView,
      openProcedureCreate,
      openProcedureEdit,
      openProcedureView,
    ]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Configuración &gt; Cadena de Producción &gt; Proceso
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Por empresa, por nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setGeneralDiagramOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Diagrama general
            </button>
            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Crear +
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando procesos...</p>
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}

      <ProcesoModal
        open={modal.open}
        onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}
        mode={modal.mode}
        process={modal.process}
        onSuccess={fetchItems}
      />

      <InputListDialog
        open={inputListOpen.open}
        onOpenChange={(open) => setInputListOpen((prev) => ({ ...prev, open }))}
        process={inputListOpen.process}
        mode={inputListOpen.mode}
        onCrear={openInputFromListCrear}
        onSelectInput={openInputFromListSelect}
      />

      <InputProcessModal
        open={inputModal.open}
        onOpenChange={(open) => setInputModal((prev) => ({ ...prev, open }))}
        mode={inputModal.mode}
        process={inputModal.process}
        input={inputModal.input}
        onSuccess={fetchItems}
      />

      <OutputListDialog
        open={outputListOpen.open}
        onOpenChange={(open) => setOutputListOpen((prev) => ({ ...prev, open }))}
        process={outputListOpen.process}
        mode={outputListOpen.mode}
        onCrear={openOutputFromListCrear}
        onSelectOutput={openOutputFromListSelect}
      />

      <OutputProcessModal
        open={outputModal.open}
        onOpenChange={(open) => setOutputModal((prev) => ({ ...prev, open }))}
        mode={outputModal.mode}
        process={outputModal.process}
        output={outputModal.output}
        onSuccess={fetchItems}
      />

      <ProcedureListDialog
        open={procedureListOpen.open}
        onOpenChange={(open) => setProcedureListOpen((prev) => ({ ...prev, open }))}
        process={procedureListOpen.process}
        mode={procedureListOpen.mode}
        onCrear={openProcedureFromListCrear}
        onSelectProcedure={openProcedureFromListSelect}
      />

      <ProcedureProcessModal
        open={procedureModal.open}
        onOpenChange={(open) => setProcedureModal((prev) => ({ ...prev, open }))}
        mode={procedureModal.mode}
        process={procedureModal.process}
        procedure={procedureModal.procedure}
        onSuccess={fetchItems}
      />

      <ProcessDiagramDialog
        open={!!diagramProcess}
        onOpenChange={(open) => !open && setDiagramProcess(null)}
        process={diagramProcess}
      />

      <ProcessGeneralDiagramDialog
        open={generalDiagramOpen}
        onOpenChange={setGeneralDiagramOpen}
      />
    </div>
  );
}
