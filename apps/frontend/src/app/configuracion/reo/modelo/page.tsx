"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import { getModelColumns, type ModelRow } from "./columns";
import { getCareColumns, type CareRow } from "./care-columns";
import { CareModal } from "./care-modal";
import { ModelModal } from "./model-modal";

type CareModalState = { open: boolean; mode: "create" | "edit" | "view"; item: CareRow | null };
type ModelModalState = { open: boolean; mode: "create" | "edit" | "view"; modelId: number | null };

export default function ModeloPage() {
  const [models, setModels] = useState<ModelRow[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [selectedModel, setSelectedModel] = useState<ModelRow | null>(null);

  const [cares, setCares] = useState<CareRow[]>([]);
  const [loadingCares, setLoadingCares] = useState(false);
  const [selectedCare, setSelectedCare] = useState<CareRow | null>(null);

  const [careModal, setCareModal] = useState<CareModalState>({
    open: false,
    mode: "create",
    item: null,
  });
  const [modelModal, setModelModal] = useState<ModelModalState>({
    open: false,
    mode: "create",
    modelId: null,
  });

  const fetchModels = useCallback(() => {
    setLoadingModels(true);
    apiFetch("/api/models")
      .then((res) => res.json())
      .then((data) => setModels(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar modelos:", err))
      .finally(() => setLoadingModels(false));
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const fetchCares = useCallback((modelId: number) => {
    setLoadingCares(true);
    apiFetch(`/api/cares?modelId=${modelId}`)
      .then((res) => res.json())
      .then((data) => setCares(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar cuidados:", err))
      .finally(() => setLoadingCares(false));
  }, []);

  useEffect(() => {
    setSelectedCare(null);
    if (selectedModel) fetchCares(selectedModel.idDlkModel);
    else setCares([]);
  }, [selectedModel, fetchCares]);

  const refreshCares = useCallback(() => {
    if (selectedModel) fetchCares(selectedModel.idDlkModel);
  }, [selectedModel, fetchCares]);

  const modelColumns = useMemo(
    () =>
      getModelColumns({
        onEdit: (m) => setModelModal({ open: true, mode: "edit", modelId: m.idDlkModel }),
        onView: (m) => setModelModal({ open: true, mode: "view", modelId: m.idDlkModel }),
      }),
    []
  );
  const careColumns = useMemo(
    () =>
      getCareColumns({
        onEdit: (c) => setCareModal({ open: true, mode: "edit", item: c }),
        onView: (c) => setCareModal({ open: true, mode: "view", item: c }),
      }),
    []
  );

  const careLink = "text-sm font-medium";
  const enabledLink = "text-primary hover:underline";
  const disabledLink = "text-muted-foreground/50 cursor-not-allowed";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Configuración &gt; REO &gt; Modelo</p>
        <button
          onClick={() => setModelModal({ open: true, mode: "create", modelId: null })}
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Crear +
        </button>
      </div>

      {/* Tabla principal de modelos (selección por fila) */}
      {loadingModels ? (
        <p className="text-sm text-muted-foreground">Cargando modelos…</p>
      ) : models.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay modelos registrados. Usa <span className="font-medium">Crear +</span> para agregar uno.
        </p>
      ) : (
        <DataTable
          columns={modelColumns}
          data={models}
          onRowClick={(m) => setSelectedModel(m)}
          rowClassName={(m) =>
            selectedModel?.idDlkModel === m.idDlkModel ? "bg-primary/10" : undefined
          }
        />
      )}

      {/* Sección Cuidado de la prenda (por modelo seleccionado) */}
      <div className="space-y-3 border-t pt-6">
        <div className="flex flex-wrap items-center gap-x-3">
          <h2 className="text-base font-semibold">CUIDADO DE LA PRENDA:</h2>
          <button
            type="button"
            className={`${careLink} ${selectedModel ? enabledLink : disabledLink}`}
            disabled={!selectedModel}
            onClick={() => setCareModal({ open: true, mode: "create", item: null })}
          >
            Crear
          </button>
          <button
            type="button"
            className={`${careLink} ${selectedCare ? enabledLink : disabledLink}`}
            disabled={!selectedCare}
            onClick={() => selectedCare && setCareModal({ open: true, mode: "edit", item: selectedCare })}
          >
            Actualizar
          </button>
          <button
            type="button"
            className={`${careLink} ${selectedCare ? enabledLink : disabledLink}`}
            disabled={!selectedCare}
            onClick={() => selectedCare && setCareModal({ open: true, mode: "view", item: selectedCare })}
          >
            Ver
          </button>
        </div>

        {!selectedModel ? (
          <p className="text-sm text-muted-foreground">
            Selecciona un modelo de la tabla para gestionar sus cuidados.
          </p>
        ) : loadingCares ? (
          <p className="text-sm text-muted-foreground">Cargando cuidados…</p>
        ) : cares.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            El modelo <span className="font-medium">{selectedModel.nameModel ?? selectedModel.codModel}</span>{" "}
            aún no tiene cuidados. Usa <span className="font-medium">Crear</span> para agregar uno.
          </p>
        ) : (
          <DataTable
            columns={careColumns}
            data={cares}
            onRowClick={(c) => setSelectedCare(c)}
            rowClassName={(c) =>
              selectedCare?.idDlkCare === c.idDlkCare ? "bg-primary/10" : undefined
            }
          />
        )}
      </div>

      <CareModal
        open={careModal.open}
        onOpenChange={(open) => setCareModal((prev) => ({ ...prev, open }))}
        mode={careModal.mode}
        modelId={selectedModel?.idDlkModel ?? null}
        care={careModal.item}
        onSuccess={refreshCares}
      />

      <ModelModal
        open={modelModal.open}
        onOpenChange={(open) => setModelModal((prev) => ({ ...prev, open }))}
        mode={modelModal.mode}
        modelId={modelModal.modelId}
        onSuccess={fetchModels}
      />
    </div>
  );
}
