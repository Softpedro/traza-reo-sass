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
import type { ProcedureProcessRow } from "./procedure-process-modal";
import type { InputProcessRow } from "./input-process-modal";
import type { OutputProcessRow } from "./output-process-modal";

const BOX_TEAL =
  "rounded-lg border-2 border-[#2a9d9d] bg-[#40B2B2] text-white p-4 shadow-md";
const BOX_PROCESS =
  "rounded-lg border-[3px] border-black bg-white text-black p-4 shadow-md";

type ListNodeData = {
  sectionTitle: string;
  lines: string[];
  emptyLabel: string;
};

type CenterProcessData = {
  processTitle: string;
  processLabel: string;
};

type ProcListRF = Node<ListNodeData, "diagramListTeal">;
type ProcedureRF = Node<ListNodeData, "diagramProcedure">;
type CenterRF = Node<CenterProcessData, "diagramProcessCenter">;

function DiagramListTealInner({ data }: NodeProps<ProcListRF>) {
  return (
    <>
      <Handle id="left" type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="right" type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="top" type="target" position={Position.Top} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={`${BOX_TEAL} min-w-[200px] max-w-[280px]`}>
        <div className="mb-2 border-b border-white/50 pb-1 font-semibold">{data.sectionTitle}</div>
        <div className="max-h-[220px] overflow-y-auto pr-1">
          {data.lines.length > 0 ? (
            <div className="flex flex-col gap-0.5 text-sm">
              {data.lines.map((line, i) => (
                <div key={`${i}-${line.slice(0, 24)}`}>{line}</div>
              ))}
            </div>
          ) : (
            <span className="text-sm opacity-80">{data.emptyLabel}</span>
          )}
        </div>
      </div>
    </>
  );
}

/** Procedure: solo bottom → PROCESO */
function DiagramProcedureInner({ data }: NodeProps<ProcedureRF>) {
  return (
    <>
      <Handle id="bottom" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={`${BOX_TEAL} w-full max-w-md min-w-[280px]`}>
        <div className="mb-2 border-b border-white/50 pb-1 font-semibold">{data.sectionTitle}</div>
        <div className="max-h-[220px] overflow-y-auto pr-1">
          {data.lines.length > 0 ? (
            <div className="flex flex-col gap-0.5 text-sm">
              {data.lines.map((line, i) => (
                <div key={`${i}-${line.slice(0, 24)}`}>{line}</div>
              ))}
            </div>
          ) : (
            <span className="text-sm opacity-80">{data.emptyLabel}</span>
          )}
        </div>
      </div>
    </>
  );
}

function DiagramProcessCenterInner({ data }: NodeProps<CenterRF>) {
  return (
    <>
      <Handle id="top" type="target" position={Position.Top} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="left" type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <Handle id="right" type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={`${BOX_PROCESS} min-w-[220px] max-w-[260px]`}>
        <div className="mb-1 text-xs text-muted-foreground underline">{data.processTitle}</div>
        <div className="text-sm font-medium">{data.processLabel}</div>
      </div>
    </>
  );
}

const DiagramListTeal = memo(DiagramListTealInner);
const DiagramProcedure = memo(DiagramProcedureInner);
const DiagramProcessCenter = memo(DiagramProcessCenterInner);

const nodeTypes = {
  diagramListTeal: DiagramListTeal,
  diagramProcedure: DiagramProcedure,
  diagramProcessCenter: DiagramProcessCenter,
};

const edgeStyle = { stroke: "#2563eb", strokeWidth: 2 };

function flowEdges(initial: Edge[]): Edge[] {
  return initial.map((e) => ({ ...e, animated: true }));
}

function buildGraph(
  procedureLines: string[],
  inputLines: string[],
  outputLines: string[],
  processLabel: string
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const yRow = 300;
  const xInput = 40;
  const xProcess = 360;
  const xOutput = 660;
  const yProcTop = 28;

  nodes.push({
    id: "procedure",
    type: "diagramProcedure",
    position: { x: 270, y: yProcTop },
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
    type: "diagramListTeal",
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
    id: "process",
    type: "diagramProcessCenter",
    position: { x: xProcess, y: yRow },
    data: {
      processTitle: "PROCESO",
      processLabel: processLabel || "—",
    },
    draggable: false,
    selectable: true,
  });

  nodes.push({
    id: "output",
    type: "diagramListTeal",
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
    id: "e-procedure-process",
    source: "procedure",
    target: "process",
    sourceHandle: "bottom",
    targetHandle: "top",
    style: edgeStyle,
  });

  edges.push({
    id: "e-input-process",
    source: "input",
    target: "process",
    sourceHandle: "right",
    targetHandle: "left",
    style: edgeStyle,
  });

  edges.push({
    id: "e-process-output",
    source: "process",
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
          <span className="font-medium text-foreground">PROCEDURE</span> → entradas de procedimiento hacia el proceso.
        </li>
        <li>
          <span className="font-medium text-foreground">INPUT</span> → <span className="font-medium text-foreground">PROCESO</span> →{" "}
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

export type ProcessDiagramFlowProps = {
  procedures: ProcedureProcessRow[];
  inputs: InputProcessRow[];
  outputs: OutputProcessRow[];
  processLabel: string;
  className?: string;
};

export function ProcessDiagramFlow({
  procedures,
  inputs,
  outputs,
  processLabel,
  className,
}: ProcessDiagramFlowProps) {
  const procedureLines = useMemo(
    () =>
      procedures.map(
        (p, i) => `${i + 1}. ${p.codProcedureProcess} - ${p.nameProcedureProcess}`
      ),
    [procedures]
  );
  const inputLines = useMemo(
    () =>
      inputs.map((inp, i) => `${i + 1}. ${inp.codInputProcess} - ${inp.nameInputProcess}`),
    [inputs]
  );
  const outputLines = useMemo(
    () =>
      outputs.map(
        (out, i) => `${i + 1}. ${out.codOutputProcess} - ${out.nameOutputProcess}`
      ),
    [outputs]
  );

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildGraph(procedureLines, inputLines, outputLines, processLabel),
    [procedureLines, inputLines, outputLines, processLabel]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const built = buildGraph(procedureLines, inputLines, outputLines, processLabel);
    setNodes(built.nodes);
    setEdges(built.edges);
  }, [procedureLines, inputLines, outputLines, processLabel, setNodes, setEdges]);

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
