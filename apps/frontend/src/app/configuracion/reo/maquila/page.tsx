"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { getColumns, type Maquila } from "./columns";
import { MaquilaModal } from "./maquila-modal";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  maquila: Maquila | null;
};

export default function MaquilaPage() {
  const [maquilas, setMaquilas] = useState<Maquila[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    maquila: null,
  });

  const fetchMaquilas = useCallback(() => {
    setLoading(true);
    fetch("/api/maquilas")
      .then((res) => res.json())
      .then((data) => setMaquilas(data))
      .catch((err) => console.error("Error al cargar maquilas:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchMaquilas();
  }, [fetchMaquilas]);

  const openCreate = () =>
    setModal({ open: true, mode: "create", maquila: null });

  const openEdit = useCallback(
    (maquila: Maquila) =>
      setModal({ open: true, mode: "edit", maquila }),
    []
  );

  const openView = useCallback(
    (maquila: Maquila) =>
      setModal({ open: true, mode: "view", maquila }),
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
            Configuración &gt; REO &gt; Maquila
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
        <p className="text-sm text-muted-foreground">Cargando maquilas...</p>
      ) : (
        <DataTable columns={columns} data={maquilas} />
      )}

      <MaquilaModal
        open={modal.open}
        onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}
        mode={modal.mode}
        maquila={modal.maquila}
        onSuccess={fetchMaquilas}
      />
    </div>
  );
}
