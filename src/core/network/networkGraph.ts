import * as d3 from 'd3';

import { Connection } from '../connection/connection';
import { ConnectionGraph } from '../connection/connectionGraph';
import { Network } from './network';
import { NodeGraph } from '../node/nodeGraph';
import { Node } from '../node/node';

export class NetworkGraph {
  private _connectionGraph: ConnectionGraph;
  private _cursorPosition: any = { x: 0, y: 0 };
  private _height: number = 600;
  private _network: Network;
  private _nodeGraph: NodeGraph;
  private _selector: d3.Selection<any, any, any, any>;
  private _state: any = {
    centerNetwork: true,
    centerSelected: false,
    connected: false,
    dragging: false,
    enableConnection: false,
    keyCode: null,
    transforming: false,
    showGrid: false,
  };
  private _strokeWidth: number = 3;
  private _width: number = 800;
  private _zoom: any;
  private _transform: any = { k: 1, x: 0, y: 0 };

  constructor(selector: string) {
    this._selector = d3.select(selector);
    this._connectionGraph = new ConnectionGraph(this);
    this._nodeGraph = new NodeGraph(this);

    d3.select('body')
      .on('keyup', (event: any) => {
        this._state.keyCode = null;
        if (event.keyCode === 27) {
          // Escape
          this.reset();
          this.update();
        }
      })
      .on('keydown', (event: any) => {
        this._state.keyCode = event.keyCode;
      });

    this.initZoom();
    this.initPanel();
    this.initBackground();
  }

  get connectionGraph(): ConnectionGraph {
    return this._connectionGraph;
  }

  set cursorPosition(value: any) {
    this._cursorPosition = value;
  }

  get network(): Network {
    return this._network;
  }

  set network(value: Network) {
    this._network = value;
  }

  get selector(): d3.Selection<any, any, any, any> {
    return this._selector;
  }

  get state(): any {
    return this._state;
  }

  get strokeWidth(): number {
    return this._strokeWidth;
  }

