/**
 * router/modelRoute.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { useNESTModelDBStore } from "@nest/store/model/nestModelDBStore";
import { useNESTModelStore } from "@nest/store/model/nestModelStore";

const modelBeforeEnter = (to: any) => {
  const modelStore = useNESTModelStore();

  const modelDBStore = useNESTModelDBStore();
  if (modelDBStore.models.length === 0) {
    setTimeout(() => modelBeforeEnter(to), 100);
    return;
  }

  if (to.params.modelId) {
    modelStore.modelId = to.params.modelId;
  }

  const path = to.path.split("/");
  modelStore.view = path[path.length - 1] || "doc";
};

const modelRedirect = (to: any) => {
  const modelStore = useNESTModelStore();

  if (to.params.modelId) {
    modelStore.modelId = to.params.modelId;
  }

  return { path: "/nest/model/" + modelStore.modelId + "/" + modelStore.view };
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
          model: () => import("@nest/views/model/NESTModelDoc.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "explore",
        name: "nestModelExplorer",
        components: {
          model: () => import("@nest/views/model/NESTModelExplorer.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
      {
        path: "edit",
        name: "nestModelEditor",
        components: {
          model: () => import("@nest/views/model/NESTModelEditor.vue"),
        },
        props: true,
        beforeEnter: modelBeforeEnter,
      },
    ],
  },
];
