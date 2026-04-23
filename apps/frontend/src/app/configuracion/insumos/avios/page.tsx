"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getColumns, type Avios } from "./columns";
import { AviosModal } from "./avios-modal";
import { BulkUploadModal } from "@/components/bulk-upload-modal";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  avios: Avios | null;
};

export default function AviosPage() {
  const [rows, setRows] = useState<Avios[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    avios: null,
  });
  const [bulkOpen, setBulkOpen] = useState(false);

  const fetchList = useCallback(() => {
    setLoading(true);
    setListError(null);
    fetch(apiUrl("/api/avios"))
      .then(async (res) => {
        const data: unknown = await res.json();
        if (!res.ok) {
          setListError(
            typeof data === "object" && data && "error" in data && typeof (data as { error: unknown }).error === "string"
              ? (data as { error: string }).error
              : `Error ${res.status} al cargar avíos`
          );
          setRows([]);
          return;
        }
        setRows(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error al cargar avíos:", err);
        setListError("No se pudo cargar la lista de avíos.");
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const openCreate = () => setModal({ open: true, mode: "create", avios: null });

  const openEdit = useCallback((row: Avios) => {
    setModal({ open: true, mode: "edit", avios: row });
  }, []);

  const openView = useCallback((row: Avios) => {
    setModal({ open: true, mode: "view", avios: row });
  }, []);

  const columns = useMemo(() => getColumns(openEdit, openView), [openEdit, openView]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Configuración &gt; Insumos &gt; Avíos</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setBulkOpen(true)}
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Cargar +
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Crear +
          </button>
        </div>
      </div>

      {listError && (
        <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {listError}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando avíos...</p>
      ) : (
        <DataTable columns={columns} data={rows} />
      )}

      <AviosModal
        open={modal.open}
        onOpenChange={(open) =>
          setModal((prev) => ({
            ...prev,
            open,
            avios: open ? prev.avios : null,
          }))
        }
        mode={modal.mode}
        avios={modal.avios}
        onSuccess={fetchList}
      />

      <BulkUploadModal
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        title="Carga masiva de avíos"
        description="Sube un Excel (.xlsx) siguiendo la plantilla. El proveedor se identifica por su código (p.ej. PRV-1)."
        templateUrl="/api/avios/template/download"
        templateFilename="plantilla_avios.xlsx"
        uploadUrl="/api/avios/bulk-upload"
        onSuccess={fetchList}
      />
    </div>
  );
}
