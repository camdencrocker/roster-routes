"use client";

import React, { useMemo } from "react";
import { ReactFlow, ReactFlowProvider, Controls, useNodesState, useEdgesState, BaseEdge, EdgeProps } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { PlayerNode, PickNode, DateNode } from "@/components/TreeNode";
import tradesData from "@/data/celtics-kg-trades.json";

const nodeTypes = {
  player: PlayerNode,
  pick: PickNode,
  date: DateNode,
};

function DirectEdge({ sourceX, sourceY, targetX, targetY, style = {} }: EdgeProps) {
  const stroke = (style?.stroke as string) || "rgba(255,255,255,0.35)";
  const path = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
  return <BaseEdge path={path} style={{ stroke, strokeWidth: 2.25 }} />;
}

const edgeTypes = { direct: DirectEdge };

const BOS_COLOR = "#007A33";

function buildTree() {
  const trades = tradesData.trades as any[];
  const nodes: any[] = [];
  const edges: any[] = [];
  let y = 50;
  const centerX = 400;
  const gap = 100;

  for (let i = 0; i < trades.length; i++) {
    const t = trades[i];
    const dateId = `date-${t.id}`;
    const teamsStr = Array.isArray(t.teams) ? t.teams.join(" ↔ ") : t.teams;

    nodes.push({
      id: dateId,
      type: "date",
      position: { x: centerX - 70, y },
      data: { label: t.date, teams: teamsStr },
    });
    y += 50;

    const assets = (t.assets || []).filter((a: any) => !a.isSent);
    const assetCount = assets.length;
    const startX = centerX - ((assetCount - 1) * gap) / 2;

    for (let j = 0; j < assets.length; j++) {
      const a = assets[j];
      const nodeId = `node-${t.id}-${j}`;
      const nodeX = startX + j * gap;

      nodes.push({
        id: nodeId,
        type: a.type === "player" ? "player" : "pick",
        position: { x: nodeX, y },
        data: {
          ...a,
          label: a.name ?? a.description,
          teamBadge: a.to,
          teamColor: BOS_COLOR,
        },
      });

      edges.push({
        id: `e-${dateId}-${nodeId}`,
        source: dateId,
        target: nodeId,
        sourceHandle: "bottom",
        targetHandle: "topTarget",
        type: "direct",
      });
    }

    y += 200;
  }

  return { nodes, edges };
}

function Tree() {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(buildTree, []);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-screen bg-black">
      <div className="absolute top-4 left-4 z-10 text-white">
        <h1 className="text-2xl font-bold">{tradesData.title}</h1>
        <p className="text-zinc-400 text-sm">Origin: {tradesData.originDate}</p>
        <p className="text-zinc-500 text-xs mt-2">Patterns from Roster Routes</p>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Controls className="!bg-zinc-900 !border-white/20" />
      </ReactFlow>
    </div>
  );
}

export default function Page() {
  return (
    <ReactFlowProvider>
      <Tree />
    </ReactFlowProvider>
  );
}
