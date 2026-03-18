"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getColumns, type ActivityRow } from "./columns";
import { ActividadModal } from "./actividad-modal";
import { ActivityGeneralDiagramDialog } from "./activity-general-diagram-dialog";
import { ProcedureActivityModal, type ProcedureActivityRow } from "./procedure-activity-modal";
import { ProcedureActivityListDialog } from "./procedure-activity-list-dialog";
import { InputActivityModal, type InputActivityRow } from "./input-activity-modal";
import { InputActivityListDialog } from "./input-activity-list-dialog";
import { OutputActivityModal, type OutputActivityRow } from "./output-activity-modal";
import { OutputActivityListDialog } from "./output-activity-list-dialog";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  activity: ActivityRow | null;
};

type ProcedureListState = { open: boolean; activity: ActivityRow | null; mode: "edit" | "view" };
type ProcedureModalState = { open: boolean; mode: "create" | "edit" | "view"; activity: ActivityRow | null; procedure: ProcedureActivityRow | null };
type InputListState = { open: boolean; activity: ActivityRow | null; mode: "edit" | "view" };
type InputModalState = { open: boolean; mode: "create" | "edit" | "view"; activity: ActivityRow | null; input: InputActivityRow | null };
type OutputListState = { open: boolean; activity: ActivityRow | null; mode: "edit" | "view" };
type OutputModalState = { open: boolean; mode: "create" | "edit" | "view"; activity: ActivityRow | null; output: OutputActivityRow | null };

