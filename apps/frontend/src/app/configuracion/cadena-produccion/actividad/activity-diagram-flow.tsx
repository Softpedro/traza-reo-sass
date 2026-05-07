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
import type { ProcedureActivityRow } from "./procedure-activity-modal";
import type { InputActivityRow } from "./input-activity-modal";
import type { OutputActivityRow } from "./output-activity-modal";

/** Cajas periféricas sin borde (mock Actividad); fill alineado con sidebar TRAZA */
const BOX_TEAL = "rounded-none bg-[hsl(var(--sidebar-bg))] text-black p-4 shadow-md";
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

type ListRF = Node<ListNodeData, "actDiagListTeal">;
type ProcRF = Node<ListNodeData, "actDiagProcedure">;
type CenterRF = Node<CenterData, "actDiagCenter">;

function ActDiagListTealInner({ data }: NodeProps<ListRF>) {
  return (
    <div className="relative">
      <Handle
        id="left"
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border !border-black !bg-white"
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !border !border-black !bg-white"
      />
      <Handle
        id="top"
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border !border-black !bg-white"
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border !border-black !bg-white"
      />
      <div className={`${BOX_TEAL} min-w-[220px] max-w-[300px]`}>
        <div className="mb-2 text-center font-bold">{data.sectionTitle}</div>
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

function ActDiagProcedureInner({ data }: NodeProps<ProcRF>) {
  return (
    <div className="relative">
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border !border-black !bg-white"
      />
      <div className={`${BOX_TEAL} w-full min-w-[280px] max-w-md`}>
        <div className="mb-2 text-center font-bold">{data.sectionTitle}</div>
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

function ActDiagCenterInner({ data }: NodeProps<CenterRF>) {
  return (
    <div className="relative">
      <Handle
        id="top"
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border !border-black !bg-white"
      />
      <Handle
        id="left"
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border !border-black !bg-white"
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !border !border-black !bg-white"
      />
      <div className={`${BOX_CENTER} min-w-[220px] max-w-[320px]`}>
        <div className="mb-3 text-center text-sm font-semibold text-primary underline">
          {data.centerTitle}
        </div>
        <div className="text-center text-base font-bold">{data.centerLabel}</div>
      </div>
    </div>
  );
}

const ActDiagListTeal = memo(ActDiagListTealInner);
const ActDiagProcedure = memo(ActDiagProcedureInner);
const ActDiagCenter = memo(ActDiagCenterInner);

const nodeTypes = {
  actDiagListTeal: ActDiagListTeal,
  actDiagProcedure: ActDiagProcedure,
  actDiagCenter: ActDiagCenter,
};

const edgeStyle = { stroke: "hsl(var(--traza-teal))", strokeWidth: 2 };

function flowEdges(initial: Edge[]): Edge[] {
  return initial.map((e) => ({ ...e, animated: true }));
}

function buildGraph(
  procedureLines: string[],
  inputLines: string[],
  outputLines: string[],
  activityLabel: string
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const yRow = 300;
  const xInput = 40;
  const xCenter = 360;
  const xOutput = 740;
  const yProcedure = 28;

  nodes.push({
    id: "procedure",
    type: "actDiagProcedure",
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
    type: "actDiagListTeal",
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
    id: "activity",
    type: "actDiagCenter",
    position: { x: xCenter, y: yRow },
    data: {
      centerTitle: "ACTIVIDAD",
      centerLabel: activityLabel || "—",
    },
    draggable: false,
    selectable: true,
  });

  nodes.push({
    id: "output",
    type: "actDiagListTeal",
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
    id: "e-procedure-activity",
    source: "procedure",
    target: "activity",
    sourceHandle: "bottom",
    targetHandle: "top",
    style: edgeStyle,
  });

  edges.push({
    id: "e-input-activity",
    source: "input",
    target: "activity",
    sourceHandle: "right",
    targetHandle: "left",
    style: edgeStyle,
  });

  edges.push({
    id: "e-activity-output",
    source: "activity",
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
          <span className="font-medium text-foreground">PROCEDURE</span> ↓ actividad.
        </li>
        <li>
          <span className="font-medium text-foreground">INPUT</span> →{" "}
          <span className="font-medium text-foreground">ACTIVIDAD</span> →{" "}
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

export type ActivityDiagramFlowProps = {
  procedures: ProcedureActivityRow[];
  inputs: InputActivityRow[];
  outputs: OutputActivityRow[];
  activityLabel: string;
  className?: string;
};

export function ActivityDiagramFlow({
  procedures,
  inputs,
  outputs,
  activityLabel,
  className,
}: ActivityDiagramFlowProps) {
  const procedureLines = useMemo(
    () =>
      procedures.map(
        (p, i) => `${i + 1}. ${p.codProcedureActivities} - ${p.nameProcedureActivities}`
      ),
    [procedures]
  );
  const inputLines = useMemo(
    () =>
      inputs.map((inp, i) => `${i + 1}. ${inp.codInputActivities} - ${inp.nameInputActivities}`),
    [inputs]
  );
  const outputLines = useMemo(
    () =>
      outputs.map(
        (out, i) => `${i + 1}. ${out.codOutputActivities} - ${out.nameOutputActivities}`
      ),
    [outputs]
  );

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildGraph(procedureLines, inputLines, outputLines, activityLabel),
    [procedureLines, inputLines, outputLines, activityLabel]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const built = buildGraph(procedureLines, inputLines, outputLines, activityLabel);
    setNodes(built.nodes);
    setEdges(built.edges);
  }, [procedureLines, inputLines, outputLines, activityLabel, setNodes, setEdges]);

  return (
    <div
      className={
        className ??
        "h-[min(72vh,720px)] w-full min-h-[420px] rounded-md border border-border bg-muted/30 [&_.react-flow\\__attribution]:text-muted-foreground"
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
