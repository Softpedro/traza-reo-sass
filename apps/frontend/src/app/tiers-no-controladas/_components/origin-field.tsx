"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@fullstack-reo/ui";
import { apiFetch } from "@/lib/api-fetch";

/** ISO 3166-1 alfa-2; los nombres en español los pone Intl.DisplayNames. */
const COUNTRY_CODES =
  "AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(
    " "
  );

const upper = (s: string) => s.toLocaleUpperCase("es");

/** Nombres de país en mayúsculas, como se guardan: "PERÚ", "ESTADOS UNIDOS"… */
const COUNTRIES: string[] = (() => {
  const names = new Intl.DisplayNames(["es"], { type: "region" });
  return COUNTRY_CODES.map((code) => upper(names.of(code) ?? code)).sort((a, b) =>
    a.localeCompare(b, "es")
  );
})();

export const PERU = upper(new Intl.DisplayNames(["es"], { type: "region" }).of("PE") ?? "Perú");

const SEPARATOR = " / ";

/** "LAMBAYEQUE / PERÚ" → { region: "LAMBAYEQUE", country: "PERÚ" }; "CHINA" → sólo país. */
export function parseOrigin(origin: string | null | undefined): { region: string; country: string } {
  if (!origin) return { region: "", country: "" };
  const i = origin.lastIndexOf(SEPARATOR);
  if (i === -1) return { region: "", country: origin.trim() };
  return { region: origin.slice(0, i).trim(), country: origin.slice(i + SEPARATOR.length).trim() };
}

export function formatOrigin(region: string, country: string): string {
  const r = upper(region.trim());
  if (!country) return "";
  return r ? `${r}${SEPARATOR}${country}` : country;
}

type Props = {
  region: string;
  country: string;
  onChange: (next: { region: string; country: string }) => void;
  disabled?: boolean;
};

/**
 * País (lista fija) + región. Para Perú la región es un departamento de MD_UBIGEO;
 * para otro país se escribe a mano y es opcional.
 */
export function OriginField({ region, country, onChange, disabled }: Props) {
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const isPeru = country === PERU;

  useEffect(() => {
    if (!isPeru || departamentos.length > 0) return;
    apiFetch("/api/ubigeo")
      .then((r) => r.json())
      .then((rows: { desDepartamento: string }[]) => {
        const unique = Array.from(new Set(rows.map((r) => upper(r.desDepartamento.trim()))));
        setDepartamentos(unique.sort((a, b) => a.localeCompare(b, "es")));
      })
      .catch((err) => console.error("Error al cargar departamentos:", err));
  }, [isPeru, departamentos.length]);

  // Si el registro trae un país que no está en la lista (dato viejo), se agrega para no perderlo.
  const countries = useMemo(
    () => (country && !COUNTRIES.includes(country) ? [country, ...COUNTRIES] : COUNTRIES),
    [country]
  );
  const departamentoOptions = useMemo(
    () => (region && !departamentos.includes(region) ? [region, ...departamentos] : departamentos),
    [region, departamentos]
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label>Origen: País</Label>
        <Select
          value={country}
          // Al cambiar de país la región anterior deja de valer.
          onValueChange={(c) => onChange({ country: c, region: "" })}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar país" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>{isPeru ? "Departamento" : "Región (opcional)"}</Label>
        {isPeru ? (
          <Select
            value={region}
            onValueChange={(r) => onChange({ country, region: r })}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar departamento" />
            </SelectTrigger>
            <SelectContent>
              {departamentoOptions.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={region}
            onChange={(e) => onChange({ country, region: e.target.value })}
            disabled={disabled || !country}
            maxLength={100}
            placeholder={country ? "Ej. TEXAS" : "Elegí un país primero"}
          />
        )}
      </div>
    </div>
  );
}
