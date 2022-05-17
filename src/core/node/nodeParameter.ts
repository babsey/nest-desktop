import { ModelParameter } from '../model/modelParameter';
import { Node } from './node';
import { NodeCompartment } from './nodeCompartment/nodeCompartment';
import { NodeReceptor } from './nodeReceptor/nodeReceptor';
import { Parameter } from '../parameter/parameter';

type nodeTypes = Node | NodeCompartment | NodeReceptor;

export class NodeParameter extends Parameter {
  constructor(node: nodeTypes, param: any) {
    super(node, param);
  }

  get node(): Node {
    return this.parent as Node;
  }

  /**
   * Get options from the model component.
   */
  override get options(): ModelParameter {
    const param: ModelParameter = this.node.model
      ? this.node.model.params.find((p: ModelParameter) => p.id === this.id)
      : undefined;
    return param;
  }

  /**
   * Reset the constant value taken from the node component.
   */
  override reset(): void {
    this.type = 'constant';
    this.value = this.options.value;
  }

  /**
   * Trigger changes when the parameter is changed.
   */
  override paramChanges(): void {
    this.node.nodeChanges();
  }

  /**
   * Serialize for JSON.
   * @return node parameter object
   */
  override toJSON(): any {
    const param: any = {
      id: this.id,
      value: this.value,
    };

    param.visible = this.visible;

    // Add the value factors if existed.
    if (this.factors.length > 0) {
      param.factors = this.factors;
    }

    // Add the parameter type if not constant.
    if (!this.isConstant) {
      param.type = this.type;
    }

    // Add the rules for validation if existed.
    if (this.rules.length > 0) {
      param.rules = this.rules;
    }

    return param;
  }
}
