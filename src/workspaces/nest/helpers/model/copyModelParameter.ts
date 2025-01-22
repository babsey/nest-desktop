// copyModelParameter.ts

import { BaseParameter, IParamProps } from "@/helpers/common/parameter";
import { ModelParameter } from "@/helpers/model/modelParameter";
import { TModel } from "@/types";

import { NESTCopyModel } from "./copyModel";

export class NESTCopyModelParameter extends BaseParameter {
  private _copyModel: NESTCopyModel;

  constructor(model: NESTCopyModel, paramProps: IParamProps) {
    super(paramProps, { minLevel: 3 });
    this._copyModel = model;
  }

  get copyModel(): NESTCopyModel {
    return this._copyModel;
  }

  get isWeightRecorder(): boolean {
    return this.id === "weight_recorder";
  }

  get model(): TModel {
    return this._copyModel.model as TModel;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.model.params[this.id];
  }

  override get parent(): NESTCopyModel {
    return this.copyModel;
  }

  override set visible(value: boolean) {
    if (this.id === "weight_recorder") return;
    const isVisible = this.parent.paramsVisible.includes(this.id);
    if (value && !isVisible) {
      this.parent.paramsVisible.push(this.id);
    } else if (!value && isVisible) {
      this.parent.paramsVisible = this.parent.paramsVisible.filter((paramId: string) => paramId !== this.id);
    }
  }

  /**
   * Serialize for JSON.
   * @return model parameter object
   */
  override toJSON(): IParamProps {
    const paramProps: IParamProps = {
      id: this.id,
      value: this.value,
    };

    // if (this.component === "valueSlider") {
    //   paramProps.min = this.min;
    //   paramProps.max = this.max;
    //   paramProps.step = this.step;
    // } else if (this.component === "tickSlider") {
    //   paramProps.ticks = this.ticks;
    // }

    // // Add rules for validation if existed.
    // if (this.rules.length > 0) paramProps.rules = this.rules;

    // Add label if existed.
    if (this.label) paramProps.label = this.label;

    // Add value factors if existed.
    if (this.factors.length > 0) paramProps.factors = this.factors;

    // Add rules for validation if existed.
    if (this.rules.length > 0) paramProps.rules = this.rules;

    // Add param type if not constant.
    if (!this.isConstant) paramProps.type = this.typeToJSON();

    return paramProps;
  }
}
