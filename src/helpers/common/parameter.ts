// parameter.ts

import { reactive, UnwrapRef } from "vue";
import { ILogObj, ISettingsParam } from "tslog";

import { BaseObj } from "./base";
import { IConfigProps } from "./config";

export type TParamValue = boolean | number | string | (number | string)[];
interface IParamTypeSpec {
  default?: number;
  id?: string;
  optional?: boolean;
  label?: string;
  value: TParamValue;
}
export interface IParamType {
  icon?: string;
  id: string;
  label?: string;
  specs?: IParamTypeSpec[];
}

export interface IParamProps {
  disabled?: boolean;
  factors?: any[];
  format?: string;
  id: string;
  input?: string; // backward compatible
  inputLabel?: string;
  items?: any[];
  label?: string;
  max?: number;
  min?: number;
  readonly?: boolean;
  rules?: string[][];
  step?: number;
  ticks?: (number | string)[];
  type?: IParamType;
  unit?: string;
  value?: TParamValue;
  component?: string;
  visible?: boolean;
}

interface IParamState {
  disabled: boolean;
  visible: boolean;
}

export class Parameter extends BaseObj {
  private _factors: string[] = []; // not functional yet
  private _format: string = "";
  private _id: string = "";
  private _items: string[] = [];
  private _label: string = "";
  private _max: number = 1;
  private _min: number = 0;
  private _readonly: boolean = false;
  private _rules: string[][] = [];
  private _state: UnwrapRef<IParamState>;
  private _step: number = 1;
  private _ticks: (number | string)[] = [];
  private _type: IParamType = { id: "constant" };
  private _unit: string = "";
  private _value: TParamValue = 0; // constant value;
  private _component: string = "valueInput";

  constructor(
    paramProps: IParamProps,
    loggerProps?: ISettingsParam<ILogObj>,
    configProps?: IConfigProps
  ) {
    super({
      config: { name: "Parameter", ...configProps },
      logger: { settings: { minLevel: 3, ...loggerProps } },
    });

    this._state = reactive({
      visible: false,
      disabled: true,
    });

    this.update(paramProps);
  }

  get code(): string {
    return this.toPythonCode();
  }

  get disabled(): boolean {
    return this._state.disabled;
  }

  get format(): string {
    return this._format;
  }

  get id(): string {
    return this._id;
  }

  /**
   * Check if this parameter is constant.
   */
  get isConstant(): boolean {
    return this._type.id === "constant";
  }

  get items(): string[] {
    return this._items;
  }

  set items(values: string[]) {
    this._items = values;
  }

  get factors(): string[] {
    return this._factors;
  }

  get label(): string {
    return this._label;
  }

  get labelInput(): string {
    let label: string = "";
    label += this.config?.localStorage.rawLabel
      ? this.id
      : this.options["label"] || this.options.id;

    if (this.options.unit) {
      label += ` (${this.options["unit"]})`;
    }
    return label;
  }

  get labelRow(): string {
    let label: string = "";
    label += `<span>${
      this.config?.localStorage.rawLabel
        ? this.id
        : this.options["label"] || this.options.id
    }</span>`;

    if (this.options.unit) {
      label += `<span>${this.value} ${this.options["unit"]}</span>`;
    }
    return label;
  }

  set label(value: string) {
    this._label = value;
  }

  get max(): number {
    return this._max;
  }

  set max(value: number) {
    this._max = value;
  }

  get min(): number {
    return this._min;
  }

  set min(value: number) {
    this._min = value;
  }

  get modelParam(): Parameter {
    return this;
  }

  get options(): {
    [key: string]: boolean | number | string | (number | string)[];
  } {
    const param = this.modelParam;

    const options: {
      component: string;
      defaultValue: TParamValue;
      id: string;
      label: string;
      max?: number;
      min?: number;
      step?: number;
      tickLabels?: (number | string)[];
      unit: string;
    } = {
      component: param.component,
      defaultValue: param.value,
      id: param.id,
      label: param.label,
      unit: param.unit,
    };

    if (["rangeSlider", "valueSlider"].includes(param.component)) {
      options.max = param.max;
      options.min = param.min;
      options.step = param.step;
    }

    if (param.component === "tickSlider") {
      options.tickLabels = param.ticks;
    }

    return options;
  }

  get readonly(): boolean {
    return this._readonly;
  }

  get rules(): string[][] {
    return this._rules;
  }

  get specs(): IParamTypeSpec[] {
    if (this._type.id === "constant") {
      return [{ label: this.label, value: this._value }];
    } else {
      return this._type.specs || [];
    }
  }

  get state(): UnwrapRef<IParamState> {
    return this._state;
  }

  get step(): number {
    return this._step;
  }

  set step(value: number) {
    this._step = value;
  }

  get ticks(): (number | string)[] {
    return this._ticks;
  }

  set ticks(value: (number | string)[]) {
    this._ticks = value;
  }

  get type(): IParamType {
    return this._type;
  }

  get typeId(): string {
    return this._type.id;
  }

  set typeId(value: string) {
    this._type = this.config?.localStorage.types.find(
      (type: IParamType) => type.id === value
    );
  }

  get unit(): string {
    return this._unit;
  }

  set unit(value: string) {
    this._unit = value;
  }

  get value(): TParamValue {
    return this._value;
  }

  set value(value: TParamValue) {
    this._value = value;
  }

  get valueFixed(): string {
    if (Array.isArray(this._value)) {
      return (
        "[" + this._value.map((value) => this.toFixed(value)).join(",") + "]"
      );
    } else if (typeof this._value === "number") {
      return this.toFixed(this._value);
    } else {
      return this._value.toString();
    }
  }

