"use client";

import { memo, useEffect, useMemo } from "react";
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Panel,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getTrazabilidadLabel } from "../eslabon/obs";
import type { Eslabon } from "../eslabon/columns";
import type { ProcessRow } from "../proceso/columns";
import type { SubprocessRow } from "../subproceso/columns";
import type { ActivityRow } from "./columns";

const BOX_NO_REO =
  "rounded-none border-2 border-black bg-gray-600 text-white p-3 min-w-[140px] max-w-[220px] shadow-md text-center";
const BOX_REO =
  "rounded-none border-2 border-black bg-[#0f9bb6] text-white p-3 min-w-[140px] max-w-[240px] shadow-md text-center";

type TierData = { bigLabel: string; titleLine: string; variant: "reo" | "noreo" };
type TierRF = Node<TierData, "agTier">;
type ActRF = Node<{ bigLabel: string; titleLine: string }, "agActivity">;
type EslabData = { numLabel: string; subtitle: string };
type EslabReoRF = Node<EslabData, "agEslabonReo">;
type EslabNoRF = Node<EslabData, "agEslabonNoReo">;

function trazCode(num: number) {
  return getTrazabilidadLabel(num).split(" ")[0] ?? "";
}

function AgEslabReoInner({ data }: NodeProps<EslabReoRF>) {
  return (
    <>
      <Handle id="left" type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="right" type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={BOX_REO}>
        <div className="mb-1 text-4xl font-bold leading-none">{data.numLabel}</div>
        <div className="text-base leading-tight">{data.subtitle}</div>
      </div>
    </>
  );
}

function AgEslabNoInner({ data }: NodeProps<EslabNoRF>) {
  return (
    <>
      <Handle id="left" type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="right" type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={BOX_NO_REO}>
        <div className="mb-1 text-4xl font-bold leading-none">{data.numLabel}</div>
        <div className="text-base leading-tight">{data.subtitle}</div>
      </div>
    </>
  );
}

function AgTierInner({ data }: NodeProps<TierRF>) {
  const cls = data.variant === "reo" ? BOX_REO : BOX_NO_REO;
  return (
    <>
      <Handle id="top" type="target" position={Position.Top} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="left" type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="right" type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={cls}>
        <div className="mb-1 text-4xl font-bold leading-none">{data.bigLabel}</div>
        <div className="text-base font-medium leading-tight">{data.titleLine}</div>
      </div>
    </>
  );
}

function AgActivityInner({ data }: NodeProps<ActRF>) {
  return (
    <>
      <Handle id="top" type="target" position={Position.Top} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={BOX_REO}>
        <div className="mb-1 text-4xl font-bold leading-none">{data.bigLabel}</div>
        <div className="text-base font-medium leading-tight">{data.titleLine}</div>
      </div>
    </>
  );
}

const AgEslabReo = memo(AgEslabReoInner);
const AgEslabNo = memo(AgEslabNoInner);
const AgTier = memo(AgTierInner);
const AgActivity = memo(AgActivityInner);

const nodeTypes = {
  agEslabonReo: AgEslabReo,
  agEslabonNoReo: AgEslabNo,
  agTier: AgTier,
  agActivity: AgActivity,
};

const PROC_W = 200;
const SUB_W = 200;
const H_GAP = 36;
const INTER_COL_GAP = 52;
const X_START = 36;
const Y_ESLABON = 24;
const ES_H = 112;
const GAP_AFTER_ESLABON = 36;
const TIER_H = 100;
const ACT_STEP_Y = 108;
const ACT_TOP_GAP = 28;
const ROW_GAP_AFTER = 36;

/** Mínimo de carril por columna (contenido); alineado con `columnWidthNeed`. */
const MIN_COL_W = 200;
/** Paso horizontal solo entre cuadros de eslabón; el árbol usa `colStarts` acumulado (igual que diagrama general de subprocesos). */
const ESLABON_RAIL_STEP = MIN_COL_W + 44;

const edgeBlue = { stroke: "#2563eb", strokeWidth: 2 };

function rowWidth(subs: SubprocessRow[]): number {
  if (subs.length === 0) return PROC_W;
  let w = PROC_W;
  subs.forEach(() => {
    w += H_GAP + SUB_W;
  });
  return w;
}

function columnWidthNeed(
  chainProcesses: ProcessRow[],
  subprocessesByProcess: Map<number, SubprocessRow[]>
): number {
  if (chainProcesses.length === 0) return MIN_COL_W;
  let maxW = MIN_COL_W;
  for (const p of chainProcesses) {
    const subs = subprocessesByProcess.get(p.idDlkProcess) ?? [];
    maxW = Math.max(maxW, rowWidth(subs));
  }
  return maxW;
}

