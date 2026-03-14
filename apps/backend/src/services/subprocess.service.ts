import type { PrismaClient } from "../../generated/prisma/client.js";

export class SubprocessService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return this.prisma.mdSubprocess.findMany({
      where: { flgStatutActif: 1 },
      include: {
        process: {
          include: {
            productionChain: true,
          },
        },
      },
      orderBy: [
        { process: { ordenPrecedenciaProcess: "asc" } },
        { ordenPrecedenciaSubprocess: "asc" },
        { idDlkSubprocess: "asc" },
      ],
    });
  }

  async getById(id: number) {
    return this.prisma.mdSubprocess.findUnique({
      where: { idDlkSubprocess: id },
      include: {
        process: {
          include: {
            productionChain: true,
          },
        },
      },
    });
  }

  async create(data: {
    idDlkProcess: number;
    ordenPrecedenciaSubprocess?: number | null;
    codSubprocess?: string;
    nameSubprocess: string;
    descriptionSubprocess?: string;
    objectiveSubprocess?: string | null;
    criticalitySubprocess?: string | null;
    outsourcedSubprocess?: string | null;
    estimatedTimeSubprocess?: number | null;
    responsibleUnit?: string | null;
    responsibleRole?: string | null;
    certificationSubprocess?: string | null;
    stateSubprocess?: number;
  }) {
    return this.prisma.mdSubprocess.create({
      data: {
        idDlkProcess: data.idDlkProcess,
        ordenPrecedenciaSubprocess: data.ordenPrecedenciaSubprocess ?? null,
        codSubprocess: data.codSubprocess?.trim() ?? "",
        nameSubprocess: data.nameSubprocess,
        descriptionSubprocess: data.descriptionSubprocess ?? "",
        objectiveSubprocess: data.objectiveSubprocess ?? null,
        criticalitySubprocess: data.criticalitySubprocess ?? null,
        outsourcedSubprocess: data.outsourcedSubprocess ?? null,
        estimatedTimeSubprocess: data.estimatedTimeSubprocess ?? null,
        responsibleUnit: data.responsibleUnit ?? null,
        responsibleRole: data.responsibleRole ?? null,
        certificationSubprocess: data.certificationSubprocess ?? null,
        stateSubprocess: data.stateSubprocess ?? 1,
        codUsuarioCargaDl: "SYSTEM",
        fehProcesoCargaDl: new Date(),
        fehProcesoModifDl: new Date(),
        desAccion: "INSERT",
        flgStatutActif: 1,
      },
    });
  }

  async update(
    id: number,
    data: Partial<{
      idDlkProcess: number;
      ordenPrecedenciaSubprocess: number | null;
      codSubprocess: string;
      nameSubprocess: string;
      descriptionSubprocess: string;
      objectiveSubprocess: string | null;
      criticalitySubprocess: string | null;
      outsourcedSubprocess: string | null;
      estimatedTimeSubprocess: number | null;
      responsibleUnit: string | null;
      responsibleRole: string | null;
      certificationSubprocess: string | null;
      stateSubprocess: number;
    }>
  ) {
    const updateData: Record<string, unknown> = { desAccion: "UPDATE" };
    const fields = [
      "idDlkProcess",
      "ordenPrecedenciaSubprocess",
      "codSubprocess",
      "nameSubprocess",
      "descriptionSubprocess",
      "objectiveSubprocess",
      "criticalitySubprocess",
      "outsourcedSubprocess",
      "estimatedTimeSubprocess",
      "responsibleUnit",
      "responsibleRole",
      "certificationSubprocess",
      "stateSubprocess",
    ] as const;
    for (const f of fields) {
      if (data[f] !== undefined) updateData[f] = data[f];
    }
    return this.prisma.mdSubprocess.update({
      where: { idDlkSubprocess: id },
      data: updateData,
    });
  }

  async softDelete(id: number) {
    return this.prisma.mdSubprocess.update({
      where: { idDlkSubprocess: id },
      data: { flgStatutActif: 0, desAccion: "DELETE" },
    });
  }
}
