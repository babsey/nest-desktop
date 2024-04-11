// modelRoutes.ts

import { nextTick } from "vue";

import { logger as mainLogger } from "@/helpers/common/logger";

import { useNESTModelDBStore } from "../stores/model/modelDBStore";
import { useNESTModelStore } from "../stores/model/modelStore";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "nest model route",
});

const modelBeforeEnter = (to: any) => {
  logger.trace("before enter:", to.path);
  const modelStore = useNESTModelStore();

  const modelDBStore = useNESTModelDBStore();
  if (modelDBStore.state.models.length === 0) {
    nextTick(() => modelBeforeEnter(to));
    return;
  }

  if (to.params.modelId) {
    modelStore.state.modelId = to.params.modelId;
  }

  const path = to.path.split("/");
  modelStore.state.view = path[path.length - 1] || "doc";
};

const modelRedirect = (to: any) => {
  logger.trace("Redirect to model:", to.params.modelId);
  const modelStore = useNESTModelStore();

  if (to.params.modelId) {
    modelStore.state.modelId = to.params.modelId;
  }

  return {
    path:
      "/nest/model/" + modelStore.state.modelId + "/" + modelStore.state.view,
  };
};

export default [
  {
    path: "",
    name: "nestModelRoot",
    redirect: modelRedirect,
  },
  {
    path: ":modelId/",
    redirect: modelRedirect,
    children: [
      {
        path: "",
        name: "nestModel",
        props: true,
        redirect: modelRedirect,
      },
      {
        path: "doc",
        name: "nestModelDoc",
        components: {
          model: () => import("../views/ModelDoc.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "explore",
        name: "nestModelExplorer",
        components: {
          model: () => import("../views/ModelExplorer.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "edit",
        name: "nestModelEditor",
        components: {
          model: () => import("../views/ModelEditor.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
    ],
  },
];
