"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { getColumns, type UserReo } from "./columns";
import { UsuarioModal } from "./usuario-modal";

type ModalState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  usuario: UserReo | null;
};

export default function UsuarioPage() {
  const [usuarios, setUsuarios] = useState<UserReo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    usuario: null,
  });

  const fetchUsuarios = useCallback(() => {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Error al cargar usuarios:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const openCreate = () =>
    setModal({ open: true, mode: "create", usuario: null });

  const openEdit = useCallback(
    (usuario: UserReo) =>
      setModal({ open: true, mode: "edit", usuario }),
    []
  );

  const openView = useCallback(
    (usuario: UserReo) =>
      setModal({ open: true, mode: "view", usuario }),
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
            Configuración &gt; REO &gt; Usuario
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
        <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
      ) : (
        <DataTable columns={columns} data={usuarios} />
      )}

      <UsuarioModal
        open={modal.open}
        onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}
        mode={modal.mode}
        usuario={modal.usuario}
        onSuccess={fetchUsuarios}
      />
    </div>
  );
}
