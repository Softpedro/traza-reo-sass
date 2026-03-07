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
import type { UserReo } from "./columns";

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

const ROL_LABELS: Record<number, string> = {
  1: "Rol 1",
  2: "Rol 2",
  3: "Rol 3",
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
  positionUser: 0,
  rolUser: 1,
  emailUser: "",
  cellularUser: "",
  userLogin: "",
  password: "",
  photograph: "",
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
  const [empresas, setEmpresas] = useState<ParentCompanyOption[]>([]);
  const readOnly = mode === "view";

  useEffect(() => {
    if (!open) return;
    fetch(apiUrl("/api/parent-companies"))
      .then((res) => res.json())
      .then((data: ParentCompanyOption[]) => setEmpresas(data))
      .catch((err) => console.error("Error al cargar empresas:", err));
  }, [open]);

  useEffect(() => {
    if (usuario && (mode === "edit" || mode === "view")) {
      setForm({
        idDlkParentCompany: usuario.parentCompany?.idDlkParentCompany ?? 0,
        codParentCompany: usuario.parentCompany?.codParentCompany ?? "",
        documentType: 1,
        documentNumber: "",
        nameUser: usuario.nameUser,
        paternalLastNameUser: usuario.paternalLastNameUser,
        maternalLastNameUser: usuario.maternalLastNameUser,
        sexUser: "M",
        positionUser: usuario.positionUser,
        rolUser: usuario.rolUser,
        emailUser: usuario.emailUser,
        cellularUser: "",
        userLogin: "",
        password: "",
        photograph: "",
      });
      setPhotoPreview(null);
    } else {
      setForm(emptyForm);
      setPhotoPreview(null);
    }
  }, [usuario, mode, open]);

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

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      setForm((prev) => ({ ...prev, photograph: base64 }));
      setPhotoPreview(result);
    };
    reader.readAsDataURL(file);
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

      const payload: Record<string, unknown> = { ...form };
      if (!payload.photograph) {
        delete payload.photograph;
      }
      if (mode === "edit" && !form.password.trim()) {
        delete payload.password;
      }

      const res = await fetch(url, {
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
            <Input
              className="col-span-3"
              value={form.positionUser}
              onChange={(e) => handleChange("positionUser", Number(e.target.value) || 0)}
              readOnly={readOnly}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Rol:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <Input readOnly value={ROL_LABELS[form.rolUser] ?? `Rol ${form.rolUser}`} />
              ) : (
                <Select
                  value={String(form.rolUser)}
                  onValueChange={(v) => handleChange("rolUser", Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROL_LABELS).map(([k, v]) => (
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
              <Input
                className="col-span-3"
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-primary font-semibold">Foto:</Label>
            <div className="col-span-3">
              {readOnly ? (
                <span className="text-sm text-muted-foreground">
                  {usuario ? "Archivo cargado" : "Sin foto"}
                </span>
              ) : (
                <div className="space-y-2">
                  <Input type="file" accept="image/*" onChange={handlePhotoChange} />
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Foto"
                      className="h-16 w-16 rounded-full object-cover border"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {mode === "view" && usuario && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-primary font-semibold">Estado:</Label>
              <span
                className={`col-span-3 font-medium ${
                  usuario.stateUser === 1 ? "text-green-600" : "text-red-600"
                }`}
              >
                {usuario.stateUser === 1 ? "Online" : "Offline"}
              </span>
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

