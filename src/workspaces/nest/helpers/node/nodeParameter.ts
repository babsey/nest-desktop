// nodeParameter.ts

import { TNodeParameterParent } from "@/types";

import { IParamProps } from "@/helpers/common/parameter";
import { NodeParameter } from "@/helpers/node/nodeParameter";

import { NESTNetwork } from "../../types";
import { updateNESTParameterInterface } from "../codeNodeTypes/nest/nestParameters";

export class NESTNodeParameter extends NodeParameter {
  constructor(node: TNodeParameterParent, paramProps: IParamProps) {
    super(node, paramProps);
  }

  get network(): NESTNetwork {
    return this.node.network;
  }

  get node(): TNodeParameterParent {
    return this._node;
  }

  override get parent(): TNodeParameterParent {
    return this.node;
  }

  /**
   * Updates when parameter is changed.
   */
  override toggleRandom(): void {
    if (this.codeNode) {
      updateNESTParameterInterface(
        this.network.project.code.graph,
        this.codeNode,
        this.id,
        this.state.random ? undefined : "uniform",
      );
    }
    this.parent.onUpdate();
  }
}
