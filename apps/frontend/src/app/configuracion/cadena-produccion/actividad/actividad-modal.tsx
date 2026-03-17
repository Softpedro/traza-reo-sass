"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getTrazabilidadLabel } from "../eslabon/obs";
import { OBS_TIPO_ACTIVIDAD } from "./obs";
import type { ActivityRow } from "./columns";

type ModalMode = "create" | "edit" | "view";

interface ActividadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  activity: ActivityRow | null;
  onSuccess: () => void;
}

type ChainOption = {
  idDlkProductionChain: number;
  numPrecedenciaTrazabilidad: number;
  nameProductionChain: string;
};

type ProcessOption = {
  idDlkProcess: number;
  codProcess: string;
  nameProcess: string;
  productionChain: { idDlkProductionChain: number };
};

type SubprocessOption = {
  idDlkSubprocess: number;
  codSubprocess: string;
  nameSubprocess: string;
  process: { idDlkProcess: number };
};

const emptyForm = {
  idDlkSubprocess: 0,
  idDlkProductionChain: 0 as number,
  idDlkProcess: 0 as number,
  codActivities: "",
  nameActivities: "",
  descriptionActivities: "",
  typeActivities: "1",
  orderActivities: 1,
  estimatedTimeActivities: "",
  machineRequired: "1",
  skillRequired: "",
  checklistActivities: "",
  stateActivities: 1,
};

