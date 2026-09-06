"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Label,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@fullstack-reo/ui";
import { apiUrl } from "@/lib/api";
import { ImageUpload, type ImageUploadValue } from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";
import type { UserReo } from "./columns";
import { POSITION_USER_LABELS, ROL_USER_LABELS } from "./columns";

function photoSrcFromApi(photo: string | null | undefined): string | null {
  if (photo == null || photo === "") return null;
  if (photo.startsWith("data:")) return photo;
  return `data:image/png;base64,${photo}`;
}

type ModalMode = "create" | "edit" | "view";

interface UsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ModalMode;
  usuario?: UserReo | null;
  onSuccess: () => void;
}

type ParentCompanyOption = {
  idDlkParentCompany: number;
  codParentCompany: string;
  nameParentCompany: string;
};

const DOCUMENT_TYPES: Record<number, string> = {
  1: "DNI",
  2: "CE",
  3: "Pasaporte",
};

const SEX_OPTIONS: Record<string, string> = {
  M: "Masculino",
  F: "Femenino",
  O: "Otro",
};

const emptyForm = {
  idDlkParentCompany: 0,
  codParentCompany: "",
  documentType: 1,
  documentNumber: "",
  nameUser: "",
  paternalLastNameUser: "",
  maternalLastNameUser: "",
  sexUser: "M",
  positionUser: 1,
  rolUser: 1,
  emailUser: "",
  cellularUser: "",
  userLogin: "",
  password: "",
  photograph: "",
  stateUser: 1,
};

