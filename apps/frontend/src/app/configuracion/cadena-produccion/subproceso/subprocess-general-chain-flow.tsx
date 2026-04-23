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
import type { SubprocessRow } from "./columns";

const BOX_ESLABON_NO_REO =
  "rounded-lg border-2 border-gray-700 bg-gray-600 text-white p-4 min-w-[160px] max-w-[220px] shadow-md flex flex-col items-center justify-center gap-1";
const BOX_ESLABON_REO =
  "rounded-lg border-2 border-[#2a9d9d] bg-[#0f9bb6] text-white p-4 min-w-[160px] max-w-[220px] shadow-md flex flex-col items-center justify-center gap-1";
const BOX_CARD =
  "rounded-lg border-2 border-[#2a9d9d] bg-[#0f9bb6] text-white p-3 min-w-[200px] max-w-[280px] shadow-md text-center";

type EslabData = { numLabel: string; subtitle: string };
type EslabReoRF = Node<EslabData, "sgEslabonReo">;
type EslabNoRF = Node<EslabData, "sgEslabonNoReo">;
type CardRF = Node<{ bigLabel: string; titleLine: string }, "sgCard">;

function trazCode(num: number) {
  return getTrazabilidadLabel(num).split(" ")[0] ?? "";
}

function SgEslabReoInner({ data }: NodeProps<EslabReoRF>) {
  return (
    <>
      <Handle id="left" type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="right" type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={BOX_ESLABON_REO}>
        <span className="text-4xl font-bold leading-none">{data.numLabel}</span>
        <span className="text-center text-sm font-medium leading-tight">{data.subtitle}</span>
      </div>
    </>
  );
}

function SgEslabNoInner({ data }: NodeProps<EslabNoRF>) {
  return (
    <>
      <Handle id="left" type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="right" type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={BOX_ESLABON_NO_REO}>
        <span className="text-4xl font-bold leading-none">{data.numLabel}</span>
        <span className="text-center text-sm font-medium leading-tight">{data.subtitle}</span>
      </div>
    </>
  );
}

function SgCardInner({ data }: NodeProps<CardRF>) {
  return (
    <>
      <Handle id="top" type="target" position={Position.Top} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="left" type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="right" type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={`${BOX_CARD} flex flex-col items-start text-left`}>
        <span className="mb-1 block text-4xl font-bold leading-none">{data.bigLabel}</span>
        <span className="block text-base font-medium leading-tight">{data.titleLine}</span>
      </div>
    </>
  );
}

const SgEslabReo = memo(SgEslabReoInner);
const SgEslabNo = memo(SgEslabNoInner);
const SgCard = memo(SgCardInner);

const nodeTypes = {
  sgEslabonReo: SgEslabReo,
  sgEslabonNoReo: SgEslabNo,
  sgCard: SgCard,
};

const PROC_W = 260;
const SUB_W = 260;
const H_GAP = 40;
const INTER_COL_GAP = 56;
const X_START = 40;
const Y_ESLABON = 28;
const ES_GAP_DOWN = 44;
const ROW_STEP_Y = 142;
const MIN_COL_W = 220;

/** Paso horizontal solo entre cuadros de eslabón (fila superior). El contenido usa `colStarts` acumulado para no solaparse. */
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
  subprocessesByProcess: Map<number, SubprocessRow[]>,
  hasSubsInChain: boolean
): number {
  if (!hasSubsInChain) return MIN_COL_W;
  let maxW = MIN_COL_W;
  for (const p of chainProcesses) {
    const subs = subprocessesByProcess.get(p.idDlkProcess) ?? [];
    maxW = Math.max(maxW, rowWidth(subs));
  }
  return maxW;
}

function bottomIdForRow(proc: ProcessRow, subs: SubprocessRow[]): string {
  if (subs.length === 0) return `proc-${proc.idDlkProcess}`;
  const last = subs[subs.length - 1]!;
  return `sub-${last.idDlkSubprocess}`;
}

