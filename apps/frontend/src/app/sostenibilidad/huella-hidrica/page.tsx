"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import { getColumns, type WaterFootprint } from "./columns";
import { HuellaHidricaModal } from "./huella-hidrica-modal";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  footprint: WaterFootprint | null;
};

export default function HuellaHidricaPage() {
  const [rows, setRows] = useState<WaterFootprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    footprint: null,
  });

  const fetchRows = useCallback(() => {
    setLoading(true);
    apiFetch("/api/water-footprints")
      .then((res) => res.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar las huellas hídricas:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const openCreate = () => setModal({ open: true, mode: "create", footprint: null });

  const openEdit = useCallback(
    (footprint: WaterFootprint) => setModal({ open: true, mode: "edit", footprint }),
    []
  );

  const openView = useCallback(
    (footprint: WaterFootprint) => setModal({ open: true, mode: "view", footprint }),
    []
  );

  const columns = useMemo(() => getColumns(openEdit, openView), [openEdit, openView]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Sostenibilidad &gt; Huella Hídrica</p>
        <button
          onClick={openCreate}
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Crear +
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando huellas hídricas...</p>
      ) : (
        <DataTable columns={columns} data={rows} />
      )}

      <HuellaHidricaModal
        open={modal.open}
        onOpenChange={(open) =>
          setModal((prev) => ({ ...prev, open, footprint: open ? prev.footprint : null }))
        }
        mode={modal.mode}
        footprint={modal.footprint}
        onSuccess={fetchRows}
      />
    </div>
  );
}
