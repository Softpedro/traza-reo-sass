"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTable } from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import { TIER_CONFIG, type TierNumber } from "./tier-config";
import type { PresetOrder, UncontrolledLayer } from "./types";
import { getColumns, getTier2Columns, groupTier2 } from "./tier-columns";
import { TierModal, type TierModalMode } from "./tier-modal";

type ModalState = {
  open: boolean;
  mode: TierModalMode;
  record: UncontrolledLayer | null;
  preset: { order: PresetOrder; service?: number } | null;
};

const closed: ModalState = { open: false, mode: "create", record: null, preset: null };

/** Página de un tier no controlado: tabla + modal Crear/Actualizar/Ver. */
export function TierPage({ tier }: { tier: TierNumber }) {
  const config = TIER_CONFIG[tier];
  const [rows, setRows] = useState<UncontrolledLayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(closed);

  const fetchRows = useCallback(() => {
    setLoading(true);
    apiFetch(`/api/uncontrolled-layers?tier=${tier}`)
      .then((res) => res.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => console.error(`Error al cargar Tier ${tier}:`, err))
      .finally(() => setLoading(false));
  }, [tier]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const openCreate = () => setModal({ ...closed, open: true });

  const openEdit = useCallback(
    (record: UncontrolledLayer) => setModal({ ...closed, open: true, mode: "edit", record }),
    []
  );

  const openView = useCallback(
    (record: UncontrolledLayer) => setModal({ ...closed, open: true, mode: "view", record }),
    []
  );

  const openCreateFor = useCallback(
    (order: PresetOrder, service: number) =>
      setModal({ ...closed, open: true, preset: { order, service } }),
    []
  );

  const table = useMemo(
    () =>
      tier === 2 ? (
        <DataTable columns={getTier2Columns(openEdit, openView, openCreateFor)} data={groupTier2(rows)} />
      ) : (
        <DataTable columns={getColumns(tier, openEdit, openView)} data={rows} />
      ),
    [tier, rows, openEdit, openView, openCreateFor]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Tiers no controladas &gt; Tier {tier} - {config.title}
        </p>
        <button
          onClick={openCreate}
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          Crear +
        </button>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">Cargando Tier {tier}...</p> : table}

      <TierModal
        config={config}
        open={modal.open}
        onOpenChange={(open) => setModal((prev) => (open ? { ...prev, open } : closed))}
        mode={modal.mode}
        record={modal.record}
        preset={modal.preset}
        existing={rows}
        onSuccess={fetchRows}
      />
    </div>
  );
}
