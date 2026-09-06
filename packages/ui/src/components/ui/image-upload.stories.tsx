import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ImageUpload, type ImageUploadValue } from "./image-upload";

/**
 * SVG inline como data URL: la story no depende de ningún archivo externo y se ve
 * igual en cualquier máquina.
 */
const SAMPLE =
  "data:image/svg+xml;base64," +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240">
      <rect width="320" height="240" fill="#1e293b"/>
      <rect x="110" y="50" width="100" height="140" rx="10" fill="#334155"/>
      <rect x="150" y="50" width="20" height="140" fill="#0f172a"/>
      <text x="160" y="220" fill="#94a3b8" font-family="sans-serif" font-size="14"
            text-anchor="middle">Chaqueta m/l</text>
    </svg>`
  );

const meta: Meta<typeof ImageUpload> = {
  title: "UI/ImageUpload",
  component: ImageUpload,
  parameters: { layout: "centered" },
  argTypes: {
    compression: { control: "radio", options: ["photo", "logo", "document", "none"] },
  },
};
export default meta;

type Story = StoryObj<typeof ImageUpload>;

/** Envoltura con estado: el componente es controlado. */
function Demo(props: Partial<React.ComponentProps<typeof ImageUpload>>) {
  const [value, setValue] = React.useState<ImageUploadValue | null>(props.value ?? null);
  const [error, setError] = React.useState<string | null>(null);
  return (
    <div className="w-64">
      <ImageUpload
        label="Frontal"
        {...props}
        value={value}
        onChange={(v) => {
          setValue(v);
          setError(null);
        }}
        onError={setError}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

/** Sin imagen: zona de drop. Acepta clic, arrastrar y pegar. */
export const Vacio: Story = { render: () => <Demo /> };

/** Imagen ya guardada en el servidor: llega por `id`, sin bytes. */
export const Guardada: Story = {
  render: () => <Demo value={{ id: 42, preview: SAMPLE }} />,
};

/** Recién elegida y pendiente de guardar: badge "Sin guardar". */
export const SinGuardar: Story = {
  render: () => (
    <Demo value={{ base64: SAMPLE.split(",")[1], preview: SAMPLE, bytes: 245_000 }} />
  ),
};

/**
 * Sin "Quitar". Es el caso de los logos: su servicio sólo escribe el campo si llega un
 * valor con contenido, así que el botón cambiaría la pantalla sin borrar nada.
 */
export const SinBorrado: Story = {
  render: () => <Demo value={{ id: 42, preview: SAMPLE }} allowRemove={false} />,
};

/** Modo lectura: sin acciones ni zona de drop. */
export const SoloLectura: Story = {
  render: () => <Demo value={{ id: 42, preview: SAMPLE }} disabled />,
};

/** Cómo se compone la grilla de perspectivas del modal de Modelo. */
export const GrillaDePerspectivas: Story = {
  render: function Grid() {
    const PERSPECTIVES = ["Frontal", "Lateral Derecho", "Espalda", "Lateral Izquierdo"];
    const [values, setValues] = React.useState<Record<string, ImageUploadValue | null>>({
      Frontal: { id: 1, preview: SAMPLE },
      "Lateral Derecho": { id: 2, preview: SAMPLE },
      Espalda: { base64: SAMPLE.split(",")[1], preview: SAMPLE, bytes: 310_000 },
    });
    return (
      <div className="grid w-[28rem] grid-cols-2 gap-3">
        {PERSPECTIVES.map((p) => (
          <ImageUpload
            key={p}
            label={p}
            value={values[p] ?? null}
            onChange={(v) => setValues((prev) => ({ ...prev, [p]: v }))}
          />
        ))}
      </div>
    );
  },
};
