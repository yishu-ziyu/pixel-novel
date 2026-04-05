import React, { useMemo } from 'react';
import { NovelScript, Scene } from '../engine';

interface BranchTreeViewerProps {
  script: NovelScript;
  currentSceneId?: string;
  visitedSceneIds?: string[];
  onSceneSelect?: (sceneId: string) => void;
}

interface TreeNode {
  id: string;
  scene: Scene;
  x: number;
  y: number;
  level: number;
  parent?: TreeNode;
  children: TreeNode[];
}

export const BranchTreeViewer: React.FC<BranchTreeViewerProps> = ({
  script,
  currentSceneId,
  visitedSceneIds = [],
  onSceneSelect,
}) => {
  const { tree, maxLevel, maxNodesInLevel } = useMemo(() => {
    const sceneMap = new Map<string, Scene>();
    const childrenMap = new Map<string, string[]>();

    script.scenes.forEach((scene) => {
      sceneMap.set(scene.id, scene);
      
      scene.dialogues.forEach((dialogue) => {
        if (dialogue.choices) {
          dialogue.choices.forEach((choice) => {
            const existing = childrenMap.get(scene.id) || [];
            if (!existing.includes(choice.nextSceneId)) {
              existing.push(choice.nextSceneId);
              childrenMap.set(scene.id, existing);
            }
          });
        }
      });
    });

    const rootId = script.scenes[0]?.id;
    const nodes: TreeNode[] = [];
    const nodesByLevel: number[] = [];
    const visited = new Set<string>();

    const buildTree = (id: string, level: number = 0, parent?: TreeNode): TreeNode | null => {
      if (visited.has(id)) return null;
      visited.add(id);

      const scene = sceneMap.get(id);
      if (!scene) return null;

      nodesByLevel[level] = (nodesByLevel[level] || 0) + 1;
      
      const node: TreeNode = {
        id,
        scene,
        x: 0,
        y: 0,
        level,
        parent,
        children: [],
      };

      nodes.push(node);

      const children = childrenMap.get(id) || [];
      children.forEach((childId) => {
        const child = buildTree(childId, level + 1, node);
        if (child) {
          node.children.push(child);
        }
      });

      return node;
    };

    buildTree(rootId);

    const levelWidths = nodesByLevel.map((count) => count * 120 + (count - 1) * 40);
    const maxWidth = Math.max(...levelWidths, 1);
    const levelOffsets = levelWidths.map((w) => (maxWidth - w) / 2);

    const nodeIndexInLevel = new Map<number, number>();
    nodes.forEach((node) => {
      const idx = nodeIndexInLevel.get(node.level) || 0;
      nodeIndexInLevel.set(node.level, idx + 1);
      
      node.x = levelOffsets[node.level] + idx * 160 + 60;
      node.y = node.level * 100 + 60;
    });

    return {
      tree: nodes,
      maxLevel: nodesByLevel.length - 1,
      maxNodesInLevel: Math.max(...nodesByLevel, 1),
    };
  }, [script]);

  const width = maxNodesInLevel * 160 + 120;
  const height = (maxLevel + 1) * 100 + 120;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(10, 10, 30, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 100,
        padding: 20,
        overflow: 'auto',
      }}
    >
      <div
        style={{
          color: '#ffcc00',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 16,
          marginBottom: 20,
          textShadow: '2px 2px 0 #000',
        }}
      >
        故事分支
      </div>

      <div
        style={{
          position: 'relative',
          minWidth: width,
          minHeight: height,
        }}
      >
        <svg
          width={width}
          height={height}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {tree.map((node) =>
            node.children.map((child, idx) => (
              <line
                key={`${node.id}-${child.id}`}
                x1={node.x}
                y1={node.y + 30}
                x2={child.x}
                y2={child.y - 30}
                stroke={
                  visitedSceneIds.includes(node.id) && visitedSceneIds.includes(child.id)
                    ? '#4ecdc4'
                    : '#333'
                }
                strokeWidth="2"
              />
            ))
          )}
        </svg>

        {tree.map((node) => {
          const isVisited = visitedSceneIds.includes(node.id);
          const isCurrent = node.id === currentSceneId;
          const hasChoices = node.scene.dialogues.some((d) => d.choices && d.choices.length > 0);

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: node.x - 50,
                top: node.y - 25,
                width: 100,
                height: 50,
                backgroundColor: isCurrent
                  ? 'rgba(78, 205, 196, 0.3)'
                  : isVisited
                  ? 'rgba(255, 204, 0, 0.2)'
                  : 'rgba(50, 50, 80, 0.4)',
                border: `3px solid ${isCurrent ? '#4ecdc4' : isVisited ? '#ffcc00' : '#444'}`,
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: onSceneSelect && isVisited ? 'pointer' : 'default',
                transition: 'all 0.2s',
                boxShadow: isCurrent ? '0 0 20px rgba(78, 205, 196, 0.5)' : 'none',
              }}
              onClick={() => onSceneSelect && isVisited && onSceneSelect(node.id)}
              onMouseEnter={(e) => {
                if (onSceneSelect && isVisited) {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div
                style={{
                  color: '#fff',
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 8,
                  textAlign: 'center',
                  maxWidth: 90,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={node.scene.id}
              >
                {node.scene.id}
              </div>
              {hasChoices && (
                <div
                  style={{
                    color: '#4ecdc4',
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: 6,
                    marginTop: 4,
                  }}
                >
                  ◆
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 20,
          marginTop: 20,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: 'rgba(78, 205, 196, 0.3)',
              border: '2px solid #4ecdc4',
              borderRadius: 4,
            }}
          />
          <span
            style={{
              color: '#fff',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 8,
            }}
          >
            当前
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: 'rgba(255, 204, 0, 0.2)',
              border: '2px solid #ffcc00',
              borderRadius: 4,
            }}
          />
          <span
            style={{
              color: '#fff',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 8,
            }}
          >
            已访问
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: 'rgba(50, 50, 80, 0.4)',
              border: '2px solid #444',
              borderRadius: 4,
            }}
          />
          <span
            style={{
              color: '#fff',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 8,
            }}
          >
            未解锁
          </span>
        </div>
      </div>
    </div>
  );
};
