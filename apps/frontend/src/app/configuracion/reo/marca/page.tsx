"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getColumns, type Brand } from "./columns";
import { MarcaModal } from "./marca-modal";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  marca: Brand | null;
};

export default function MarcaPage() {
  const [marcas, setMarcas] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    marca: null,
  });

  const fetchMarcas = useCallback(() => {
    setLoading(true);
    fetch(apiUrl("/api/brands"))
      .then((res) => res.json())
      .then((data) => setMarcas(data))
      .catch((err) => console.error("Error al cargar marcas:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchMarcas();
  }, [fetchMarcas]);

  const openCreate = () =>
    setModal({ open: true, mode: "create", marca: null });

  const openEdit = useCallback(
    (marca: Brand) =>
      setModal({ open: true, mode: "edit", marca }),
    []
  );

  const openView = useCallback(
    (marca: Brand) =>
      setModal({ open: true, mode: "view", marca }),
    []
  );

  const columns = useMemo(
    () => getColumns(openEdit, openView),
    [openEdit, openView]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Configuración &gt; REO &gt; Marca
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
        <p className="text-sm text-muted-foreground">Cargando marcas...</p>
      ) : (
        <DataTable columns={columns} data={marcas} />
      )}

      <MarcaModal
        open={modal.open}
        onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}
        mode={modal.mode}
        marca={modal.marca}
        onSuccess={fetchMarcas}
      />
    </div>
  );
}
