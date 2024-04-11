// projectState.ts

import { reactive, UnwrapRef } from "vue";

import { TProject } from "@/types/projectTypes";

export interface IProjectState {
  changes: boolean;
  editMode: boolean;
}

export class ProjectState {
  private _state: UnwrapRef<IProjectState>;
  private _project: TProject;
  private _selected: boolean = false;

  constructor(project: TProject) {
    this._project = project;

    this._state = reactive({
      changes: false,
      editMode: false,
    });
  }

  get changes(): boolean {
    return this._state.changes;
  }

  get editMode(): boolean {
    return this._state.editMode;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

  get state(): UnwrapRef<IProjectState> {
    return this._state;
  }

  /**
   * Check the changes in project.
   */
  checkChanges(): void {
    this._state.changes =
      // this._project.id !== this._project.doc.id ||
      this._project.hash !== this._project.doc.hash;
  }

  /**
   * Reset state of this project.
   */
  reset(): void {
    this._selected = false;
  }
}
