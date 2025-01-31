// getPosition.ts

import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "getPosition",
  title: "get position",
  codeTemplate: () =>
    "def getPositions(nodes): \
    positions = {} \
    for node in nodes: \
        position = nest.GetPosition(node) \
        for idx in range(len(node)): \
            positions[node[idx].global_id] = position[idx] \
    return positions",
});