export function UsuarioModal({
  open,
  onOpenChange,
  mode,
  usuario,
  onSuccess,
}: UsuarioModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [detailUser, setDetailUser] = useState<UserReo | null>(null);
  const [empresas, setEmpresas] = useState<ParentCompanyOption[]>([]);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    apiFetch("/api/parent-companies")
      .then((res) => res.json())
      .then((data: ParentCompanyOption[]) => setEmpresas(data))
      .catch((err) => console.error("Error al cargar empresas:", err));
  }, [open]);

  useEffect(() => {
    if (!open) {
      setDetailUser(null);
      return;
    }

    if (mode === "create") {
      setForm(emptyForm);
      setDetailUser(null);
      setPhotoPreview(null);
    setPhotoRemoved(false);
      setPhotoRemoved(false);
      return;
    }

    if (!usuario?.idDlkUserReo) return;

    function userRowToForm(u: UserReo) {
      const sex = u.sexUser && ["M", "F", "O"].includes(u.sexUser) ? u.sexUser : "M";
      const pos = Number(u.positionUser);
      const rol = Number(u.rolUser);
      return {
        idDlkParentCompany: u.parentCompany?.idDlkParentCompany ?? 0,
        codParentCompany: u.codParentCompany ?? u.parentCompany?.codParentCompany ?? "",
        documentType: Number(u.documentType) > 0 ? Number(u.documentType) : 1,
        documentNumber: u.documentNumber ?? "",
        nameUser: u.nameUser ?? "",
        paternalLastNameUser: u.paternalLastNameUser ?? "",
        maternalLastNameUser: u.maternalLastNameUser ?? "",
        sexUser: sex,
        positionUser: pos >= 1 && pos <= 3 ? pos : 1,
        rolUser: rol >= 1 && rol <= 3 ? rol : 1,
        emailUser: u.emailUser ?? "",
        cellularUser: u.cellularUser ?? "",
        userLogin: u.userLogin ?? "",
        password: "",
        photograph: "",
        stateUser: u.stateUser === 1 ? 1 : 0,
      };
    }

    setPhotoPreview(null);
    setPhotoRemoved(false);
    setForm(userRowToForm(usuario));
    setDetailUser(null);

    let cancelled = false;
    void (async () => {
      try {
        const res = await apiFetch(`/api/users/${usuario.idDlkUserReo}`);
        if (!res.ok) return;
        const detail = (await res.json()) as UserReo;
        if (cancelled) return;
        setForm(userRowToForm(detail));
        setDetailUser(detail);
      } catch {
        if (!cancelled) setDetailUser(usuario);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, mode, usuario]);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleEmpresaChange(idStr: string) {
    const id = Number(idStr);
    const e = empresas.find((em) => em.idDlkParentCompany === id);
    setForm((prev) => ({
      ...prev,
      idDlkParentCompany: id,
      codParentCompany: e?.codParentCompany ?? "",
    }));
  }

  async function handleSubmit() {
    if (!form.idDlkParentCompany || !form.codParentCompany) {
      alert("Debes seleccionar la empresa");
      return;
    }
    if (!form.documentNumber.trim()) {
      alert("El número de documento es obligatorio");
      return;
    }
    if (!form.nameUser.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    if (!form.userLogin.trim()) {
      alert("El usuario es obligatorio");
      return;
    }
    if (mode === "create" && !form.password.trim()) {
      alert("La contraseña es obligatoria");
      return;
    }

    setSaving(true);
    try {
      const url =
        mode === "edit"
          ? apiUrl(`/api/users/${usuario!.idDlkUserReo}`)
          : apiUrl("/api/users");
      const method = mode === "edit" ? "PUT" : "POST";

      const payload: Record<string, unknown> = {
        ...form,
        idDlkParentCompany: Number(form.idDlkParentCompany),
        documentType: Number(form.documentType),
        positionUser: Number(form.positionUser),
        rolUser: Number(form.rolUser),
        stateUser: Number(form.stateUser),
      };
      // Vacío significa dos cosas distintas: sin cambios (la clave ausente le dice al
      // backend que no toque el campo) o quitada (null explícito para que la borre).
      if (!payload.photograph) {
        if (photoRemoved) (payload as Record<string, unknown>).photograph = null;
        else delete (payload as Record<string, unknown>).photograph;
      }
      if (mode === "edit" && !form.password.trim()) {
        delete payload.password;
      }

      const res = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.type === "DB_CONNECTION") {
          throw new Error("Error de conexión a la base de datos. Verifica que el servidor de BD esté activo.");
        }
        if (body?.type === "VALIDATION") {
          throw new Error(body.error);
        }
        throw new Error(body?.error ?? `Error ${res.status} al guardar`);
      }

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error al guardar el usuario");
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Crear Usuario"
      : mode === "edit"
        ? "Editar Usuario"
        : "Detalle de Usuario";

  const selectedEmpresa = empresas.find((e) => e.idDlkParentCompany === form.idDlkParentCompany);

  const storedPhotoSrc =
    mode !== "create" && (detailUser?.photograph ?? usuario?.photograph)
      ? photoSrcFromApi(detailUser?.photograph ?? usuario?.photograph)
      : null;
  /**
   * `base64` sólo cuando el usuario eligió un archivo nuevo; si no, se muestra el
   * guardado sin reenviar sus bytes. `photoRemoved` distingue "quitada" de "sin cambios":
   * ambas dejan el campo del form vacío, pero sólo la primera manda null para borrar.
   */
  const photoValue: ImageUploadValue | null = photoPreview
    ? { base64: form.photograph, preview: photoPreview }
    : !photoRemoved && storedPhotoSrc
      ? { preview: storedPhotoSrc }
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa los campos para registrar un nuevo usuario."
              : mode === "edit"
                ? "Modifica los campos que necesites actualizar."
                : "Información del usuario."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {mode === "view" && usuario && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Código:</Label>
              <span className="col-span-3">{usuario.codUserReo}</span>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Empresa:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <Input
                  readOnly
                  value={
                    selectedEmpresa
                      ? `${selectedEmpresa.codParentCompany} - ${selectedEmpresa.nameParentCompany}`
                      : usuario?.parentCompany
                        ? `${usuario.parentCompany.codParentCompany} - ${usuario.parentCompany.nameParentCompany}`
                        : ""
                  }
                />
              ) : (
                <Select
                  value={form.idDlkParentCompany ? String(form.idDlkParentCompany) : ""}
                  onValueChange={handleEmpresaChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((e) => (
                      <SelectItem key={e.idDlkParentCompany} value={String(e.idDlkParentCompany)}>
                        {e.codParentCompany} - {e.nameParentCompany}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Tipo de documento:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <Input readOnly value={DOCUMENT_TYPES[form.documentType]} />
              ) : (
                <Select
                  value={String(form.documentType)}
                  onValueChange={(v) => handleChange("documentType", Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DOCUMENT_TYPES).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Nro. Documento:</Label>
            <Input
              className="col-span-3"
              value={form.documentNumber}
              onChange={(e) => handleChange("documentNumber", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Nombre:</Label>
            <Input
              className="col-span-3"
              value={form.nameUser}
              onChange={(e) => handleChange("nameUser", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Apellido Paterno:</Label>
            <Input
              className="col-span-3"
              value={form.paternalLastNameUser}
              onChange={(e) => handleChange("paternalLastNameUser", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Apellido Materno:</Label>
            <Input
              className="col-span-3"
              value={form.maternalLastNameUser}
              onChange={(e) => handleChange("maternalLastNameUser", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Sexo:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <Input readOnly value={SEX_OPTIONS[form.sexUser] ?? form.sexUser} />
              ) : (
                <Select
                  value={form.sexUser}
                  onValueChange={(v) => handleChange("sexUser", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SEX_OPTIONS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Cargo:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <Input
                  readOnly
                  value={
                    POSITION_USER_LABELS[form.positionUser] ?? `Cargo ${form.positionUser}`
                  }
                />
              ) : (
                <Select
                  value={String(form.positionUser)}
                  onValueChange={(v) => handleChange("positionUser", Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(POSITION_USER_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Rol:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <Input
                  readOnly
                  value={ROL_USER_LABELS[form.rolUser] ?? `Rol ${form.rolUser}`}
                />
              ) : (
                <Select
                  value={String(form.rolUser)}
                  onValueChange={(v) => handleChange("rolUser", Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROL_USER_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Correo:</Label>
            <Input
              className="col-span-3"
              type="email"
              value={form.emailUser}
              onChange={(e) => handleChange("emailUser", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Usuario:</Label>
            <Input
              className="col-span-3"
              value={form.userLogin}
              onChange={(e) => handleChange("userLogin", e.target.value)}
              readOnly={readOnly}
            />
          </div>

          {!readOnly && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Contraseña:</Label>
              <div className="col-span-3 space-y-1">
                <Input
                  className="col-span-3"
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder={mode === "edit" ? "Dejar vacío para no cambiar" : ""}
                  autoComplete={mode === "create" ? "new-password" : "new-password"}
                />
                {mode === "edit" && (
                  <p className="text-xs text-muted-foreground">
                    Solo completa si quieres cambiar la contraseña.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right text-primary font-semibold pt-2">Foto:</Label>
            <div className="col-span-3 space-y-3">
              <div className="max-w-[15rem]">
                <ImageUpload
                  value={photoValue}
                  disabled={readOnly}
                  compression="logo"
                  onChange={(v) => {
                    setForm((prev) => ({ ...prev, photograph: v?.base64 ?? "" }));
                    setPhotoPreview(v?.base64 ? (v.preview ?? null) : null);
                    setPhotoRemoved(v === null);
                  }}
                  onError={(m) => alert(m)}
                />
              </div>
            </div>
          </div>

          {(mode === "edit" || mode === "view") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Estado:</Label>
              <div className="col-span-3">
                {readOnly ? (
                  <span
                    className={`font-medium ${
                      form.stateUser === 1 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {form.stateUser === 1 ? "Activa" : "Desactivada"}
                  </span>
                ) : (
                  <Select
                    value={String(form.stateUser)}
                    onValueChange={(v) => handleChange("stateUser", Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Activa</SelectItem>
                      <SelectItem value="0">Desactivada</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          )}
        </div>

        {!readOnly && (
          <div className="flex justify-center pt-2">
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

