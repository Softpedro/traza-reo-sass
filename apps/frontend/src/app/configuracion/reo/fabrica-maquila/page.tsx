"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { getColumns, type FacilityMaquila } from "./columns";
import { FabricaMaquilaModal } from "./fabrica-maquila-modal";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  item: FacilityMaquila | null;
};

export default function FabricaMaquilaPage() {
  const [items, setItems] = useState<FacilityMaquila[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    item: null,
  });

  const fetchItems = useCallback(() => {
    setLoading(true);
    fetch("/api/facilities-maquila")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error al cargar fábricas de maquila:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () =>
    setModal({ open: true, mode: "create", item: null });

  const openEdit = useCallback(
    (item: FacilityMaquila) =>
      setModal({ open: true, mode: "edit", item }),
    []
  );

  const openView = useCallback(
    (item: FacilityMaquila) =>
      setModal({ open: true, mode: "view", item }),
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
            Configuración &gt; REO &gt; Fábrica de Maquila
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
        <p className="text-sm text-muted-foreground">
          Cargando fábricas de maquila...
        </p>
      ) : (
        <DataTable columns={columns} data={items} />
      )}

      <FabricaMaquilaModal
        open={modal.open}
        onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}
        mode={modal.mode}
        item={modal.item}
        onSuccess={fetchItems}
      />
    </div>
  );
}
