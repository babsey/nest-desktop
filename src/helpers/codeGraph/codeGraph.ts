// codeGraph.ts

import { IBaklavaViewModel, useBaklava } from "baklavajs";

import { addBaseTypes, setSettings } from "@/plugins/baklava";
import { TProject } from "@/types";

import { AbstractCodeNode } from "./codeNode";
import { BaseCode } from "../code/code";
import { BaseObj } from "../common/base";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

export class CodeGraph extends BaseObj {
  private _nodes: AbstractCodeNode[] = [];
  private _viewModel: IBaklavaViewModel;
  public _project: TProject;

  constructor(project: TProject) {
    super();
    this._project = project;

    const codeGraphStore = useCodeGraphStore();
    this._viewModel = useBaklava(codeGraphStore.state.editor);

    this.viewModel.editor.graphEvents.addNode.subscribe(Symbol(), () => this.code.generate());
    this.viewModel.editor.graphEvents.addConnection.subscribe(Symbol(), () => this.code.generate());
    this.viewModel.editor.graphEvents.removeNode.subscribe(Symbol(), () => this.code.generate());
    this.viewModel.editor.graphEvents.removeConnection.subscribe(Symbol(), () => this.code.generate());
  }

  get code(): BaseCode {
    return this.project.code;
  }

  get nodes(): AbstractCodeNode[] {
    return this.viewModel.displayedGraph.nodes as AbstractCodeNode[];
  }

  get viewModel(): IBaklavaViewModel {
    return this._viewModel;
  }

  get project(): TProject {
    return this._project;
  }

  addNodeWithCoordinates(nodeType: new () => AbstractCodeNode, x: number, y: number) {
    const n = new nodeType();
    this._nodes.push(n);
    this.viewModel.displayedGraph.addNode(n);
    n.position.x = x;
    n.position.y = y;
    return n;
  }

  // addNodes(): void {}

  // addNode(title: string, args?: any): void {
  //   const node = this.createNode(title);

  //   const nodeType = this.nodeTypes[title];
  //   node.codeTemplate = nodeType.codeTemplate;

  //   if (nodeType && nodeType.init) nodeType.init(node, args);

  //   // console.log(node);
  //   node.renderCode = function () {
  //     node.script = Mustache.render(node.codeTemplate, node.properties);
  //   };

  //   this.graph.add(node);
  // }

  // createNode(title: string): void {
  //   return new CodeNode(this, title);
  // }

  init(): void {
    this.viewModel.displayedGraph._nodes = [];
    this.viewModel.displayedGraph._connections = [];
    addBaseTypes(this.viewModel);
    setSettings(this.viewModel);
  }
}
