"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import { getColumns, type SocialImpact } from "./columns";
import { ImpactoSocialModal } from "./impacto-social-modal";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  impact: SocialImpact | null;
};

export default function ImpactoSocialPage() {
  const [rows, setRows] = useState<SocialImpact[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    impact: null,
  });

  const fetchRows = useCallback(() => {
    setLoading(true);
    apiFetch("/api/social-impacts")
      .then((res) => res.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar el impacto social:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const openCreate = () => setModal({ open: true, mode: "create", impact: null });

  const openEdit = useCallback(
    (impact: SocialImpact) => setModal({ open: true, mode: "edit", impact }),
    []
  );

  const openView = useCallback(
    (impact: SocialImpact) => setModal({ open: true, mode: "view", impact }),
    []
  );

  const columns = useMemo(() => getColumns(openEdit, openView), [openEdit, openView]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Sostenibilidad &gt; Impacto Social</p>
        <button
          onClick={openCreate}
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Crear +
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando impacto social...</p>
      ) : (
        <DataTable columns={columns} data={rows} />
      )}

      <ImpactoSocialModal
        open={modal.open}
        onOpenChange={(open) =>
          setModal((prev) => ({ ...prev, open, impact: open ? prev.impact : null }))
        }
        mode={modal.mode}
        impact={modal.impact}
        onSuccess={fetchRows}
      />
    </div>
  );
}
