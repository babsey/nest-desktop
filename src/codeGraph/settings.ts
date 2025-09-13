//settings.ts

import { AbstractNode, DEFAULT_TOOLBAR_COMMANDS, IViewSettings } from "baklavajs";
import { computed } from "vue";

import { ICodeGraphViewModel } from "./viewModel";
import { Plus, Schema, SchemaOff, TrashOff } from "./icons";

interface ICodeViewSettings extends Partial<IViewSettings> {
  toolbar?: Partial<IViewSettings["toolbar"]>;
  nodes?: Partial<IViewSettings["nodes"]>;
  sidebar?: Partial<IViewSettings["sidebar"]>;
}

export const addToolbarCommands = (baklavaView: ICodeGraphViewModel) => {
  // Toggle palette in the graph
  const TOGGLE_PALETTE_COMMAND = "TOGGLE_PALETTE";
  baklavaView.commandHandler.registerCommand(TOGGLE_PALETTE_COMMAND, {
    execute: () => {
      baklavaView.settings.palette.enabled = !baklavaView.settings.palette.enabled;
    },
    canExecute: () => true,
  });

  // Clear all nodes from the graph
  const CLEAR_ALL_COMMAND = "CLEAR_ALL";
  baklavaView.commandHandler.registerCommand(CLEAR_ALL_COMMAND, {
    execute: () => {
      baklavaView.displayedGraph.nodes.forEach((node: AbstractNode) => baklavaView.displayedGraph.removeNode(node));
    },
    canExecute: () => baklavaView.displayedGraph.nodes.length > 0,
  });

  // Toggle minimap
  const TOGGLE_MINIMAP_COMMAND = "TOGGLE_MINIMAP";
  baklavaView.commandHandler.registerCommand(TOGGLE_MINIMAP_COMMAND, {
    execute: () => (baklavaView.settings.enableMinimap = !baklavaView.settings.enableMinimap),
    canExecute: () => true,
  });

  baklavaView.settings.toolbar.commands = [
    {
      command: TOGGLE_PALETTE_COMMAND,
      title: "Toggle palette", // Tooltip text
      icon: Plus,
    },
    ...DEFAULT_TOOLBAR_COMMANDS,
    {
      command: CLEAR_ALL_COMMAND,
      title: "Clear all", // Tooltip text
      icon: TrashOff,
    },
    {
      command: TOGGLE_MINIMAP_COMMAND,
      title: "Toggle minimap", // Tooltip text
      icon: computed(() => (baklavaView.settings.enableMinimap ? Schema : SchemaOff)),
    },
  ];
};

export const DEFAULT_SETTINGS: ICodeViewSettings = {
  enableMinimap: false,
  toolbar: {
    enabled: true,
  },
  palette: {
    enabled: false,
  },
  sidebar: {
    enabled: true,
    resizable: true,
    width: 350,
  },
  displayValueOnHover: false,
};
