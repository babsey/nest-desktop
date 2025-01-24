// numpyConvolve.ts

import { NodeInterface, SelectInterface } from "baklavajs";

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "numpy.convolve",
  title: "Convolve",
  inputs: {
    a: () => new NodeInterface("a", ""),
    v: () => new NodeInterface("v", ""),
    mode: () => new SelectInterface("mode", "valid", ["valid", "same", "full"]),
  },
  outputs: {
    out: () => new NodeInterface("out", ""),
  },
  codeTemplate: () => "np.convolve()",
});
