// codeNodeTypes/torch

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";

import torchConv2d from "./torchConv2d";
import torchLinear from "./torchLinear";
import torchMaxPool2d from "./torchMaxPool2d";
import torchRandn from "./torchRandn";

export const registerTorchNodeTypes = () => {
  const codeGraphStore = useCodeGraphStore();
  codeGraphStore.state.modules["torch"] = "import torch";

  const editor = codeGraphStore.viewModel.editor;
  editor.registerNodeType(torchConv2d, { category: "torch" });
  editor.registerNodeType(torchLinear, { category: "torch" });
  editor.registerNodeType(torchMaxPool2d, { category: "torch" });
  editor.registerNodeType(torchRandn, { category: "torch" });
};
