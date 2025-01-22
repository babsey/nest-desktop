// codeNodeTypes/index.ts

import { Editor } from "baklavajs";

import norseIAFCell from "./norseIAFCell";
import norseSequentialState from "./norseSequentialState";
import torchConv2d from "./torchConv2d";
import torchLinear from "./torchLinear";
import torchMaxPool2d from "./torchMaxPool2d";
import torchRandn from "./torchRandn";

export const registerNorseNodeTypes = (editor: Editor) => {
  editor.registerNodeType(norseIAFCell, { category: "norse" });
  editor.registerNodeType(norseSequentialState, { category: "norse" });

  editor.registerNodeType(torchConv2d, { category: "torch" });
  editor.registerNodeType(torchLinear, { category: "torch" });
  editor.registerNodeType(torchMaxPool2d, { category: "torch" });
  editor.registerNodeType(torchRandn, { category: "torch" });
};