function buildGraph(
  sortedEslabones: Eslabon[],
  processesByEslabon: Map<number, ProcessRow[]>,
  subprocessesByProcess: Map<number, SubprocessRow[]>,
  activitiesBySubprocess: Map<number, ActivityRow[]>
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const colStarts: number[] = [];
  let xCursor = X_START;
  sortedEslabones.forEach((e) => {
    const chainProcesses = processesByEslabon.get(e.idDlkProductionChain) ?? [];
    colStarts.push(xCursor);
    xCursor += columnWidthNeed(chainProcesses, subprocessesByProcess) + INTER_COL_GAP;
  });

  const eslabonRailX = sortedEslabones.map((_, i) => X_START + i * ESLABON_RAIL_STEP);

  sortedEslabones.forEach((eslabon, idx) => {
    const anchorX = colStarts[idx]!;
    const railX = eslabonRailX[idx]!;
    const chainProcesses = processesByEslabon.get(eslabon.idDlkProductionChain) ?? [];
    const escId = `chain-${eslabon.idDlkProductionChain}`;
    const eslabonNum = eslabon.numPrecedenciaProductiva;

    const hasActivitiesChain = chainProcesses.some((process) => {
      const processSubs = subprocessesByProcess.get(process.idDlkProcess) ?? [];
      return processSubs.some(
        (sub) => (activitiesBySubprocess.get(sub.idDlkSubprocess)?.length ?? 0) > 0
      );
    });

    nodes.push({
      id: escId,
      type: hasActivitiesChain ? "agEslabonReo" : "agEslabonNoReo",
      position: { x: railX, y: Y_ESLABON },
      data: {
        numLabel: String(eslabonNum),
        subtitle: `${trazCode(eslabon.numPrecedenciaTrazabilidad)} - ${eslabon.nameProductionChain}`,
      },
      draggable: false,
      selectable: true,
    });

    if (idx > 0) {
      const prev = sortedEslabones[idx - 1]!;
      edges.push({
        id: `h-${prev.idDlkProductionChain}-${eslabon.idDlkProductionChain}`,
        source: `chain-${prev.idDlkProductionChain}`,
        target: escId,
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        style: edgeBlue,
      });
    }

    if (chainProcesses.length === 0) return;

    let yCursor = Y_ESLABON + ES_H + GAP_AFTER_ESLABON;
    let prevRowBottomId: string | null = null;

    chainProcesses.forEach((proc, pi) => {
      const processSubs = subprocessesByProcess.get(proc.idDlkProcess) ?? [];
      const processNum = `${eslabonNum}.${pi + 1}`;
      const pid = `proc-${proc.idDlkProcess}`;
      const processHasAct = processSubs.some(
        (s) => (activitiesBySubprocess.get(s.idDlkSubprocess)?.length ?? 0) > 0
      );
      const rowTop = yCursor;

      nodes.push({
        id: pid,
        type: "agTier",
        position: { x: anchorX, y: rowTop },
        data: {
          bigLabel: processNum,
          titleLine: `${proc.codProcess} - ${proc.nameProcess}`,
          variant: processHasAct ? "reo" : "noreo",
        },
        draggable: false,
        selectable: true,
      });

      if (prevRowBottomId === null) {
        edges.push({
          id: `v-${escId}-${pid}`,
          source: escId,
          target: pid,
          sourceHandle: "bottom",
          targetHandle: "top",
          animated: true,
          style: edgeBlue,
        });
      } else {
        edges.push({
          id: `v-${prevRowBottomId}-${pid}`,
          source: prevRowBottomId,
          target: pid,
          sourceHandle: "bottom",
          targetHandle: "top",
          animated: true,
          style: edgeBlue,
        });
      }

      let rowBottomY = rowTop + TIER_H;
      let bottomId = pid;

      let prevH = pid;
      let xSub = anchorX + PROC_W + H_GAP;

      processSubs.forEach((sub, si) => {
        const sid = `sub-${sub.idDlkSubprocess}`;
        const subNum = `${processNum}.${si + 1}`;
        const acts = activitiesBySubprocess.get(sub.idDlkSubprocess) ?? [];
        const subHasAct = acts.length > 0;

        nodes.push({
          id: sid,
          type: "agTier",
          position: { x: xSub, y: rowTop },
          data: {
            bigLabel: subNum,
            titleLine: `${sub.codSubprocess} - ${sub.nameSubprocess}`,
            variant: subHasAct ? "reo" : "noreo",
          },
          draggable: false,
          selectable: true,
        });

        edges.push({
          id: `hr-${prevH}-${sid}`,
          source: prevH,
          target: sid,
          sourceHandle: "right",
          targetHandle: "left",
          animated: true,
          style: edgeBlue,
        });
        prevH = sid;

        let localBottom = rowTop + TIER_H;
        let localBottomId = sid;

        if (acts.length > 0) {
          let actY = rowTop + TIER_H + ACT_TOP_GAP;
          acts.forEach((act, ai) => {
            const aid = `act-${act.idDlkActivities}`;
            const actNum = `${subNum}.${ai + 1}`;
            nodes.push({
              id: aid,
              type: "agActivity",
              position: { x: xSub, y: actY },
              data: {
                bigLabel: actNum,
                titleLine: `${act.codActivities} - ${act.nameActivities}`,
              },
              draggable: false,
              selectable: true,
            });

            if (ai === 0) {
              edges.push({
                id: `va-${sid}-${aid}`,
                source: sid,
                target: aid,
                sourceHandle: "bottom",
                targetHandle: "top",
                animated: true,
                style: edgeBlue,
              });
            } else {
              const prevAid = `act-${acts[ai - 1]!.idDlkActivities}`;
              edges.push({
                id: `va-${prevAid}-${aid}`,
                source: prevAid,
                target: aid,
                sourceHandle: "bottom",
                targetHandle: "top",
                animated: true,
                style: edgeBlue,
              });
            }
            actY += ACT_STEP_Y;
            localBottom = actY;
            localBottomId = aid;
          });
        }

        if (localBottom > rowBottomY) {
          rowBottomY = localBottom;
          bottomId = localBottomId;
        }
        xSub += SUB_W + H_GAP;
      });

      if (processSubs.length === 0) {
        rowBottomY = rowTop + TIER_H;
        bottomId = pid;
      }

      yCursor = rowBottomY + ROW_GAP_AFTER;
      prevRowBottomId = bottomId;
    });
  });

  return { nodes, edges };
}

