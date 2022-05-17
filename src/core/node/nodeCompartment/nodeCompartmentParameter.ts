import { NodeCompartment } from './nodeCompartment';
import { NodeParameter } from '../nodeParameter';
import { ModelCompartmentParameter } from '../../model/modelCompartmentParameter';

export class NodeCompartmentParameter extends NodeParameter {
  constructor(nodeCompartment: NodeCompartment, param: any) {
    super(nodeCompartment, param);
  }

  get nodeCompartment(): NodeCompartment {
    return this.parent as NodeCompartment;
  }

  /**
   * Get options from the model compartment component.
   */
  override get options(): ModelCompartmentParameter {
    const param: ModelCompartmentParameter = this.nodeCompartment.node.model
      ? this.nodeCompartment.node.model.compartmentParams.find(
          (p: ModelCompartmentParameter) => p.id === this.id
        )
      : undefined;
    return param;
  }

  /**
   * Trigger changes when the parameter is changed.
   */
  override paramChanges(): void {
    this.nodeCompartment.nodeChanges();
  }
}
