"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getColumns, type Subbrand } from "./columns";
import { SubmarcaModal } from "./submarca-modal";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  item: Subbrand | null;
};

export default function SubmarcaPage() {
  const [items, setItems] = useState<Subbrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    item: null,
  });

  const fetchItems = useCallback(() => {
    setLoading(true);
    fetch(apiUrl("/api/subbrands"))
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error al cargar submarcas:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () =>
    setModal({ open: true, mode: "create", item: null });

  const openEdit = useCallback(
    (item: Subbrand) =>
      setModal({ open: true, mode: "edit", item }),
    []
  );

  const openView = useCallback(
    (item: Subbrand) =>
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
            Configuración &gt; REO &gt; Submarca
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
        <p className="text-sm text-muted-foreground">Cargando submarcas...</p>
      ) : (
        <DataTable columns={columns} data={items} />
      )}

      <SubmarcaModal
        open={modal.open}
        onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}
        mode={modal.mode}
        item={modal.item}
        onSuccess={fetchItems}
      />
    </div>
  );
}