  /**
   * Initialize panel.
   */
  initPanel(): void {
    const selectPanel: d3.Selection<any, any, any, any> =
      this._selector.select('g#panel');
    selectPanel.style('display', 'none');
    selectPanel
      .append('circle')
      .attr('class', 'select')
      .attr('fill', 'white')
      .attr('fill-opacity', '0.8')
      .attr('r', this._nodeGraph.nodeRadius - this._strokeWidth)
      .on('click', () => {
        this.reset();
      })
      .on('contextmenu', (e: MouseEvent) => {
        e.preventDefault();
        this.reset();
      });

    const arcFrame: d3.Arc<any, any> = d3
      .arc()
      .innerRadius(this._nodeGraph.nodeRadius - this._strokeWidth)
      .outerRadius(this._nodeGraph.nodeRadius * 2);

    const elementTypes: string[] = ['recorder', 'neuron', 'stimulator'];
    elementTypes.forEach((elementType: string, idx: number) => {
      const panel: d3.Selection<any, any, any, any> = selectPanel
        .append('g')
        .attr('class', 'select ' + elementType)
        .append('path')
        .datum({
          startAngle: (Math.PI * idx * 2) / 3,
          endAngle: (Math.PI * (idx + 1) * 2) / 3,
        })
        .style('fill', 'white')
        .attr('fill-opacity', '0.8')
        .style('cursor', 'pointer')
        .style('stroke', () => {
          return this._network
            ? this._network.view.getNodeColor(this._network.nodes.length)
            : 'grey';
        })
        .style('stroke-width', this._strokeWidth)
        .attr('d', arcFrame)
        .on('mouseover', () => {
          this._selector
            .select('g#panel')
            .select('g.tooltip')
            .style('visibility', 'visible')
            .select('text.label')
            .text(elementType);
          panel.style('fill', () => {
            return this._network
              ? this._network.view.getNodeColor(this._network.nodes.length)
              : 'grey';
          });
        })
        .on('mouseout', () => {
          this._selector
            .select('g#panel')
            .select('g.tooltip')
            .style('visibility', 'hidden')
            .select('text.label')
            .text('');
          panel.style('fill', 'white');
        })
        .on('mouseup', () => {
          this.reset();
          this._network.createNode({
            elementType,
            position: JSON.parse(JSON.stringify(this._cursorPosition)),
          });
        });

      const f: number = (idx * 2) / 3 + 1 / 3;
      selectPanel
        .append('text')
        .attr('class', 'select label')
        .style('font-size', '11px')
        .style('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .attr('fill', 'black')
        .attr('dx', Math.sin(Math.PI * f) * 28)
        .attr('dy', -Math.cos(Math.PI * f) * 28 + 5)
        .text(elementType.slice(0, 1).toUpperCase());
    });

    selectPanel
      .append('g')
      .attr('class', 'tooltip')
      .attr('transform', 'translate(0, -45)')
      .style('visibility', 'hidden');

    selectPanel
      .select('g.tooltip')
      .append('rect')
      .attr('transform', 'translate(-37, -14)')
      .attr('width', '74px')
      .attr('height', '16px')
      .attr('fill', 'white');

    selectPanel
      .select('g.tooltip')
      .append('text')
      .attr('class', 'label')
      .style('text-anchor', 'middle');
  }

  /**
   * Reset line.
   */
  resetDragLine(): void {
    this._selector.selectAll('.dragline').style('opacity', 0);
  }

  /**
   * Draw line.
   */
  dragLine(e: MouseEvent): void {
    if (this._network.view.selectedNode !== null) {
      const selectedNode: Node = this._network.view.selectedNode;
      const source: any = selectedNode.view.position;
      const position: number[] = d3.pointer(
        e,
        this._selector.select('g#network').node()
      );
      const target: any = {
        x: position[0],
        y: position[1],
      };
      this._selector
        .selectAll('.dragline')
        .style('opacity', 0.5)
        .style('stroke', selectedNode.view.color)
        .attr('d', () =>
          this._connectionGraph.drawPath(source, target, {
            isTargetMouse: true,
          })
        );
    } else {
      console.log('No node was selected when dragLine() got executed!');
    }
  }

  /**
   * Draw connection line between nodes.
   */
  drawLineNodes(source: Node, target: Node) {
    this._selector
      .selectAll('.dragline')
      .style('opacity', 1)
      .attr('d', () =>
        this._connectionGraph.drawPath(
          source.view.position,
          target.view.position
        )
      );
  }

  /**
   * Initialize zoom handler.
   */
  initZoom(): void {
    this._zoom = d3
      .zoom()
      .extent([
        [0, 0],
        [this._width, this._height],
      ])
      .scaleExtent([0.5, 2])
      .on('zoom', ({ transform }) => {
        this._transform = transform;
        if (this._state.transforming) {
          this._selector
            .select('g#network')
            .transition()
            .attr('transform', transform);
        } else {
          this._selector.select('g#network').attr('transform', transform);
        }
      })
      .on('end', () => {
        // necessary to reset the cursor when dragging the background
        this._selector.select('rect#background').style('cursor', 'default');
        //document.getElementsByTagName('body')[0].style.cursor = 'move';
      });
  }

  /**
   * Update cursor position.
   */
  updateCursorPosition(e: MouseEvent): void {
    const position: number[] = d3.pointer(
      e,
      this._selector.select('g#network').node()
    );
    this._cursorPosition.x = position[0];
    this._cursorPosition.y = position[1];
  }

  /**
   * Initialize background.
   */
  initBackground(): void {
    this._selector
      .select('rect#background')
      .on('mousemove', (e: MouseEvent) => {
        this.updateCursorPosition(e);
        this._network.view.resetFocus();
        if (this._state.enableConnection) {
          this.dragLine(e);
        }
      })
      .on('click', () => {
        if (this._state.enableConnection) {
          this.resetDragLine();
          this._state.enableConnection = false;
        } else {
          this.reset();
        }
        this.update();
      })
      .on('mousedown', () => {
        this._selector.select('rect#background').style('cursor', 'move');
        // Beware: Setting default with "on('mouseup', ...)" does not work,
        // therefore the resetting takes place in the zoom method ('end').
      })
      .on('contextmenu', (e: MouseEvent) => {
        // console.log(event);
        e.preventDefault();
        this.updateCursorPosition(e);

        this._selector
          .select('g#panel')
          .selectAll('path')
          .style('stroke', () =>
            this._network.view.getNodeColor(this._network.nodes.length)
          );

        this._selector
          .select('g#panel')
          .style('display', 'block')
          .attr(
            'transform',
            () =>
              `translate(${this._cursorPosition.x},${this._cursorPosition.y})`
          )
          .style('opacity', '0.8');
      })
      .call(this._zoom);
  }

  /**
   * Initialize network graph.
   */
  init() {
    // console.log('Init network graph');

    // Define drag behavior for node.
    const dragNode: d3.DragBehavior<any, any, any> = d3
      .drag()
      .on('start', (event: any) => {
        this._state.dragging = true;
        d3.select(event.sourceEvent.srcElement.parentNode).classed(
          'active',
          true
        );
        // .raise();
        d3.select(event.sourceEvent.srcElement).style('cursor', 'grabbing');
      })
      .on('drag', (event: MouseEvent, node: Node) => {
        if (!this._state.enableConnection) {
          node.view.position.x = event.x;
          node.view.position.y = event.y;
          this.update();
        }
      })
      .on('end', (event: any) => {
        this._state.dragging = false;
        // If-clause to prevent the error message when mouseup happens
        // outside the window:
        if (event.sourceEvent.srcElement.parentNode instanceof Node) {
          d3.select(event.sourceEvent.srcElement.parentNode).classed(
            'active',
            false
          );
          d3.select(event.sourceEvent.srcElement).style('cursor', 'pointer');
        }
        // d3.selectAll('g.node').sort((a: Node, b: Node) =>
        //   d3.ascending(a.idx, b.idx)
        // );
        this.update();
        this.transform();
      });

    const connections: d3.Selection<any, any, any, any> = this._selector
      .select('g#connections')
      .selectAll('g.connection')
      .data(this._network.connections);

    connections
      .enter()
      .append('g')
      .attr('class', 'connection')
      .attr('idx', (connection: Connection) => connection.idx)
      .style('opacity', 0)
      .merge(connections)
      .each((_, i, e) => this._connectionGraph.init(i, e));

    connections.exit().remove();

    const nodes: d3.Selection<any, any, any, any> = this._selector
      .select('g#nodes')
      .selectAll('g.node')
      .data(this._network.nodes);

    nodes
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('idx', (node: Node) => node.idx)
      .style('opacity', 0)
      .call(dragNode)
      .merge(nodes)
      .each((n, i, e) => this._nodeGraph.init(n, i, e));

    nodes.exit().remove();

    this._state.connected = false;
  }

  /**
   * Generate data for the grid.
   */
  gridData() {
    const data = new Array();
    const offset = 10;
    const width = 25;
    const height = 25;
    const nrows = (this._height / height) * 3;
    const ncolumns = (this._width / width) * 3;

    // iterate for rows
    for (let row = 0; row < nrows - 1; row++) {
      data.push({
        x1: -this._width,
        x2: this._width * 2,
        y1: offset + row * height - this._height,
        y2: offset + row * height - this._height,
      });
    }

    // iterate for columns
    for (let column = 0; column < ncolumns - 1; column++) {
      data.push({
        x1: offset + column * width - this._width,
        x2: offset + column * width - this._width,
        y1: -this._height,
        y2: this._height * 2,
      });
    }
    return data;
  }

  /**
   * Update graph for the grid.
   */
  updateGridGraph() {
    const gridData: any[] = this.gridData();

    const gridLines: d3.Selection<any, any, any, any> = this._selector
      .selectAll('.grid')
      .selectAll('.gridLine')
      .data(gridData);

    gridLines
      .enter()
      .append('line')
      .attr('class', 'gridLine')
      .attr('stroke', '#eee')
      .style('pointer-events', 'none')
      .merge(gridLines)
      .attr('x1', (d: any) => d.x1)
      .attr('x2', (d: any) => d.x2)
      .attr('y1', (d: any) => d.y1)
      .attr('y2', (d: any) => d.y2)
      .style('opacity', this._state.showGrid ? 1 : 0);

    gridLines.exit().remove();
  }

  /**
   * Update network graph.
   */
  update() {
    // console.log('Update network graph');
    this._connectionGraph.update();
    this._nodeGraph.update();
  }

  /**
   * Center position of network graph.
   */
  centerNetworkPos(): { x: number; y: number } {
    // console.log('Center network pos');
    const X: number[] = [];
    const Y: number[] = [];
    this._network.nodes.forEach((node: Node) => {
      X.push(node.view.position.x);
      Y.push(node.view.position.y);
    });
    const x: number = (d3.min(X) + d3.max(X)) / 2;
    const y: number = (d3.min(Y) + d3.max(Y)) / 2;
    return { x, y };
  }

  /**
   * Transform network graph.
   */
  transform(): void {
    // console.log('Transform network graph');
    if (this._state.centerNetwork || this._state.centerSelected) {
      let x: number = 0,
        y: number = 0;
      if (this._state.centerSelected && this._network.view.selectedNode) {
        x = this._network.view.selectedNode.view.position.x;
        y = this._network.view.selectedNode.view.position.y;
      } else if (
        this._state.centerSelected &&
        this._network.view.selectedConnection
      ) {
        const source: any =
          this._network.view.selectedConnection.source.view.position;
        const target: any =
          this._network.view.selectedConnection.target.view.position;
        x = d3.mean([source.x, target.x]);
        y = d3.mean([source.y, target.y]);
      } else if (this._network.nodes.length > 0) {
        const networkCenterPos = this.centerNetworkPos();
        x = networkCenterPos.x;
        y = networkCenterPos.y;
      }
      this._transform.x = this._width / 2 - x * this._transform.k;
      this._transform.y = this._height / 2 - y * this._transform.k;

      this._state.transforming = true;
      this._selector
        .select('rect#background')
        .call(
          this._zoom.transform,
          d3.zoomIdentity
            .translate(this._transform.x, this._transform.y)
            .scale(this._transform.k)
        );
      this._state.transforming = false;
    }
  }

  /**
   * Toggle center of network graph.
   */
  toggleCenterNetwork(): void {
    this._state.centerNetwork = !this._state.centerNetwork;
    this.transform();
  }

  /**
   * Toggle center of selected.
   */
  toggleCenterSelected(): void {
    this._state.centerSelected = !this._state.centerSelected;
    this.transform();
  }

  /**
   * Toggle grid graph.
   */
  toggleGrid(): void {
    this._state.showGrid = !this._state.showGrid;
    this.updateGridGraph();
  }

  /**
   * Resize graph.
   */
  resize(width: number = 0, height: number = 0): void {
    this._width = width || this._width;
    this._height = height || this._height;
    this._selector.attr('width', this._width).attr('height', this._height);
    this._selector
      .select('rect#background')
      .attr('width', this._width)
      .attr('height', this._height);
  }

  /**
   * Reset graph.
   */
  reset(): void {
    // console.log('Reset graph');
    this._selector
      .select('g#panel')
      .style('display', 'none')
      .style('opacity', '0');

    if (![18, 225].includes(this._state.keyCode)) {
      // Alt
      this.resetDragLine();
      this._state.enableConnection = false;
      this._network.view.reset();
    }
  }
}