export default function ActividadPage() {
  const [items, setItems] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [generalDiagramOpen, setGeneralDiagramOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({ open: false, mode: "create", activity: null });
  const [procedureListOpen, setProcedureListOpen] = useState<ProcedureListState>({ open: false, activity: null, mode: "edit" });
  const [procedureModal, setProcedureModal] = useState<ProcedureModalState>({ open: false, mode: "create", activity: null, procedure: null });
  const [inputListOpen, setInputListOpen] = useState<InputListState>({ open: false, activity: null, mode: "edit" });
  const [inputModal, setInputModal] = useState<InputModalState>({ open: false, mode: "create", activity: null, input: null });
  const [outputListOpen, setOutputListOpen] = useState<OutputListState>({ open: false, activity: null, mode: "edit" });
  const [outputModal, setOutputModal] = useState<OutputModalState>({ open: false, mode: "create", activity: null, output: null });

  const fetchItems = useCallback(() => {
    setLoading(true);
    fetch(apiUrl("/api/activities"))
      .then((res) => res.json())
      .then((data: ActivityRow[]) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar actividades:", err))
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
        row.nameActivities.toLowerCase().includes(s) ||
        row.codActivities?.toLowerCase().includes(s) ||
        row.descriptionActivities?.toLowerCase().includes(s) ||
        row.subprocess.nameSubprocess.toLowerCase().includes(s) ||
        row.subprocess.process.nameProcess.toLowerCase().includes(s) ||
        row.subprocess.process.productionChain.nameProductionChain.toLowerCase().includes(s)
    );
  }, [items, search]);

  const openCreate = () => setModal({ open: true, mode: "create", activity: null });
  const openEdit = useCallback((row: ActivityRow) => setModal({ open: true, mode: "edit", activity: row }), []);
  const openVerDiagrama = useCallback((_row: ActivityRow) => {
    setGeneralDiagramOpen(true);
  }, []);

  const openProcedureCreate = useCallback((row: ActivityRow) => {
    setProcedureListOpen((prev) => ({ ...prev, open: false }));
    setProcedureModal({ open: true, mode: "create", activity: row, procedure: null });
  }, []);
  const openProcedureEdit = useCallback((row: ActivityRow) => {
    setProcedureModal((prev) => ({ ...prev, open: false }));
    setProcedureListOpen({ open: true, activity: row, mode: "edit" });
  }, []);
  const openProcedureView = useCallback((row: ActivityRow) => {
    setProcedureModal((prev) => ({ ...prev, open: false }));
    setProcedureListOpen({ open: true, activity: row, mode: "view" });
  }, []);
  const openProcedureFromListCrear = useCallback(() => {
    const act = procedureListOpen.activity;
    if (!act) return;
    setProcedureListOpen((prev) => ({ ...prev, open: false }));
    setProcedureModal({ open: true, mode: "create", activity: act, procedure: null });
  }, [procedureListOpen.activity]);
  const openProcedureFromListSelect = useCallback((procedure: ProcedureActivityRow) => {
    const act = procedureListOpen.activity;
    if (!act) return;
    setProcedureModal({ open: true, mode: procedureListOpen.mode as "edit" | "view", activity: act, procedure });
  }, [procedureListOpen.activity, procedureListOpen.mode]);

  const openInputCreate = useCallback((row: ActivityRow) => {
    setInputListOpen((prev) => ({ ...prev, open: false }));
    setInputModal({ open: true, mode: "create", activity: row, input: null });
  }, []);
  const openInputEdit = useCallback((row: ActivityRow) => {
    setInputModal((prev) => ({ ...prev, open: false }));
    setInputListOpen({ open: true, activity: row, mode: "edit" });
  }, []);
  const openInputView = useCallback((row: ActivityRow) => {
    setInputModal((prev) => ({ ...prev, open: false }));
    setInputListOpen({ open: true, activity: row, mode: "view" });
  }, []);
  const openInputFromListCrear = useCallback(() => {
    const act = inputListOpen.activity;
    if (!act) return;
    setInputListOpen((prev) => ({ ...prev, open: false }));
    setInputModal({ open: true, mode: "create", activity: act, input: null });
  }, [inputListOpen.activity]);
  const openInputFromListSelect = useCallback((input: InputActivityRow) => {
    const act = inputListOpen.activity;
    if (!act) return;
    setInputModal({ open: true, mode: inputListOpen.mode as "edit" | "view", activity: act, input });
  }, [inputListOpen.activity, inputListOpen.mode]);

  const openOutputCreate = useCallback((row: ActivityRow) => {
    setOutputListOpen((prev) => ({ ...prev, open: false }));
    setOutputModal({ open: true, mode: "create", activity: row, output: null });
  }, []);
  const openOutputEdit = useCallback((row: ActivityRow) => {
    setOutputModal((prev) => ({ ...prev, open: false }));
    setOutputListOpen({ open: true, activity: row, mode: "edit" });
  }, []);
  const openOutputView = useCallback((row: ActivityRow) => {
    setOutputModal((prev) => ({ ...prev, open: false }));
    setOutputListOpen({ open: true, activity: row, mode: "view" });
  }, []);
  const openOutputFromListCrear = useCallback(() => {
    const act = outputListOpen.activity;
    if (!act) return;
    setOutputListOpen((prev) => ({ ...prev, open: false }));
    setOutputModal({ open: true, mode: "create", activity: act, output: null });
  }, [outputListOpen.activity]);
  const openOutputFromListSelect = useCallback((output: OutputActivityRow) => {
    const act = outputListOpen.activity;
    if (!act) return;
    setOutputModal({ open: true, mode: outputListOpen.mode as "edit" | "view", activity: act, output });
  }, [outputListOpen.activity, outputListOpen.mode]);

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
            Configuración &gt; Cadena de Producción &gt; Actividad
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
              Diagrama General
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
        <p className="text-sm text-muted-foreground">Cargando actividades...</p>
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}

      <ActividadModal
        open={modal.open}
        onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}
        mode={modal.mode}
        activity={modal.activity}
        onSuccess={fetchItems}
      />

      <ProcedureActivityListDialog
        open={procedureListOpen.open}
        onOpenChange={(open) => setProcedureListOpen((prev) => ({ ...prev, open }))}
        activity={procedureListOpen.activity}
        mode={procedureListOpen.mode}
        onCrear={openProcedureFromListCrear}
        onSelectProcedure={openProcedureFromListSelect}
      />
      <ProcedureActivityModal
        open={procedureModal.open}
        onOpenChange={(open) => setProcedureModal((prev) => ({ ...prev, open }))}
        mode={procedureModal.mode}
        activity={procedureModal.activity}
        procedure={procedureModal.procedure}
        onSuccess={fetchItems}
      />

      <InputActivityListDialog
        open={inputListOpen.open}
        onOpenChange={(open) => setInputListOpen((prev) => ({ ...prev, open }))}
        activity={inputListOpen.activity}
        mode={inputListOpen.mode}
        onCrear={openInputFromListCrear}
        onSelectInput={openInputFromListSelect}
      />
      <InputActivityModal
        open={inputModal.open}
        onOpenChange={(open) => setInputModal((prev) => ({ ...prev, open }))}
        mode={inputModal.mode}
        activity={inputModal.activity}
        input={inputModal.input}
        onSuccess={fetchItems}
      />

      <OutputActivityListDialog
        open={outputListOpen.open}
        onOpenChange={(open) => setOutputListOpen((prev) => ({ ...prev, open }))}
        activity={outputListOpen.activity}
        mode={outputListOpen.mode}
        onCrear={openOutputFromListCrear}
        onSelectOutput={openOutputFromListSelect}
      />
      <OutputActivityModal
        open={outputModal.open}
        onOpenChange={(open) => setOutputModal((prev) => ({ ...prev, open }))}
        mode={outputModal.mode}
        activity={outputModal.activity}
        output={outputModal.output}
        onSuccess={fetchItems}
      />

      <ActivityGeneralDiagramDialog
        open={generalDiagramOpen}
        onOpenChange={setGeneralDiagramOpen}
      />
    </div>
  );
}
