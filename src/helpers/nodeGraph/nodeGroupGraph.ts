// nodeGroupGraph.ts

// https://observablehq.com/d/a8c7c885db875085
// https://stackoverflow.com/questions/30655950/d3-js-convex-hull-with-2-data-points

import { drag, polygonHull } from "d3";
import { nextTick } from "vue";

import { TDragBehavior, TNetwork, TNetworkGraph, TNode, TNodeGroup } from "@/types";

export const polygonGenerator = (nodes: TNode[]): [number, number][] => {
  let nodeCoords: [number, number][] = nodes.map((node: TNode) => [node.view.position.x, node.view.position.y]);

  // The two additional points will be sufficient for the convex hull algorithm.
  if (nodes.length == 2) {
    const pos1 = nodes[0].view.position;
    const pos2 = nodes[1].view.position;

    // [dx, dy] is the direction vector of the line.
    let dx = pos2.x - pos1.x;
    let dy = pos2.y - pos1.y;

    // Scale it to something very small.
    dx *= 0.001;
    dy *= 0.001;

    // Orthogonal directions to a 2D vector [dx, dy] are [dy, -dx] and [-dy, dx]
    // take the midpoint [mx, my] of the line and translate it in both directions.
    const mx = (pos1.x + pos2.x) * 0.5;
    const my = (pos1.y + pos2.y) * 0.5;
    nodeCoords = nodeCoords.concat([
      [mx + dy, my - dx],
      [mx - dy, my + dx],
    ]);
  }

  // Get positions of outer points.
  return polygonHull(nodeCoords) as [number, number][];
};

export class NodeGroupGraph {
  private _networkGraph: TNetworkGraph;

  constructor(networkGraph: TNetworkGraph) {
    this._networkGraph = networkGraph;
  }

  get network(): TNetwork {
    return this._networkGraph.network;
  }

  /**
   * Drag connection graph by moving its node graphs.
   * @param event mouse event
   * @param nodeGroup node group object
   */
  drag(event: MouseEvent, nodeGroup: TNodeGroup): void {
    // @ts-expect-error Property 'dx'/'dy' does not exist on type 'MouseEvent'.
    const pos: { x: number; y: number } = { x: event.dx, y: event.dy };

    nodeGroup.nodeItemsDeep.forEach((node: TNode) => {
      const nodePosition = node.view.position;
      nodePosition.x += pos.x;
      nodePosition.y += pos.y;
    });
    nodeGroup.view.updateCentroid();

    nextTick(() => this._networkGraph.render());
  }

  /**
   * Initialize node group graph.
   */
  init(): void {}

  /**
   * Render node group graph.
   */
  render(): void {
    const nodeGroups = this._networkGraph.selector.selectAll(".nodeGroupArea");

    nodeGroups
      .selectAll("path")
      .attr(
        "d",
        (nodeGroup: TNodeGroup | any) =>
          "M" +
          nodeGroup.view.state.polygon
            .map((point: [number, number]) => [
              point[0] - nodeGroup.view.position.x,
              point[1] - nodeGroup.view.position.y,
            ])
            .join("L") +
          "Z",
      );

    nodeGroups.attr(
      "transform",
      (n: TNodeGroup | any) => `translate(${n.view.position.x},${n.view.position.y}) scale(${n.view.state.margin})`,
    );
  }

  /**
   * Update node group graph.
   */
  update(): void {
    const elem = this._networkGraph.selector
      .select("#nodeGroups")
      .selectAll(".nodeGroupArea")
      .data(this.network.nodes.nodeGroups.toReversed(), (n: TNodeGroup) => (n.isGroup ? n.uuid : ""));

    const dragging: TDragBehavior = drag()
      .on("start", (e: MouseEvent) => this._networkGraph.dragStart(e))
      .on("drag", (e: MouseEvent, n: TNodeGroup | unknown) => this.drag(e, n as TNodeGroup))
      .on("end", (e: MouseEvent) => this._networkGraph.dragEnd(e));

    const g = elem.enter().append("g").style("cursor-events", "none").attr("class", "nodeGroupArea");

    g.append("path")
      .style("fill", (n: TNodeGroup) => "var(--colorNode" + n.idx + ")")
      .style("stroke", (n: TNodeGroup) => "var(--colorNode" + n.idx + ")")
      .style("stroke-linejoin", "round")
      .attr("stroke-width", 64)
      .style("opacity", 0.12);

    // g.append("circle").attr("r", 20).attr("fill", "white");

    // g.append("text")
    //   .attr("dy", "0.5em")
    //   .attr("letter-spacing", 1.5)
    //   .style("font-family", "Roboto, sans-serif", "important")
    //   .style("font-size", "0.85rem", "important")
    //   .style("font-weight", "800")
    //   .style("pointer-events", "none")
    //   .style("text-anchor", "middle")
    //   .style("text-transform", "uppercase", "important")
    //   .style("fill", (n: TNodeGroup) => "var(--colorNode" + n.idx + ")")
    //   .text((n: TNodeGroup) => n.view.label);

    elem.on("mouseover", (_: MouseEvent, n: TNodeGroup) => {
      n.view.focus();

      // Draw line between selected node and focused node.
      if (n.parent.network.connections.state.selectedNode && this._networkGraph.workspace.state.dragLine) {
        const selectedNode = n.parent.network.connections.state.selectedNode;
        const sourcePos = selectedNode.view.position;
        this._networkGraph.workspace.dragline.drawPath(sourcePos, n.view.state.centroid);
      }
    });

    elem.on("mouseout", () => {
      this.network.nodes.unfocusNode();
    });

    elem.on("click", (e: MouseEvent, nodeGroup: TNodeGroup) => {
      const nodes = this._networkGraph.network.nodes;
      const connections = this._networkGraph.network.connections;

      if (connections.state.selectedNode && this._networkGraph.workspace.state.dragLine) {
        // Set cursor position of the focused node.
        this._networkGraph.workspace.updateCursorPosition(nodeGroup.view.state.centroid);

        this._networkGraph.workspace.animationOff();

        this._networkGraph.network.connectNodes(connections.state.selectedNode.idx, nodeGroup.idx);
        this._networkGraph.update();

        if (!this._networkGraph.workspace.altPressed) {
          connections.state.selectedNode = null;
          this._networkGraph.workspace.reset();
          this._networkGraph.workspace.update();
        }
      } else if (this._networkGraph.workspace.altPressed) {
        nodeGroup.selectForConnection();
        this._networkGraph.workspace.reset();
        this._networkGraph.workspace.dragline.init(e);
      } else if (this._networkGraph.workspace.ctrlPressed) {
        nodeGroup.toggleSelection();
      } else {
        nodes.unselectNodes();
        nodeGroup.select();
      }
    });

    /**
     * Trigger node menu on right mouse click.
     */
    elem.on("contextmenu", (event: MouseEvent, nodeGroup: TNodeGroup) => {
      event.preventDefault();
      this._networkGraph.workspace.reset();

      this._networkGraph.openContextMenu([event.clientX, event.clientY], {
        nodeGroup,
      });
    });

    elem.call(dragging, null);

    elem.exit().remove();

    nextTick(() => this.render());
  }
}
