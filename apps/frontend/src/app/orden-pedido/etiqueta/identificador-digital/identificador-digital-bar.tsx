"use client";

import { useState } from "react";
import { IdentificadorDigitalFormModal } from "./identificador-digital-form-modal";
import { IdentificadorDigitalVerModal } from "./identificador-digital-ver-modal";
import type { DigitalIdentifier } from "./types";

type FormMode = "create" | "edit" | "view";

/**
 * Barra "IDENTIFICADOR DIGITAL: Crear · Actualizar · Ver".
 * El catálogo de identificadores digitales (MD_DIGITAL_IDENTIFIER) es global,
 * por eso la barra no depende de la orden de pedido.
 */
export function IdentificadorDigitalBar() {
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selected, setSelected] = useState<DigitalIdentifier | null>(null);
  const [verOpen, setVerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function openCreate() {
    setSelected(null);
    setFormMode("create");
    setFormOpen(true);
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span className="font-semibold uppercase tracking-wide text-neutral-700">
        Identificador digital:
      </span>
      <button
        type="button"
        className="font-medium text-primary hover:underline"
        onClick={openCreate}
      >
        Crear
      </button>
      <button
        type="button"
        className="font-medium text-primary hover:underline"
        onClick={() => setVerOpen(true)}
      >
        Ver
      </button>

      <IdentificadorDigitalFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        identifier={selected}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />

      <IdentificadorDigitalVerModal
        open={verOpen}
        onOpenChange={setVerOpen}
        refreshKey={refreshKey}
        onEdit={(row) => {
          setSelected(row);
          setFormMode("edit");
          setFormOpen(true);
        }}
        onView={(row) => {
          setSelected(row);
          setFormMode("view");
          setFormOpen(true);
        }}
      />
    </div>
  );
}
