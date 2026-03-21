"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Label,
} from "@fullstack-reo/ui";
import { useEffect, useMemo, useState } from "react";

export type UbigeoOption = {
  codUbigeo: number;
  desDepartamento: string;
  desProvincia: string;
  desDistrito: string;
};

interface UbigeoSelectorProps {
  label?: string;
  value: number;
  onChange: (codUbigeo: number) => void;
  ubigeos: UbigeoOption[];
  readOnly?: boolean;
}

export function UbigeoSelector({
  label = "Ubigeo",
  value,
  onChange,
  ubigeos,
  readOnly,
}: UbigeoSelectorProps) {
  const [departamento, setDepartamento] = useState<string>("");
  const [provincia, setProvincia] = useState<string>("");
  const [distrito, setDistrito] = useState<string>("");

  useEffect(() => {
    if (!value) {
      setDepartamento("");
      setProvincia("");
      setDistrito("");
      return;
    }
    const v = Number(value);
    const found = ubigeos.find((u) => Number(u.codUbigeo) === v);
    if (found) {
      setDepartamento(found.desDepartamento);
      setProvincia(found.desProvincia);
      setDistrito(found.desDistrito);
    }
  }, [value, ubigeos]);

  const departamentos = useMemo(
    () =>
      Array.from(
        new Set(ubigeos.map((u) => u.desDepartamento)),
      ).sort(),
    [ubigeos],
  );

  const provincias = useMemo(
    () =>
      ubigeos
        .filter((u) => !departamento || u.desDepartamento === departamento)
        .map((u) => u.desProvincia)
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .sort(),
    [ubigeos, departamento],
  );

  const distritos = useMemo(
    () =>
      ubigeos
        .filter(
          (u) =>
            (!departamento || u.desDepartamento === departamento) &&
            (!provincia || u.desProvincia === provincia),
        )
        .map((u) => u.desDistrito)
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .sort(),
    [ubigeos, departamento, provincia],
  );

  function handleDepartamentoChange(dep: string) {
    setDepartamento(dep);
    setProvincia("");
    setDistrito("");
    onChange(0);
  }

  function handleProvinciaChange(prov: string) {
    setProvincia(prov);
    setDistrito("");
    onChange(0);
  }

  function handleDistritoChange(dist: string) {
    setDistrito(dist);
    const found = ubigeos.find(
      (u) =>
        u.desDepartamento === departamento &&
        u.desProvincia === provincia &&
        u.desDistrito === dist,
    );
    if (found) onChange(found.codUbigeo);
  }

  if (readOnly) {
    const v = Number(value);
    const found = ubigeos.find((u) => Number(u.codUbigeo) === v);
    return (
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right text-primary font-semibold">{label}:</Label>
        <span className="col-span-3">
          {found
            ? `${found.desDepartamento} / ${found.desProvincia} / ${found.desDistrito}`
            : value || ""}
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right text-primary font-semibold">{label}:</Label>
      <div className="col-span-3 flex flex-col gap-2 sm:flex-row">
        <Select
          value={departamento}
          onValueChange={handleDepartamentoChange}
        >
          <SelectTrigger className="w-full sm:w-1/3">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            {departamentos.map((dep) => (
              <SelectItem key={dep} value={dep}>
                {dep}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={provincia}
          onValueChange={handleProvinciaChange}
          disabled={!departamento}
        >
          <SelectTrigger className="w-full sm:w-1/3">
            <SelectValue placeholder="Provincia" />
          </SelectTrigger>
          <SelectContent>
            {provincias.map((prov) => (
              <SelectItem key={prov} value={prov}>
                {prov}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={distrito}
          onValueChange={handleDistritoChange}
          disabled={!provincia}
        >
          <SelectTrigger className="w-full sm:w-1/3">
            <SelectValue placeholder="Distrito" />
          </SelectTrigger>
          <SelectContent>
            {distritos.map((dist) => (
              <SelectItem key={dist} value={dist}>
                {dist}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

