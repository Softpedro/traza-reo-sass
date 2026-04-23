"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import type { OrderDetailRow } from "./order-detail-columns";

const BABY_SIZES: { key: keyof OrderDetailRow; label: string }[] = [
  { key: "size0_3", label: "0-3m" },
  { key: "size3_6", label: "3-6m" },
  { key: "size0_6", label: "0-6m" },
  { key: "size6_12", label: "6-12m" },
  { key: "size12_18", label: "12-18m" },
];

const NUMERIC_SIZES: { key: keyof OrderDetailRow; label: string }[] = [
  { key: "size2", label: "2" },
  { key: "size3", label: "3" },
  { key: "size4", label: "4" },
  { key: "size5", label: "5" },
  { key: "size6", label: "6" },
  { key: "size7", label: "7" },
  { key: "size8", label: "8" },
  { key: "size9", label: "9" },
  { key: "size10", label: "10" },
  { key: "size11", label: "11" },
  { key: "size12", label: "12" },
  { key: "size14", label: "14" },
  { key: "size16", label: "16" },
];

const LETTER_SIZES: { key: keyof OrderDetailRow; label: string }[] = [
  { key: "sizeS", label: "S" },
  { key: "sizeM", label: "M" },
  { key: "sizeL", label: "L" },
  { key: "sizeXl", label: "XL" },
  { key: "sizeXxl", label: "XXL" },
];

function q(n: number | null | undefined) {
  if (n == null) return "—";
  return n.toLocaleString("es-PE");
}

function text(v: string | null | undefined) {
  return v?.trim() ? v : "—";
}

function activeRowsFromSet(
  row: OrderDetailRow,
  set: { key: keyof OrderDetailRow; label: string }[]
) {
  return set.filter((s) => {
    const v = row[s.key];
    return typeof v === "number" && v > 0;
  });
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headId: number;
  row: OrderDetailRow | null;
  /** Para cache-busting de la imagen tras edición. */
  imageVersion?: number;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-primary border-b pb-1 mb-2">{title}</h4>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b py-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

export function OrderDetailVerModal({ open, onOpenChange, headId, row, imageVersion = 0 }: Props) {
  if (!open || !row) return null;

  const active = (row.flgStatutActif ?? row.stateOrderDetail) === 1;
  const imgBase = apiUrl(`/api/order-heads/${headId}/details/${row.idDlkOrderDetail}/image`);
  const imgSrc = imageVersion > 0 ? `${imgBase}?v=${imageVersion}` : imgBase;

  const babyActive = activeRowsFromSet(row, BABY_SIZES);
  const numericActive = activeRowsFromSet(row, NUMERIC_SIZES);
  const letterActive = activeRowsFromSet(row, LETTER_SIZES);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Ver línea — {row.codOrderDetail ?? `ID ${row.idDlkOrderDetail}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <Section title="Identificación">
            <dl className="space-y-1">
              <Row label="Orden producción" value={text(row.codOrderDetail)} />
              <Row label="Cod estilo" value={text(row.codEstilo)} />
            </dl>
          </Section>

          <Section title="Datos básicos">
            <dl className="space-y-1">
              <Row label="Estilo" value={text(row.nomEstilo)} />
              <Row label="Tela" value={text(row.desTela)} />
              <Row label="Color way" value={text(row.colorAway)} />
              <Row label="Fondo de tela" value={text(row.fondoTela)} />
              <Row label="Versión tela" value={text(row.versionTela)} />
              <Row label="Orden muestra" value={q(row.orderSample)} />
              <Row label="Total estilo" value={q(row.totalEstilo)} />
            </dl>
          </Section>

          <Section title="Imagen">
            {row.hasImgEstilo ? (
              <div className="flex justify-center py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt={row.nomEstilo ?? "Estilo"}
                  className="max-h-60 rounded border border-border object-contain bg-muted"
                />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Sin imagen</p>
            )}
          </Section>

          <Section title="Tallas bebé (meses)">
            {babyActive.length === 0 ? (
              <p className="text-muted-foreground">—</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {babyActive.map((s) => (
                  <div
                    key={s.key as string}
                    className="rounded border px-2 py-1 text-center bg-muted/40"
                  >
                    <div className="text-[10px] uppercase text-muted-foreground">{s.label}</div>
                    <div className="font-semibold tabular-nums">{q(row[s.key] as number)}</div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Tallas numéricas">
            {numericActive.length === 0 ? (
              <p className="text-muted-foreground">—</p>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {numericActive.map((s) => (
                  <div
                    key={s.key as string}
                    className="rounded border px-2 py-1 text-center bg-muted/40"
                  >
                    <div className="text-[10px] uppercase text-muted-foreground">{s.label}</div>
                    <div className="font-semibold tabular-nums">{q(row[s.key] as number)}</div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Tallas letra">
            {letterActive.length === 0 ? (
              <p className="text-muted-foreground">—</p>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {letterActive.map((s) => (
                  <div
                    key={s.key as string}
                    className="rounded border px-2 py-1 text-center bg-muted/40"
                  >
                    <div className="text-[10px] uppercase text-muted-foreground">{s.label}</div>
                    <div className="font-semibold tabular-nums">{q(row[s.key] as number)}</div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Estado">
            <dl className="space-y-1">
              <Row
                label="Estado del registro"
                value={
                  <span className={active ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {active ? "Activo" : "Inactivo"}
                  </span>
                }
              />
            </dl>
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
