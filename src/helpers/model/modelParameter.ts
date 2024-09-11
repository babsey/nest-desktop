// modelParameter.ts

import { TModel } from "@/types";

import { IParamProps, Parameter } from "../common/parameter";

export interface IModelParamProps extends IParamProps {}

export class ModelParameter extends Parameter {
  private _model: TModel;

  constructor(model: TModel, paramProps: IModelParamProps) {
    super(paramProps, { minLevel: 3 });
    this._model = model;
  }

  get model(): TModel {
    return this._model;
  }

  /**
   * Get model parameter.
   */
  override get modelParam(): ModelParameter {
    return this.model.params[this.id];
  }

  override get parent(): TModel {
    return this.model;
  }

  /**
   * Serialize for JSON.
   * @return model parameter object
   */
  override toJSON(): IModelParamProps {
    const paramProps: IModelParamProps = {
      id: this.id,
      label: this.label,
      value: this.value,
      // visible: this.visible as boolean,
    };

    if (this.unit) {
      paramProps.unit = this.unit;
    }

    if (this.component) {
      paramProps.component = this.component;
      if (this.component === "valueSlider") {
        paramProps.min = this.min;
        paramProps.max = this.max;
        paramProps.step = this.step;
      } else if (this.component === "tickSlider") {
        paramProps.ticks = this.ticks;
      }
    }

    // Add rules for validation if existed.
    if (this.rules.length > 0) {
      paramProps.rules = this.rules;
    }

    return paramProps;
  }
}
