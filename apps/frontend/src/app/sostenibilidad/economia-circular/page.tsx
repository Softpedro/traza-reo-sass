"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import { getColumns, type CircularEconomy } from "./columns";
import { EconomiaCircularModal } from "./economia-circular-modal";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  circular: CircularEconomy | null;
};

export default function EconomiaCircularPage() {
  const [rows, setRows] = useState<CircularEconomy[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    circular: null,
  });

  const fetchRows = useCallback(() => {
    setLoading(true);
    apiFetch("/api/circular-economies")
      .then((res) => res.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar la economía circular:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const openCreate = () => setModal({ open: true, mode: "create", circular: null });

  const openEdit = useCallback(
    (circular: CircularEconomy) => setModal({ open: true, mode: "edit", circular }),
    []
  );

  const openView = useCallback(
    (circular: CircularEconomy) => setModal({ open: true, mode: "view", circular }),
    []
  );

  const columns = useMemo(() => getColumns(openEdit, openView), [openEdit, openView]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Sostenibilidad &gt; Economía Circular</p>
        <button
          onClick={openCreate}
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Crear +
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando economía circular...</p>
      ) : (
        <DataTable columns={columns} data={rows} />
      )}

      <EconomiaCircularModal
        open={modal.open}
        onOpenChange={(open) =>
          setModal((prev) => ({ ...prev, open, circular: open ? prev.circular : null }))
        }
        mode={modal.mode}
        circular={modal.circular}
        onSuccess={fetchRows}
      />
    </div>
  );
}
