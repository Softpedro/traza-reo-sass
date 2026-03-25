"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getColumns, type Supplier } from "./columns";
import { ProveedorModal } from "./proveedor-modal";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  proveedor: Supplier | null;
};

export default function ProveedoresPage() {
  const [rows, setRows] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    proveedor: null,
  });

  const fetchList = useCallback(() => {
    setLoading(true);
    fetch(apiUrl("/api/suppliers"))
      .then((res) => res.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar proveedores:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const openCreate = () => setModal({ open: true, mode: "create", proveedor: null });

  const openEdit = useCallback((proveedor: Supplier) => {
    setModal({ open: true, mode: "edit", proveedor });
  }, []);

  const openView = useCallback((proveedor: Supplier) => {
    setModal({ open: true, mode: "view", proveedor });
  }, []);

  const columns = useMemo(() => getColumns(openEdit, openView), [openEdit, openView]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Configuración &gt; Insumos &gt; Proveedores</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Crear +
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando proveedores...</p>
      ) : (
        <DataTable columns={columns} data={rows} />
      )}

      <ProveedorModal
        open={modal.open}
        onOpenChange={(open) =>
          setModal((prev) => ({
            ...prev,
            open,
            proveedor: open ? prev.proveedor : null,
          }))
        }
        mode={modal.mode}
        proveedor={modal.proveedor}
        onSuccess={fetchList}
      />
    </div>
  );
}