function buildGraph(
  sortedEslabones: Eslabon[],
  processesByEslabon: Map<number, ProcessRow[]>,
  subprocessesByProcess: Map<number, SubprocessRow[]>
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const colStarts: number[] = [];
  let xCursor = X_START;
  sortedEslabones.forEach((e) => {
    const chainProcesses = processesByEslabon.get(e.idDlkProductionChain) ?? [];
    const hasSubsInChain = chainProcesses.some(
      (p) => (subprocessesByProcess.get(p.idDlkProcess)?.length ?? 0) > 0
    );
    colStarts.push(xCursor);
    xCursor += columnWidthNeed(chainProcesses, subprocessesByProcess, hasSubsInChain) + INTER_COL_GAP;
  });

  const eslabonRailX = sortedEslabones.map((_, i) => X_START + i * ESLABON_RAIL_STEP);

  sortedEslabones.forEach((eslabon, idx) => {
    const anchorX = colStarts[idx]!;
    const railX = eslabonRailX[idx]!;
    const chainProcesses = processesByEslabon.get(eslabon.idDlkProductionChain) ?? [];
    const hasSubsInChain = chainProcesses.some(
      (p) => (subprocessesByProcess.get(p.idDlkProcess)?.length ?? 0) > 0
    );
    const escId = `chain-${eslabon.idDlkProductionChain}`;
    const numStr = String(eslabon.numPrecedenciaProductiva);
    const subtitle = `${trazCode(eslabon.numPrecedenciaTrazabilidad)} - ${eslabon.nameProductionChain}`;

    nodes.push({
      id: escId,
      type: hasSubsInChain ? "sgEslabonReo" : "sgEslabonNoReo",
      position: { x: railX, y: Y_ESLABON },
      data: { numLabel: numStr, subtitle },
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

    if (!hasSubsInChain) return;

    let yRow = Y_ESLABON + 120 + ES_GAP_DOWN;

    chainProcesses.forEach((proc, processIndex) => {
      const subs = subprocessesByProcess.get(proc.idDlkProcess) ?? [];
      const processNum = `${eslabon.numPrecedenciaProductiva}.${processIndex + 1}`;
      const pid = `proc-${proc.idDlkProcess}`;

      nodes.push({
        id: pid,
        type: "sgCard",
        position: { x: anchorX, y: yRow },
        data: {
          bigLabel: processNum,
          titleLine: `${proc.codProcess} - ${proc.nameProcess}`,
        },
        draggable: false,
        selectable: true,
      });

      if (processIndex === 0) {
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
        const prevProc = chainProcesses[processIndex - 1]!;
        const prevSubs = subprocessesByProcess.get(prevProc.idDlkProcess) ?? [];
        const src = bottomIdForRow(prevProc, prevSubs);
        edges.push({
          id: `v-${src}-${pid}`,
          source: src,
          target: pid,
          sourceHandle: "bottom",
          targetHandle: "top",
          animated: true,
          style: edgeBlue,
        });
      }

      let prevId = pid;
      subs.forEach((sub, subIndex) => {
        const subNum = `${processNum}.${subIndex + 1}`;
        const sid = `sub-${sub.idDlkSubprocess}`;
        const subX =
          anchorX + PROC_W + H_GAP + subIndex * (SUB_W + H_GAP);
        nodes.push({
          id: sid,
          type: "sgCard",
          position: { x: subX, y: yRow },
          data: {
            bigLabel: subNum,
            titleLine: `${sub.codSubprocess} - ${sub.nameSubprocess}`,
          },
          draggable: false,
          selectable: true,
        });
        edges.push({
          id: `hr-${prevId}-${sid}`,
          source: prevId,
          target: sid,
          sourceHandle: "right",
          targetHandle: "left",
          animated: true,
          style: edgeBlue,
        });
        prevId = sid;
      });

      yRow += ROW_STEP_Y;
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
          <span className="font-medium text-foreground">Gris:</span> eslabón sin subprocesos REO en esa cadena.
        </li>
        <li>
          <span className="font-medium text-foreground">Turquesa:</span> eslabón con subprocesos; proceso y subprocesos
          en fila.
        </li>
        <li>
          <span className="font-medium text-foreground">Flechas azules:</span> orden eslabón → proceso → subprocesos.
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
      fitView({ padding: 0.12, duration: 220 });
    });
    return () => cancelAnimationFrame(t);
  }, [nodeCount, fitView]);
  return null;
}

export type SubprocessGeneralChainFlowProps = {
  eslabones: Eslabon[];
  processesByEslabon: Map<number, ProcessRow[]>;
  subprocessesByProcess: Map<number, SubprocessRow[]>;
  className?: string;
};

export function SubprocessGeneralChainFlow({
  eslabones,
  processesByEslabon,
  subprocessesByProcess,
  className,
}: SubprocessGeneralChainFlowProps) {
  const sorted = useMemo(
    () =>
      [...eslabones].sort(
        (a, b) => a.numPrecedenciaProductiva - b.numPrecedenciaProductiva
      ),
    [eslabones]
  );

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildGraph(sorted, processesByEslabon, subprocessesByProcess),
    [sorted, processesByEslabon, subprocessesByProcess]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const built = buildGraph(sorted, processesByEslabon, subprocessesByProcess);
    setNodes(built.nodes);
    setEdges(built.edges);
  }, [sorted, processesByEslabon, subprocessesByProcess, setNodes, setEdges]);

  if (sorted.length === 0) {
    return null;
  }

  return (
    <div
      className={
        className ??
        "h-[min(68vh,680px)] w-full min-h-[400px] rounded-md border border-border bg-muted/30 [&_.react-flow\_\_attribution]:text-muted-foreground"
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
        minZoom={0.15}
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
