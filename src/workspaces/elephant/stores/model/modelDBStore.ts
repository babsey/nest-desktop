// modelDBStore.ts

import { defineModelDBStore } from "@/stores/model/defineModelDBStore";

import { ElephantModel } from "../../helpers/model/model";
import { ElephantModelDB } from "../../helpers/model/modelDB";

// const modelAssets = ["dummyRasterPlot"];
// const modelAssets = ["timeHistogram", "ISIBar", "CVISIBar", "crossCorrelationImshow"];

export const useElephantModelDBStore = defineModelDBStore<ElephantModel>({
  Model: ElephantModel,
  ModelDB: ElephantModelDB,
  // modelAssets,
  workspace: "elephant",
});
