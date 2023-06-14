// projectState.ts

import { reactive, UnwrapRef } from 'vue';
import { sha1 } from 'object-hash';

import { Project } from './project';

type actionType = {
  onClick: object;
  text: string;
};

type snackbarType = {
  actions: actionType[];
  important: boolean;
  show: boolean;
  text: string;
};

export class ProjectState {
  private _activityStatsPanelId: number = 0;
  private _state: UnwrapRef<any>;
  private _project: Project;
  private _selected: boolean = false;
  private _snackbar: snackbarType;

  constructor(project: Project) {
    this._project = project;

    this._state = reactive({
      changes: false,
      hash: ""
    });

    this._snackbar = {
      actions: [],
      important: false,
      show: false,
      text: '',
    };
  }

  get activityStatsPanelId(): number {
    return this._activityStatsPanelId;
  }

  set activityStatsPanelId(value: number) {
    this._activityStatsPanelId = value;
  }

  get changes(): boolean {
    return this._state.changes;
  }

  get hash(): string {
    return this._state.hash;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }

  get snackbar(): snackbarType {
    return this._snackbar;
  }

  /**
   * Check the changes in project.
   */
  checkChanges(): void {
    this._state.changes =
      this._project.id !== this._project.doc.id ||
      this._state.hash !== this._project.doc.hash;
  }

  /**
   * Close snackbar.
   */
  closeSnackbar(): void {
    this._snackbar = {
      actions: [],
      important: false,
      show: false,
      text: '',
    };
  }

  /**
   * Reset state of this project.
   */
  reset(): void {
    this._selected = false;
  }

  /**
   * Show snackbar.
   */
  showSnackbar(
    text: string,
    actions: actionType[] = [],
    important: boolean = false
  ): void {
    this._snackbar.text = text;
    this._snackbar.actions = actions;
    this._snackbar.important = important;
    this._snackbar.show = true;
  }

  /**
   * Calculate hash of this component.
   */
  updateHash(): void {
    this._state.hash = sha1({
      description: this._project.description,
      name: this._project.name,
      network: this._project.network.toJSON(),
      simulation: this._project.simulation.toJSON(),
    });
  }
}