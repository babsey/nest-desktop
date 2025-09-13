// viewModel.ts

import { Editor, IBaklavaViewModel, IViewSettings, useBaklava } from "baklavajs";
import { UnwrapRef, reactive } from "vue";

import { DEFAULT_SETTINGS } from "./settings";

export interface ICodeGraphViewModel extends IBaklavaViewModel {
  state: UnwrapRef<{
    modules: Record<string, string>;
  }>;
}

export function useCodeGraph(existingEditor?: Editor): ICodeGraphViewModel {
  const viewModel = useBaklava(existingEditor) as ICodeGraphViewModel;

  const settings: Partial<IViewSettings> = {};
  Object.keys(DEFAULT_SETTINGS).forEach((K: string) => {
    settings[K] =
      typeof DEFAULT_SETTINGS[K] === "object"
        ? { ...viewModel.settings[K], ...DEFAULT_SETTINGS[K] }
        : DEFAULT_SETTINGS[K];
  });

  viewModel.settings = reactive({ ...viewModel.settings, ...settings });
  viewModel.settings.nodes.defaultWidth = 350; // This is the way!

  viewModel.state = reactive({
    modules: {},
  });

  return viewModel;
}
