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
import { getTrazabilidadLabel } from "./obs";
import type { Eslabon } from "./columns";

const BOX_CLASS =
  "rounded-lg border-2 border-black bg-white text-black p-4 min-w-[150px] max-w-[240px] shadow-md flex flex-col items-center justify-center gap-1";

type EslabonNodeData = {
  numLabel: string;
  subtitle: string;
};

type EslabonRFNode = Node<EslabonNodeData, "eslabon">;

function EslabonFlowNodeInner({ data }: NodeProps<EslabonRFNode>) {
  return (
    <>
      <Handle type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
      <div className={BOX_CLASS}>
        <span className="text-lg font-bold">{data.numLabel}</span>
        <span className="text-center text-sm font-medium">{data.subtitle}</span>
      </div>
      <Handle type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border !border-blue-600 !bg-white" />
    </>
  );
}

const EslabonFlowNode = memo(EslabonFlowNodeInner);

const nodeTypes = { eslabon: EslabonFlowNode };

const NODE_STEP_X = 280;
const NODE_Y = 48;

function trazabilidadCode(e: Eslabon) {
  return getTrazabilidadLabel(e.numPrecedenciaTrazabilidad).split(" ")[0] ?? "";
}

function buildGraph(eslabones: Eslabon[]) {
  const sorted = [...eslabones].sort(
    (a, b) => a.numPrecedenciaProductiva - b.numPrecedenciaProductiva
  );

  const nodes: EslabonRFNode[] = sorted.map((e, index) => ({
    id: String(e.idDlkProductionChain),
    type: "eslabon",
    position: { x: index * NODE_STEP_X, y: NODE_Y },
    data: {
      numLabel: String(e.numPrecedenciaProductiva),
      subtitle: `${trazabilidadCode(e)} - ${e.nameProductionChain}`,
    },
    draggable: false,
    selectable: true,
  }));

  const edges: Edge[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    edges.push({
      id: `e-${a.idDlkProductionChain}-${b.idDlkProductionChain}`,
      source: String(a.idDlkProductionChain),
      target: String(b.idDlkProductionChain),
      animated: true,
      style: { stroke: "#2563eb", strokeWidth: 2 },
    });
  }

  return { sorted, nodes, edges };
}

function EslabonChainLegendPanel() {
  return (
    <Panel
      position="top-right"
      className="nodrag nopan m-2 max-w-[240px] rounded-lg border border-border bg-background/95 p-3 text-xs shadow-md backdrop-blur-sm"
    >
      <p className="mb-2 font-semibold text-foreground">Leyenda</p>
      <ul className="space-y-1.5 leading-snug text-muted-foreground">
        <li>
          <span className="font-medium text-foreground">Nodo:</span> eslabón de la cadena (recuadro con borde).
        </li>
        <li>
          <span className="font-medium text-foreground">Arriba:</span> numeral de secuencia de cadena productiva.
        </li>
        <li>
          <span className="font-medium text-foreground">Abajo:</span> código de trazabilidad y nombre del eslabón.
        </li>
        <li>
          <span className="font-medium text-foreground">Flechas azules:</span> orden entre eslabones consecutivos.
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
      fitView({ padding: 0.2, duration: 200 });
    });
    return () => cancelAnimationFrame(t);
  }, [nodeCount, fitView]);
  return null;
}

type EslabonChainFlowProps = {
  eslabones: Eslabon[];
  className?: string;
};

export function EslabonChainFlow({ eslabones, className }: EslabonChainFlowProps) {
  const { sorted, nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildGraph(eslabones),
    [eslabones]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const built = buildGraph(eslabones);
    setNodes(built.nodes);
    setEdges(built.edges);
  }, [eslabones, setNodes, setEdges]);

  if (sorted.length === 0) {
    return null;
  }

  return (
    <div
      className={
        className ??
        "h-[min(55vh,520px)] w-full min-h-[360px] rounded-md border border-border bg-muted/30 [&_.react-flow\_\_attribution]:text-muted-foreground"
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
        maxZoom={1.5}
      >
        <FitViewOnData nodeCount={nodes.length} />
        <EslabonChainLegendPanel />
        <Controls showInteractive={false} />
        <MiniMap zoomable pannable />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}
