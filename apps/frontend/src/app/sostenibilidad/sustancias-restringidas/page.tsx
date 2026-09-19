"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import { getColumns, type RestrictedSubstances } from "./columns";
import { SustanciasRestringidasModal } from "./sustancias-restringidas-modal";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  substances: RestrictedSubstances | null;
};

export default function SustanciasRestringidasPage() {
  const [rows, setRows] = useState<RestrictedSubstances[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    substances: null,
  });

  const fetchRows = useCallback(() => {
    setLoading(true);
    apiFetch("/api/restricted-substances")
      .then((res) => res.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar las sustancias restringidas:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const openCreate = () => setModal({ open: true, mode: "create", substances: null });

  const openEdit = useCallback(
    (substances: RestrictedSubstances) => setModal({ open: true, mode: "edit", substances }),
    []
  );

  const openView = useCallback(
    (substances: RestrictedSubstances) => setModal({ open: true, mode: "view", substances }),
    []
  );

  const columns = useMemo(() => getColumns(openEdit, openView), [openEdit, openView]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Sostenibilidad &gt; Sustancias Restringidas</p>
        <button
          onClick={openCreate}
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Crear +
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando sustancias restringidas...</p>
      ) : (
        <DataTable columns={columns} data={rows} />
      )}

      <SustanciasRestringidasModal
        open={modal.open}
        onOpenChange={(open) =>
          setModal((prev) => ({ ...prev, open, substances: open ? prev.substances : null }))
        }
        mode={modal.mode}
        substances={modal.substances}
        onSuccess={fetchRows}
      />
    </div>
  );
}
