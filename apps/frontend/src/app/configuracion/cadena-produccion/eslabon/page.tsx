"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getColumns, type Eslabon } from "./columns";
import { EslabonModal } from "./eslabon-modal";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  eslabon: Eslabon | null;
};

export default function EslabonPage() {
  const [items, setItems] = useState<Eslabon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    eslabon: null,
  });

  const fetchItems = useCallback(() => {
    setLoading(true);
    fetch(apiUrl("/api/production-chains"))
      .then((res) => res.json())
      .then((data: Eslabon[]) => setItems(data))
      .catch((err) => console.error("Error al cargar eslabones:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const s = search.trim();
    return items.filter(
      (row) =>
        row.nameProductionChain.startsWith(s) ||
        row.codProductionChain.startsWith(s) ||
        row.desProductionChain?.startsWith(s)
    );
  }, [items, search]);

  const openCreate = () => setModal({ open: true, mode: "create", eslabon: null });
  const openEdit = useCallback((eslabon: Eslabon) => setModal({ open: true, mode: "edit", eslabon }), []);
  const columns = useMemo(() => getColumns(openEdit), [openEdit]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Configuración &gt; Cadena de Producción &gt; Eslabón
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="case sensitivo al inicio de la palabra"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Crear +
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando eslabones...</p>
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}

      <EslabonModal
        open={modal.open}
        onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}
        mode={modal.mode}
        eslabon={modal.eslabon}
        onSuccess={fetchItems}
      />
    </div>
  );
}
