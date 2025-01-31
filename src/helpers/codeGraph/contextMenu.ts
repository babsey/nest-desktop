import { Ref, computed, ref, reactive } from "vue";
import { AbstractNode } from "@baklavajs/core";
import { IBaklavaViewModel, isInputElement, useNodeCategories, useTransform } from "baklavajs";

export interface IMenuItem {
  label?: string;
  value?: any;
  isDivider?: boolean;
  submenu?: IMenuItem[];
  disabled?: boolean | Readonly<Ref<boolean>>;
}

export function useContextMenu(viewModel: Ref<IBaklavaViewModel>) {
  const show = ref(false);
  const x = ref(0);
  const y = ref(0);
  const categories = useNodeCategories(viewModel);
  const { transform } = useTransform();

  const nodeItems = computed<IMenuItem[]>(() => {
    let defaultNodes: IMenuItem[] = [];
    const categoryItems: Record<string, IMenuItem[]> = {};

    for (const category of categories.value) {
      const mappedNodes = Object.entries(category.nodeTypes).map(([nodeType, info]) => ({
        label: info.title,
        value: "addNode:" + nodeType,
      }));
      if (category.name === "default") {
        defaultNodes = mappedNodes;
      } else {
        categoryItems[category.name] = mappedNodes;
      }
    }

    const menuItems: IMenuItem[] = [
      ...Object.entries(categoryItems).map(([category, items]) => ({
        label: category,
        submenu: items,
      })),
    ];
    if (menuItems.length > 0 && defaultNodes.length > 0) {
      menuItems.push({ isDivider: true });
    }
    menuItems.push(...defaultNodes);

    const nestedItems = computed(() => {
      const m1 = menuItems.filter((c) => !c.label.includes("."));
      const m2 = menuItems.filter((c) => c.label.includes("."));
      m2.forEach((m2Item) => {
        const m1Label = m2Item.label.split(".")[0];
        const m2Label = m2Item.label.split(".")[1];
        const m1Item = m1.find((m) => m.label === m1Label) || { name: m1Label, submenu: [] };
        if (!m1.includes(m1Item)) {
          m1.unshift(m1Item);
          // m1.sort((a, b) => (a.label > b.label ? 1 : -1));
        }
        if (!m1Item.submenu) m1Item["submenu"] = [];
        m1Item.categories.push({ ...m2Item, name: m2Label });
      });
      return m1;
    });

    return nestedItems;
  });

  const items = computed<IMenuItem[]>(() => {
    if (viewModel.value.settings.contextMenu.additionalItems.length === 0) {
      return nodeItems.value;
    } else {
      return [
        { label: "Add node", submenu: nodeItems.value },
        ...viewModel.value.settings.contextMenu.additionalItems.map((item) => {
          if ("isDivider" in item || "submenu" in item) {
            return item;
          } else {
            return {
              label: item.label,
              value: "command:" + item.command,
              disabled: !viewModel.value.commandHandler.canExecuteCommand(item.command),
            };
          }
        }),
      ];
    }
  });

  function open(ev: MouseEvent) {
    const target = ev.target;
    if (!(target instanceof Element) || isInputElement(target)) {
      return;
    }

    ev.preventDefault();
    show.value = true;
    const bounding = target.getBoundingClientRect();
    const editor = target.closest(".baklava-editor")!;

    const editorBounding = editor.getBoundingClientRect();
    x.value = bounding.x + ev.offsetX - editorBounding.x;
    y.value = bounding.y + ev.offsetY - editorBounding.y;
  }

  function onClick(value: string) {
    if (value.startsWith("addNode:")) {
      // get node type
      const nodeType = value.substring("addNode:".length);
      const nodeInformation = viewModel.value.editor.nodeTypes.get(nodeType);
      if (!nodeInformation) {
        return;
      }

      const instance = reactive(new nodeInformation.type()) as AbstractNode;
      viewModel.value.displayedGraph.addNode(instance);
      const [transformedX, transformedY] = transform(x.value, y.value);
      instance.position.x = transformedX;
      instance.position.y = transformedY;
    } else if (value.startsWith("command:")) {
      const command = value.substring("command:".length);
      if (viewModel.value.commandHandler.canExecuteCommand(command)) {
        viewModel.value.commandHandler.executeCommand(command);
      }
    }
  }

  return { show, x, y, items, open, onClick };
}
