"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getColumns, type Material } from "./columns";
import { MaterialModal } from "./material-modal";
import { BulkUploadModal } from "@/components/bulk-upload-modal";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  material: Material | null;
};

export default function MaterialesPage() {
  const [rows, setRows] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    material: null,
  });
  const [bulkOpen, setBulkOpen] = useState(false);

  const fetchList = useCallback(() => {
    setLoading(true);
    setListError(null);
    fetch(apiUrl("/api/materials"))
      .then(async (res) => {
        const data: unknown = await res.json();
        if (!res.ok) {
          setListError(
            typeof data === "object" && data && "error" in data && typeof (data as { error: unknown }).error === "string"
              ? (data as { error: string }).error
              : `Error ${res.status} al cargar materiales`
          );
          setRows([]);
          return;
        }
        setRows(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error al cargar materiales:", err);
        setListError("No se pudo cargar la lista de materiales.");
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const openCreate = () => setModal({ open: true, mode: "create", material: null });

  const openEdit = useCallback((material: Material) => {
    setModal({ open: true, mode: "edit", material });
  }, []);

  const openView = useCallback((material: Material) => {
    setModal({ open: true, mode: "view", material });
  }, []);

  const columns = useMemo(() => getColumns(openEdit, openView), [openEdit, openView]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Configuración &gt; Insumos &gt; Materiales</p>
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
        <p className="text-sm text-muted-foreground">Cargando materiales...</p>
      ) : (
        <DataTable columns={columns} data={rows} />
      )}

      <MaterialModal
        open={modal.open}
        onOpenChange={(open) =>
          setModal((prev) => ({
            ...prev,
            open,
            material: open ? prev.material : null,
          }))
        }
        mode={modal.mode}
        material={modal.material}
        onSuccess={fetchList}
      />

      <BulkUploadModal
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        title="Carga masiva de materiales"
        description="Sube un Excel (.xlsx) siguiendo la plantilla. El proveedor se identifica por su código (p.ej. PRV-1)."
        templateUrl="/api/materials/template/download"
        templateFilename="plantilla_materiales.xlsx"
        uploadUrl="/api/materials/bulk-upload"
        onSuccess={fetchList}
      />
    </div>
  );
}