export function ActividadModal({
  open,
  onOpenChange,
  mode,
  activity,
  onSuccess,
}: ActividadModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [chains, setChains] = useState<ChainOption[]>([]);
  const [processes, setProcesses] = useState<ProcessOption[]>([]);
  const [subprocesses, setSubprocesses] = useState<SubprocessOption[]>([]);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    fetch(apiUrl("/api/production-chains"))
      .then((r) => r.json())
      .then((data: ChainOption[]) => setChains(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar cadenas:", err));
    fetch(apiUrl("/api/processes"))
      .then((r) => r.json())
      .then((data: ProcessOption[]) => setProcesses(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar procesos:", err));
    fetch(apiUrl("/api/subprocesses"))
      .then((r) => r.json())
      .then((data: SubprocessOption[]) => setSubprocesses(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar subprocesos:", err));
  }, [open]);

  useEffect(() => {
    if (activity && (mode === "edit" || mode === "view")) {
      const pc = activity.subprocess.process.productionChain;
      setForm({
        idDlkSubprocess: activity.idDlkSubprocess,
        idDlkProductionChain: pc.idDlkProductionChain,
        idDlkProcess: activity.subprocess.process.idDlkProcess,
        codActivities: activity.codActivities ?? "",
        nameActivities: activity.nameActivities,
        descriptionActivities: activity.descriptionActivities ?? "",
        typeActivities: activity.typeActivities || "1",
        orderActivities: activity.orderActivities ?? 1,
        estimatedTimeActivities: activity.estimatedTimeActivities ?? "",
        machineRequired: activity.machineRequired ?? "1",
        skillRequired: activity.skillRequired ?? "",
        checklistActivities: activity.checklistActivities ?? "",
        stateActivities: activity.stateActivities,
      });
    } else if (mode === "create") {
      setForm(emptyForm);
    }
  }, [activity, mode, open]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const selectedChain = form.idDlkProductionChain
    ? chains.find((c) => c.idDlkProductionChain === form.idDlkProductionChain)
    : null;
  const selectedProcess = form.idDlkProcess
    ? processes.find((p) => p.idDlkProcess === form.idDlkProcess)
    : null;
  const selectedSubprocess = form.idDlkSubprocess
    ? subprocesses.find((s) => s.idDlkSubprocess === form.idDlkSubprocess)
    : null;

  const eslabonLabel = selectedChain
    ? `${getTrazabilidadLabel(selectedChain.numPrecedenciaTrazabilidad).split(" ")[0]} - ${selectedChain.nameProductionChain}`
    : "";
  const processLabel = selectedProcess
    ? `${selectedProcess.codProcess || ""} - ${selectedProcess.nameProcess}`.trim()
    : "";
  const subprocessLabel = selectedSubprocess
    ? `${selectedSubprocess.codSubprocess || ""} - ${selectedSubprocess.nameSubprocess}`.trim()
    : "";

  async function handleSubmit() {
    if (!form.nameActivities.trim()) {
      alert("El nombre de la actividad es obligatorio");
      return;
    }
    if (!form.idDlkSubprocess) {
      alert("Debe seleccionar un subproceso");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/activities/${activity!.idDlkActivities}`)
          : apiUrl("/api/activities");
      const method = mode === "edit" ? "PUT" : "POST";
      const payload =
        mode === "edit"
          ? {
              ...form,
              orderActivities: form.orderActivities || null,
              estimatedTimeActivities: form.estimatedTimeActivities || null,
              stateActivities: Number(form.stateActivities),
            }
          : {
              idDlkSubprocess: form.idDlkSubprocess,
              codActivities: form.codActivities.trim() || undefined,
              nameActivities: form.nameActivities,
              descriptionActivities: form.descriptionActivities,
              typeActivities: form.typeActivities,
              orderActivities: form.orderActivities || null,
              estimatedTimeActivities: form.estimatedTimeActivities || null,
              machineRequired: form.machineRequired || null,
              skillRequired: form.skillRequired || null,
              checklistActivities: form.checklistActivities || null,
              stateActivities: Number(form.stateActivities),
            };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.type === "VALIDATION") throw new Error(body.error);
        throw new Error(body?.error ?? `Error ${res.status} al guardar`);
      }

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error al guardar la actividad");
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "create" ? "Crear Actividad" : mode === "edit" ? "Actualizar Actividad" : "Detalle de Actividad";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Configuración &gt; Cadena de Producción &gt; Proceso &gt; Sub Proceso &gt; Actividad (Modales)
        </p>

        <div className="grid gap-4 py-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Eslabón</Label>
            <Select
              value={form.idDlkProductionChain ? String(form.idDlkProductionChain) : ""}
              onValueChange={(v) => {
                const id = Number(v);
                setForm((prev) => ({
                  ...prev,
                  idDlkProductionChain: id,
                  idDlkProcess: 0,
                  idDlkSubprocess: 0,
                }));
              }}
              disabled={readOnly}
            >
              <SelectTrigger><SelectValue placeholder="Seleccione eslabón" /></SelectTrigger>
              <SelectContent>
                {chains.map((c) => (
                  <SelectItem key={c.idDlkProductionChain} value={String(c.idDlkProductionChain)}>
                    {getTrazabilidadLabel(c.numPrecedenciaTrazabilidad).split(" ")[0]} - {c.nameProductionChain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label>Proceso</Label>
            <Select
              value={form.idDlkProcess ? String(form.idDlkProcess) : ""}
              onValueChange={(v) => {
                const id = Number(v);
                const firstSub = subprocesses.find((s) => s.process.idDlkProcess === id);
                setForm((prev) => ({
                  ...prev,
                  idDlkProcess: id,
                  idDlkSubprocess: firstSub?.idDlkSubprocess ?? 0,
                }));
              }}
              disabled={readOnly}
            >
              <SelectTrigger><SelectValue placeholder="Seleccione proceso" /></SelectTrigger>
              <SelectContent>
                {processes
                  .filter((p) => !form.idDlkProductionChain || p.productionChain.idDlkProductionChain === form.idDlkProductionChain)
                  .map((p) => (
                    <SelectItem key={p.idDlkProcess} value={String(p.idDlkProcess)}>
                      {p.codProcess} - {p.nameProcess}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label>Subproceso</Label>
            <Select
              value={form.idDlkSubprocess ? String(form.idDlkSubprocess) : ""}
              onValueChange={(v) => handleChange("idDlkSubprocess", Number(v))}
              disabled={readOnly}
            >
              <SelectTrigger><SelectValue placeholder="Seleccione subproceso" /></SelectTrigger>
              <SelectContent>
                {subprocesses
                  .filter(
                    (s) =>
                      !form.idDlkProcess || s.process.idDlkProcess === form.idDlkProcess
                  )
                  .map((s) => (
                    <SelectItem key={s.idDlkSubprocess} value={String(s.idDlkSubprocess)}>
                      {s.codSubprocess} - {s.nameSubprocess}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Código</Label>
            <Input
              value={form.codActivities}
              onChange={(e) => handleChange("codActivities", e.target.value)}
              placeholder="Ej: ACT-SUB-PRO-COM-EST-MKT"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Actividad</Label>
            <Input
              value={form.nameActivities}
              onChange={(e) => handleChange("nameActivities", e.target.value)}
              placeholder="Nombre de la actividad"
              readOnly={readOnly}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Descripción</Label>
            <Input
              value={form.descriptionActivities}
              onChange={(e) => handleChange("descriptionActivities", e.target.value)}
              placeholder="Descripción"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select
              value={form.typeActivities}
              onValueChange={(v) => handleChange("typeActivities", v)}
              disabled={readOnly}
            >
              <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                {Object.entries(OBS_TIPO_ACTIVIDAD).map(([k, label]) => (
                  <SelectItem key={k} value={k}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">1=Manual, 2=Máquina, 3=Control</p>
          </div>
          <div>
            <Label>Secuencia</Label>
            <Input
              type="number"
              min={1}
              value={form.orderActivities}
              onChange={(e) => handleChange("orderActivities", e.target.value ? Number(e.target.value) : 1)}
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Duración (en horas)</Label>
            <Input
              value={form.estimatedTimeActivities}
              onChange={(e) => handleChange("estimatedTimeActivities", e.target.value)}
              placeholder="Horas"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label>Máquina</Label>
            <Select
              value={form.machineRequired}
              onValueChange={(v) => handleChange("machineRequired", v)}
              disabled={readOnly}
            >
              <SelectTrigger><SelectValue placeholder="Máquina" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Manual</SelectItem>
                <SelectItem value="2">Cortadora</SelectItem>
                <SelectItem value="3">Otra</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label>Habilidades Requeridas</Label>
            <Input
              value={form.skillRequired}
              onChange={(e) => handleChange("skillRequired", e.target.value)}
              placeholder="Habilidades requeridas"
              readOnly={readOnly}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Puntos de Control</Label>
            <Input
              value={form.checklistActivities}
              onChange={(e) => handleChange("checklistActivities", e.target.value)}
              placeholder="Puntos de control"
              readOnly={readOnly}
            />
          </div>
          {(mode === "edit" || mode === "view") && (
            <div>
              <Label>Estado</Label>
              <Select
                value={String(form.stateActivities)}
                onValueChange={(v) => handleChange("stateActivities", Number(v))}
                disabled={readOnly}
              >
                <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Off</SelectItem>
                  <SelectItem value="1">On</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {!readOnly && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Guardando..." : mode === "edit" ? "Actualizar" : "Crear"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
