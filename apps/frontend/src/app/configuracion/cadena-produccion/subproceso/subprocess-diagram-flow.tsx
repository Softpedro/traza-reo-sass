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
import type { ProcedureSubprocessRow } from "./procedure-subprocess-modal";
import type { InputSubprocessRow } from "./input-subprocess-modal";
import type { OutputSubprocessRow } from "./output-subprocess-modal";

/** Alineado con el modal anterior: teal #0f9bb6, texto oscuro legible */
const BOX_TEAL =
  "rounded-none border-2 border-[#2a9d9d] bg-[#0f9bb6] text-black p-4 shadow-md";
const BOX_CENTER =
  "rounded-none border-[3px] border-black bg-white text-black p-6 shadow-md";

type ListNodeData = {
  sectionTitle: string;
  lines: string[];
  emptyLabel: string;
};

type CenterData = {
  centerTitle: string;
  centerLabel: string;
};

type ListRF = Node<ListNodeData, "subDiagListTeal">;
type ProcRF = Node<ListNodeData, "subDiagProcedure">;
type CenterRF = Node<CenterData, "subDiagCenter">;

function SubDiagListTealInner({ data }: NodeProps<ListRF>) {
  return (
    <div className="relative">
      <Handle id="left" type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="right" type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="top" type="target" position={Position.Top} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={`${BOX_TEAL} min-w-[220px] max-w-[300px]`}>
        <div className="mb-2 text-center font-semibold">{data.sectionTitle}</div>
        <div className="max-h-[220px] overflow-y-auto pr-1">
          {data.lines.length > 0 ? (
            <div className="flex flex-col gap-0.5 text-sm">
              {data.lines.map((line, i) => (
                <div key={`${i}-${line.slice(0, 28)}`}>{line}</div>
              ))}
            </div>
          ) : (
            <span className="text-sm opacity-80">{data.emptyLabel}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function SubDiagProcedureInner({ data }: NodeProps<ProcRF>) {
  return (
    <div className="relative">
      <Handle id="bottom" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={`${BOX_TEAL} w-full min-w-[280px] max-w-md`}>
        <div className="mb-2 text-center font-semibold">{data.sectionTitle}</div>
        <div className="max-h-[220px] overflow-y-auto pr-1">
          {data.lines.length > 0 ? (
            <div className="flex flex-col gap-0.5 text-sm">
              {data.lines.map((line, i) => (
                <div key={`${i}-${line.slice(0, 28)}`}>{line}</div>
              ))}
            </div>
          ) : (
            <span className="text-sm opacity-80">{data.emptyLabel}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function SubDiagCenterInner({ data }: NodeProps<CenterRF>) {
  return (
    <div className="relative">
      <Handle id="top" type="target" position={Position.Top} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="left" type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="right" type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={`${BOX_CENTER} min-w-[220px] max-w-[320px]`}>
        <div className="mb-3 text-center text-sm font-semibold text-[#0f9bb6] underline">
          {data.centerTitle}
        </div>
        <div className="text-center text-base font-semibold">{data.centerLabel}</div>
      </div>
    </div>
  );
}

const SubDiagListTeal = memo(SubDiagListTealInner);
const SubDiagProcedure = memo(SubDiagProcedureInner);
const SubDiagCenter = memo(SubDiagCenterInner);

const nodeTypes = {
  subDiagListTeal: SubDiagListTeal,
  subDiagProcedure: SubDiagProcedure,
  subDiagCenter: SubDiagCenter,
};

const edgeStyle = { stroke: "#2563eb", strokeWidth: 2 };

function flowEdges(initial: Edge[]): Edge[] {
  return initial.map((e) => ({ ...e, animated: true }));
}

function buildGraph(
  procedureLines: string[],
  inputLines: string[],
  outputLines: string[],
  subprocessLabel: string
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const yRow = 300;
  const xInput = 40;
  const xCenter = 360;
  /** Separación suficiente para que el nodo central (hasta 320px) no solape OUTPUT; los handles queden alineados al borde medido. */
  const xOutput = 740;
  const yProcedure = 28;

  nodes.push({
    id: "procedure",
    type: "subDiagProcedure",
    position: { x: 270, y: yProcedure },
    data: {
      sectionTitle: "PROCEDURE",
      lines: procedureLines,
      emptyLabel: "Sin procedures",
    },
    draggable: false,
    selectable: true,
  });

  nodes.push({
    id: "input",
    type: "subDiagListTeal",
    position: { x: xInput, y: yRow },
    data: {
      sectionTitle: "INPUT",
      lines: inputLines,
      emptyLabel: "Sin inputs",
    },
    draggable: false,
    selectable: true,
  });

  nodes.push({
    id: "subprocess",
    type: "subDiagCenter",
    position: { x: xCenter, y: yRow },
    data: {
      centerTitle: "SUB PROCESO",
      centerLabel: subprocessLabel || "—",
    },
    draggable: false,
    selectable: true,
  });

  nodes.push({
    id: "output",
    type: "subDiagListTeal",
    position: { x: xOutput, y: yRow },
    data: {
      sectionTitle: "OUTPUT",
      lines: outputLines,
      emptyLabel: "Sin outputs",
    },
    draggable: false,
    selectable: true,
  });

  edges.push({
    id: "e-procedure-subprocess",
    source: "procedure",
    target: "subprocess",
    sourceHandle: "bottom",
    targetHandle: "top",
    style: edgeStyle,
  });

  edges.push({
    id: "e-input-subprocess",
    source: "input",
    target: "subprocess",
    sourceHandle: "right",
    targetHandle: "left",
    style: edgeStyle,
  });

  edges.push({
    id: "e-subprocess-output",
    source: "subprocess",
    target: "output",
    sourceHandle: "right",
    targetHandle: "left",
    style: edgeStyle,
  });

  return { nodes, edges: flowEdges(edges) };
}

function LegendPanel() {
  return (
    <Panel
      position="top-right"
      className="nodrag nopan m-2 max-w-[220px] rounded-lg border border-border bg-background/95 p-3 text-xs shadow-md backdrop-blur-sm"
    >
      <p className="mb-1.5 font-semibold text-foreground">Flujo</p>
      <ul className="space-y-1 leading-snug text-muted-foreground">
        <li>
          <span className="font-medium text-foreground">PROCEDURE</span> ↓ sub proceso.
        </li>
        <li>
          <span className="font-medium text-foreground">INPUT</span> →{" "}
          <span className="font-medium text-foreground">SUB PROCESO</span> →{" "}
          <span className="font-medium text-foreground">OUTPUT</span>
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
      fitView({ padding: 0.12, duration: 200 });
    });
    return () => cancelAnimationFrame(t);
  }, [nodeCount, fitView]);
  return null;
}

export type SubprocessDiagramFlowProps = {
  procedures: ProcedureSubprocessRow[];
  inputs: InputSubprocessRow[];
  outputs: OutputSubprocessRow[];
  subprocessLabel: string;
  className?: string;
};

export function SubprocessDiagramFlow({
  procedures,
  inputs,
  outputs,
  subprocessLabel,
  className,
}: SubprocessDiagramFlowProps) {
  const procedureLines = useMemo(
    () =>
      procedures.map(
        (p, i) => `${i + 1}. ${p.codProcedureSubprocess} - ${p.nameProcedureSubprocess}`
      ),
    [procedures]
  );
  const inputLines = useMemo(
    () =>
      inputs.map((inp, i) => `${i + 1}. ${inp.codInputSubprocess} - ${inp.nameInputSubprocess}`),
    [inputs]
  );
  const outputLines = useMemo(
    () =>
      outputs.map(
        (out, i) => `${i + 1}. ${out.codOutputSubprocess} - ${out.nameOutputSubprocess}`
      ),
    [outputs]
  );

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildGraph(procedureLines, inputLines, outputLines, subprocessLabel),
    [procedureLines, inputLines, outputLines, subprocessLabel]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const built = buildGraph(procedureLines, inputLines, outputLines, subprocessLabel);
    setNodes(built.nodes);
    setEdges(built.edges);
  }, [procedureLines, inputLines, outputLines, subprocessLabel, setNodes, setEdges]);

  return (
    <div
      className={
        className ??
        "h-[min(72vh,720px)] w-full min-h-[420px] rounded-md border border-border bg-muted/30 [&_.react-flow\_\_attribution]:text-muted-foreground"
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
        minZoom={0.35}
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
