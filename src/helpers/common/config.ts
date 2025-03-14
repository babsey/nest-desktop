// config.ts

import { TValue } from "@/types";
import { loadJSON } from "@/utils/fetch";

export interface IConfigProps {
  name: string;
  workspace?: string;
}

export class Config {
  private _name?: string;
  private _workspace?: string;

  constructor(configProps: IConfigProps) {
    this._name = configProps.name;
    this._workspace = configProps.workspace;

    if (this._name != undefined && !this.isValid) this.upgrade();
  }

  get configItemName(): string {
    return "nest-desktop-" + this._name;
  }

  get name(): string | undefined {
    return this._name;
  }

  get isValid(): boolean {
    const storedData = this.localStorage;
    if (process.env.APP_VERSION == undefined || storedData == undefined) return false;

    const appVersion: string[] = process.env.APP_VERSION.split(".");
    const configVersion: string[] = storedData.version?.split(".");
    return configVersion ? appVersion[0] === configVersion[0] && appVersion[1] === configVersion[1] : false;
  }

  get localStorage(): TValue {
    // Check if item is existed in localStorage.
    if (this.configItemName in localStorage) {
      const dataJSON: string | null = localStorage.getItem(this.configItemName);
      if (dataJSON) return JSON.parse(dataJSON);
    }
    return {};
  }

  set localStorage(value: TValue) {
    value.version = process.env.APP_VERSION as string; // Update version of config in localStorage.
    const dataJSON = JSON.stringify(value); // Convert object to string.
    localStorage.setItem(this.configItemName, dataJSON); // Save item in localsStorage.
  }

  copy(item: Record<string, TValue>): Record<string, TValue> {
    return { ...item };
  }

  async import(): Promise<Record<string, TValue>> {
    const path = this._workspace
      ? `assets/workspaces/${this._workspace}/config/${this._name}`
      : `assets/config/${this._name}`;
    return loadJSON(path + ".json");
  }

  reset(): void {
    localStorage.removeItem(this.configItemName);
  }

  update(value: Record<string, TValue>): void {
    const storedData: Record<string, TValue> = this.localStorage;
    Object.entries(value).forEach((v: [string, TValue]) => (storedData[v[0]] = v[1]));
    this.localStorage = storedData;
  }

  upgrade(): void {
    this.import().then((importedData) => {
      const storedData: Record<string, TValue> = this.localStorage || {};
      Object.entries(importedData).forEach((entry: [string, TValue]) => {
        if (!(entry[0] in storedData)) storedData[entry[0]] = entry[1];
      });
      this.localStorage = storedData;
    });
  }
}
