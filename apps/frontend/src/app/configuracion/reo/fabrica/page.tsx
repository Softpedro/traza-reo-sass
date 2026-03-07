"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { getColumns, type Facility } from "./columns";
import { FabricaModal } from "./fabrica-modal";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  facility: Facility | null;
};

export default function FabricaPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    facility: null,
  });

  const fetchFacilities = useCallback(() => {
    setLoading(true);
    fetch(apiUrl("/api/facilities"))
      .then((res) => res.json())
      .then((data) => setFacilities(data))
      .catch((err) => console.error("Error al cargar fábricas:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const openCreate = () =>
    setModal({ open: true, mode: "create", facility: null });

  const openEdit = useCallback(
    (facility: Facility) =>
      setModal({ open: true, mode: "edit", facility }),
    []
  );

  const openView = useCallback(
    (facility: Facility) =>
      setModal({ open: true, mode: "view", facility }),
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
            Configuración &gt; REO &gt; Fábrica
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
        <p className="text-sm text-muted-foreground">Cargando fábricas...</p>
      ) : (
        <DataTable columns={columns} data={facilities} />
      )}

      <FabricaModal
        open={modal.open}
        onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}
        mode={modal.mode}
        facility={modal.facility}
        onSuccess={fetchFacilities}
      />
    </div>
  );
}