  get valueAsString(): string {
    if (Array.isArray(this._value)) {
      return JSON.stringify(this._value.map((value) => value));
    } else {
      return JSON.stringify(this._value);
    }
  }

  get component(): string {
    return this._component;
  }

  set component(value: string) {
    this._component = value;
  }

  /**
   * Copy parameter component
   */
  copy(): Parameter {
    return new Parameter(this.toJSON());
  }

  /**
   * Updates when parameter is changed.
   */
  changes(): void {}

  /**
   * Reset value taken from options.
   */
  reset(): void {
    this.typeId = "constant";
    if (this.options) {
      this._value = this.options.defaultValue;
    }
  }

  /**
   * Converts a number into a string, but keeps up to `fractionDigits` many
   * fraction digits of that number , i.e.  1 => '1.0', 1.23456 => '1.23456'.
   * @param value number to be converted
   * @param fractionDigits required fraction digits for the output string
   * @returns converted number
   */
  toFixed(value: number | string, fractionDigits: number = 1): string {
    const valueAsString = value.toString();
    if (valueAsString.includes(".") && fractionDigits > 0) {
      fractionDigits = valueAsString.split(".")[1].length;
    }
    return Number(value).toFixed(fractionDigits);
  }

  toggleDisabled(): void {
    this._state.disabled = !this._state.disabled;
    this.changes();
  }

  /**
   * Generate the Python code for this parameter.
   * @returns parameter as Python code
   */
  toPythonCode(): string {
    let value: string;
    if (this.isConstant) {
      // Constant value.
      if (this._format === "integer") {
        // Integer value
        value = this.toFixed(this._value as number, 0);
      } else if (this._format === "float") {
        // Float value
        value = this.toFixed(this._value as number);
      } else if (typeof this._value === "string") {
        // TODO: this condition should be checked if it is really possible.
        // String value
        value = this._value as string;
      } else if (typeof this._value === "boolean") {
        // Boolean value
        value = this._value ? "True" : "False";
      } else if (Array.isArray(this._value)) {
        value = JSON.stringify(this._value.map((value) => value));
      } else {
        value = JSON.stringify(this._value);
      }
    } else if (this._type.id.startsWith("numpy")) {
      const specs: string = this.specs
        .filter(
          (spec: IParamTypeSpec) =>
            !(spec.optional && spec.value === spec.default)
        )
        .map((spec: IParamTypeSpec) => spec.value)
        .join(", ");
      value = `${this._type.id}(${specs})`;
    } else if (this._type.id === "spatial.distance") {
      // Distance-dependent linear function.
      const specs: IParamTypeSpec[] = this.specs;
      value = "";
      value += specs[0].value !== 1 ? `${specs[0].value} * ` : "";
      value += `nest.${this._type.id}`;
      value += specs[1].value !== 0 ? ` + ${specs[1].value}` : "";
    } else if (this._type.id.startsWith("spatial")) {
      // Spatial distribution.
      const specs: string = this.specs
        .map((spec: IParamTypeSpec) => spec.value)
        .join(", ");
      value = `nest.${this._type.id}(nest.spatial.distance, ${specs})`;
    } else {
      // Non-spatial distribution.
      const specs: string = this.specs
        .map((spec: IParamTypeSpec) => spec.value)
        .join(", ");
      value = `nest.${this._type.id}(${specs})`;
    }
    return value;
  }

  /**
   * Serialize parameter type for JSON.
   * @return parameter type props
   */
  typeToJSON(): IParamType {
    const paramType: IParamType = {
      id: this._type.id,
    };

    if (this._type.specs) {
      paramType.specs = this._type.specs.map((spec: IParamTypeSpec) => ({
        id: spec.id,
        value: Number(spec.value),
      }));
    }

    return paramType;
  }

  /**
   * Serialize for JSON.
   * @return parameter props
   */
  toJSON(): IParamProps {
    const paramProps: IParamProps = {
      id: this._id,
      value: this._value,
    };

    // Add value factors if existed.
    if (this._factors.length > 0) {
      paramProps.factors = this._factors;
    }

    // Add rules for validation if existed.
    if (this._rules.length > 0) {
      paramProps.rules = this._rules;
    }

    // Add param type if not constant.
    if (!this.isConstant) {
      paramProps.type = this.typeToJSON();
    }

    return paramProps;
  }

  /**
   * Update parameter
   * @param paramProps parameter props
   */
  update(paramProps: IParamProps): void {
    this._id = paramProps.id;
    this._value = paramProps.value || 0;

    this._state.visible =
      paramProps.visible != undefined ? paramProps.visible : false;
    this._state.disabled =
      paramProps.disabled != undefined ? paramProps.disabled : true;

    // optional param specifications
    this._rules = paramProps.rules || [];
    this._factors = paramProps.factors || [];

    if (paramProps.type) {
      const type = this.config?.localStorage.types.find(
        (t: IParamType) => t.id === paramProps.type?.id
      );
      if (type != null) {
        this._type = { ...type, ...paramProps.type };
      }
    }

    this._format = paramProps.format || "";
    this._items = paramProps.items || [];
    this._label = paramProps.label || paramProps.id;
    this._readonly = paramProps.readonly || false;

    this._max = paramProps.max || 1;
    this._min = paramProps.min || 0;
    this._step = paramProps.step || 1;
    this._ticks = paramProps.ticks || [];
    this._unit = paramProps.unit || "";
    this._component = paramProps.component || paramProps.input || "valueInput";
  }
}
