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
import type { ProcessRow } from "./columns";

const BOX_ESLABON_NO_REO =
  "rounded-lg border-2 border-gray-700 bg-gray-600 text-white p-4 min-w-[160px] max-w-[220px] shadow-md flex flex-col items-center justify-center gap-1";
const BOX_ESLABON_REO =
  "rounded-lg border-2 border-[#2a9d9d] bg-[#40B2B2] text-white p-4 min-w-[160px] max-w-[220px] shadow-md flex flex-col items-center justify-center gap-1";
const BOX_PROCESO_REO =
  "rounded-lg border-2 border-[#2a9d9d] bg-[#40B2B2] text-white p-3 min-w-[180px] max-w-[280px] shadow-md text-sm text-center";

type EslabonFlowData = {
  numLabel: string;
  subtitle: string;
};

type EslabonReoRF = Node<EslabonFlowData, "eslabonReo">;
type EslabonNoReoRF = Node<EslabonFlowData, "eslabonNoReo">;
type ProcesoRF = Node<
  { ordenLabel: string; codProcess?: string; nameProcess: string },
  "proceso"
>;

function trazCode(num: number) {
  return getTrazabilidadLabel(num).split(" ")[0] ?? "";
}

function EslabonReoInner({ data }: NodeProps<EslabonReoRF>) {
  return (
    <>
      <Handle id="left" type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="right" type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={BOX_ESLABON_REO}>
        <span className="text-lg font-bold">{data.numLabel}</span>
        <span className="text-center text-sm font-medium">{data.subtitle}</span>
      </div>
    </>
  );
}

function EslabonNoReoInner({ data }: NodeProps<EslabonNoReoRF>) {
  return (
    <>
      <Handle id="left" type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="right" type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={BOX_ESLABON_NO_REO}>
        <span className="text-lg font-bold">{data.numLabel}</span>
        <span className="text-center text-sm font-medium">{data.subtitle}</span>
      </div>
    </>
  );
}

function ProcesoInner({ data }: NodeProps<ProcesoRF>) {
  return (
    <>
      <Handle id="top" type="target" position={Position.Top} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={BOX_PROCESO_REO}>
        <span className="block text-xs font-semibold opacity-90">{data.ordenLabel}</span>
        {data.codProcess ? (
          <span className="block font-semibold">
            {data.codProcess}
            {" - "}
          </span>
        ) : null}
        <span className="text-sm">{data.nameProcess}</span>
      </div>
    </>
  );
}

const EslabonReoNode = memo(EslabonReoInner);
const EslabonNoReoNode = memo(EslabonNoReoInner);
const ProcesoNode = memo(ProcesoInner);

const nodeTypes = {
  eslabonReo: EslabonReoNode,
  eslabonNoReo: EslabonNoReoNode,
  proceso: ProcesoNode,
};

const COL_W = 320;
const X0 = 32;
const Y_ESLABON = 24;
const ES_STACK_H = 96;
const GAP_AFTER_ESLABON = 28;
const PROC_STEP_Y = 124;

const edgeBlue = { stroke: "#2563eb", strokeWidth: 2 };

function buildGraph(
  sortedEslabones: Eslabon[],
  processesByEslabon: Map<number, ProcessRow[]>
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  sortedEslabones.forEach((e, idx) => {
    const x = X0 + idx * COL_W;
    const procs = processesByEslabon.get(e.idDlkProductionChain) ?? [];
    const reo = procs.length > 0;
    const escId = `chain-${e.idDlkProductionChain}`;

    const common = {
      id: escId,
      position: { x, y: Y_ESLABON },
      data: {
        numLabel: String(e.numPrecedenciaProductiva).padStart(2, "0"),
        subtitle: `${trazCode(e.numPrecedenciaTrazabilidad)} - ${e.nameProductionChain}`,
      },
      draggable: false,
      selectable: true,
    };

    nodes.push(
      reo
        ? { ...common, type: "eslabonReo" }
        : { ...common, type: "eslabonNoReo" }
    );

    if (idx > 0) {
      const prev = sortedEslabones[idx - 1];
      edges.push({
        id: `h-${prev.idDlkProductionChain}-${e.idDlkProductionChain}`,
        source: `chain-${prev.idDlkProductionChain}`,
        target: escId,
        sourceHandle: "right",
        targetHandle: "left",
        animated: true,
        style: edgeBlue,
      });
    }

    let y = Y_ESLABON + ES_STACK_H + GAP_AFTER_ESLABON;
    procs.forEach((proc, pi) => {
      const pid = `proc-${proc.idDlkProcess}`;
      nodes.push({
        id: pid,
        type: "proceso",
        position: { x, y },
        data: {
          ordenLabel: `${e.numPrecedenciaProductiva}.${pi + 1}`,
          codProcess: proc.codProcess || undefined,
          nameProcess: proc.nameProcess,
        },
        draggable: false,
        selectable: true,
      });

      if (pi === 0) {
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
        const prevPid = `proc-${procs[pi - 1]!.idDlkProcess}`;
        edges.push({
          id: `v-${prevPid}-${pid}`,
          source: prevPid,
          target: pid,
          sourceHandle: "bottom",
          targetHandle: "top",
          animated: true,
          style: edgeBlue,
        });
      }

      y += PROC_STEP_Y;
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
          <span className="font-medium text-foreground">Fila superior:</span> eslabones en orden productivo (flechas
          azules).
        </li>
        <li>
          <span className="font-medium text-foreground">Gris:</span> eslabón sin procesos registrados (REO no interviene
          aquí).
        </li>
        <li>
          <span className="font-medium text-foreground">Verde/azul:</span> eslabón con procesos (REO interviene); debajo,
          procesos en orden.
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
      fitView({ padding: 0.15, duration: 200 });
    });
    return () => cancelAnimationFrame(t);
  }, [nodeCount, fitView]);
  return null;
}

export type ProcessGeneralChainFlowProps = {
  eslabones: Eslabon[];
  processesByEslabon: Map<number, ProcessRow[]>;
  className?: string;
};

export function ProcessGeneralChainFlow({
  eslabones,
  processesByEslabon,
  className,
}: ProcessGeneralChainFlowProps) {
  const sorted = useMemo(
    () =>
      [...eslabones].sort(
        (a, b) => a.numPrecedenciaProductiva - b.numPrecedenciaProductiva
      ),
    [eslabones]
  );

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildGraph(sorted, processesByEslabon),
    [sorted, processesByEslabon]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const built = buildGraph(sorted, processesByEslabon);
    setNodes(built.nodes);
    setEdges(built.edges);
  }, [sorted, processesByEslabon, setNodes, setEdges]);

  if (sorted.length === 0) {
    return null;
  }

  return (
    <div
      className={
        className ??
        "h-[min(62vh,640px)] w-full min-h-[380px] rounded-md border border-border bg-muted/30 [&_.react-flow\_\_attribution]:text-muted-foreground"
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
        minZoom={0.2}
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
