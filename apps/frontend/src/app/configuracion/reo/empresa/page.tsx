"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getColumns, type ParentCompany } from "./columns";
import { EmpresaModal } from "./empresa-modal";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  empresa: ParentCompany | null;
};

export default function EmpresaPage() {
  const [empresas, setEmpresas] = useState<ParentCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    empresa: null,
  });

  const fetchEmpresas = useCallback(() => {
    setLoading(true);
    fetch(apiUrl("/api/parent-companies"))
      .then((res) => res.json())
      .then((data) => setEmpresas(data))
      .catch((err) => console.error("Error al cargar empresas:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  const openCreate = () =>
    setModal({ open: true, mode: "create", empresa: null });

  const openEdit = useCallback(
    (empresa: ParentCompany) =>
      setModal({ open: true, mode: "edit", empresa }),
    []
  );

  const openView = useCallback(
    (empresa: ParentCompany) =>
      setModal({ open: true, mode: "view", empresa }),
    []
  );

  const columns = useMemo(() => getColumns(openEdit, openView), [openEdit, openView]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Configuración &gt; REO &gt; Empresa
          </p>
        </div>
        <button
          onClick={openCreate}
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Crear +
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando empresas...</p>
      ) : (
        <DataTable columns={columns} data={empresas} />
      )}

      <EmpresaModal
        open={modal.open}
        onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}
        mode={modal.mode}
        empresa={modal.empresa}
        onSuccess={fetchEmpresas}
      />
    </div>
  );
}