function LegendPanel() {
  return (
    <Panel
      position="top-right"
      className="nodrag nopan m-2 max-w-[260px] rounded-lg border border-border bg-background/95 p-3 text-xs shadow-md backdrop-blur-sm"
    >
      <p className="mb-2 font-semibold text-foreground">Leyenda</p>
      <ul className="space-y-1.5 leading-snug text-muted-foreground">
        <li>
          <span className="font-medium text-foreground">Gris:</span> nivel sin actividades REO debajo en esa rama.
        </li>
        <li>
          <span className="font-medium text-foreground">Turquesa:</span> nivel con intervención REO (incluye
          actividades).
        </li>
        <li>
          <span className="font-medium text-foreground">Actividades:</span> bajo cada subproceso, en columna vertical.
        </li>
        <li>
          <span className="font-medium text-foreground">Eslabones:</span> fila superior con paso fijo; proceso y
          niveles inferiores respetan el ancho real de cada columna.
        </li>
      </ul>
    </Panel>
  );
}

function FitViewOnData({ nodeCount }: { nodeCount: number }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    if (nodeCount === 0) return;
    const t = requestAnimationFrame(() => {
      fitView({ padding: 0.1, duration: 220 });
    });
    return () => cancelAnimationFrame(t);
  }, [nodeCount, fitView]);
  return null;
}

export type ActivityGeneralChainFlowProps = {
  eslabones: Eslabon[];
  processesByEslabon: Map<number, ProcessRow[]>;
  subprocessesByProcess: Map<number, SubprocessRow[]>;
  activitiesBySubprocess: Map<number, ActivityRow[]>;
  className?: string;
};

export function ActivityGeneralChainFlow({
  eslabones,
  processesByEslabon,
  subprocessesByProcess,
  activitiesBySubprocess,
  className,
}: ActivityGeneralChainFlowProps) {
  const sorted = useMemo(
    () =>
      [...eslabones].sort(
        (a, b) => a.numPrecedenciaProductiva - b.numPrecedenciaProductiva
      ),
    [eslabones]
  );

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildGraph(sorted, processesByEslabon, subprocessesByProcess, activitiesBySubprocess),
    [sorted, processesByEslabon, subprocessesByProcess, activitiesBySubprocess]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const built = buildGraph(sorted, processesByEslabon, subprocessesByProcess, activitiesBySubprocess);
    setNodes(built.nodes);
    setEdges(built.edges);
  }, [sorted, processesByEslabon, subprocessesByProcess, activitiesBySubprocess, setNodes, setEdges]);

  if (sorted.length === 0) {
    return null;
  }

  return (
    <div
      className={
        className ??
        "h-[min(70vh,700px)] w-full min-h-[400px] rounded-md border border-border bg-muted/30 [&_.react-flow\_\_attribution]:text-muted-foreground"
      }
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        fitView
        minZoom={0.12}
        maxZoom={1.75}
      >
        <FitViewOnData nodeCount={nodes.length} />
        <LegendPanel />
        <Controls showInteractive={false} />
        <MiniMap zoomable pannable />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}
