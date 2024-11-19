// activityChartGraph.ts

import moment from "moment";
import { UnwrapRef, nextTick, reactive } from "vue";

// @ts-ignore
import * as PlotlyBasic from "plotly.js-cartesian-dist-min";
// import Plotly from "plotly.js-cartesian-dist-min";

import { TProject } from "@/types";

import { IBaseActivityGraphProps } from "../activity/activityGraph";
import { BaseObj } from "../common/base";
import { currentBackgroundColor, currentColor } from "../common/theme";
import {
  ActivityChartPanel,
  IActivityChartPanelProps,
} from "./activityChartPanel";
import { IActivityChartPanelModelData } from "./activityChartPanelModel";
import { CVISIHistogramModel } from "./activityChartPanelModels/CVISIHistogramModel";
import { AnalogSignalHistogramModel } from "./activityChartPanelModels/analogSignalHistogramModel";
import { AnalogSignalPlotModel } from "./activityChartPanelModels/analogSignalPlotModel";
import { InterSpikeIntervalHistogramModel } from "./activityChartPanelModels/interSpikeIntervalHistogramModel";
import { SenderCVISIPlotModel } from "./activityChartPanelModels/senderCVISIPlotModel";
import { SenderMeanISIPlotModel } from "./activityChartPanelModels/senderMeanISIPlotModel";
import { SenderSpikeCountPlotModel } from "./activityChartPanelModels/senderSpikeCountPlotModel";
import { SpikeCountPlotModel } from "./activityChartPanelModels/spikeCountPlotModel";
import { SpikeTimesHistogramModel } from "./activityChartPanelModels/spikeTimesHistogramModel";
import { SpikeTimesRasterPlotModel } from "./activityChartPanelModels/spikeTimesRasterPlotModel";
import { createDialog } from "vuetify3-dialog";
import DownloadPlotDialog from "@/components/dialog/DownloadPlotDialog.vue";

// import { SpikeActivity } from "../activity/spikeActivity";
// import { sum } from "../common/array";

export interface IActivityChartPanelModelProps {
  activityType: string;
  component: Object;
  id: string;
  icon: string;
  label: string;
}

interface IActivityChartGraphState {
  ref?: PlotlyBasic.Root;
  traceColor: string;
}

const models: IActivityChartPanelModelProps[] = [
  {
    activityType: "analog",
    component: AnalogSignalPlotModel,
    id: "analogSignalPlot",
    icon: "mdi:mdi-chart-bell-curve-cumulative",
    label: "Analog signals",
  },
  {
    activityType: "analog",
    component: AnalogSignalHistogramModel,
    id: "analogSignalHistogram",
    icon: "mdi:mdi-chart-bar",
    label: "analog signals",
  },
  {
    activityType: "spike",
    component: SpikeTimesRasterPlotModel,
    id: "spikeTimesRasterPlot",
    icon: "mdi:mdi-chart-scatter-plot",
    label: "Spike times",
  },
  {
    activityType: "spike",
    component: SpikeTimesHistogramModel,
    id: "spikeTimesHistogram",
    icon: "mdi:mdi-chart-bar",
    label: "Spike times",
  },
  {
    activityType: "spike",
    component: SpikeCountPlotModel,
    id: "spikeCountPlot",
    icon: "mdi:mdi-chart-bell-curve-cumulative",
    label: "Spike count",
  },
  {
    activityType: "spike",
    component: InterSpikeIntervalHistogramModel,
    id: "interSpikeIntervalHistogram",
    icon: "mdi:mdi-chart-bar",
    label: "Inter-spike interval",
  },
  {
    activityType: "spike",
    component: CVISIHistogramModel,
    id: "CVISIHistogram",
    icon: "mdi:mdi-chart-bar",
    label: "CV of ISI",
  },
  {
    activityType: "spike",
    component: SenderSpikeCountPlotModel,
    id: "senderSpikeCountPlot",
    icon: "mdi:mdi-chart-bell-curve-cumulative",
    label: "Spike count in each sender",
  },
  {
    activityType: "spike",
    component: SenderMeanISIPlotModel,
    id: "senderMeanISIPlot",
    icon: "mdi:mdi-chart-bell-curve-cumulative",
    label: "Mean ISI in each sender",
  },
  {
    activityType: "spike",
    component: SenderCVISIPlotModel,
    id: "senderCVISIPlot",
    icon: "mdi:mdi-chart-bell-curve-cumulative",
    label: "CV ISI in each sender",
  },
];

export class ActivityChartGraph extends BaseObj {
  private _plotConfig: PlotlyBasic.Partial<PlotlyBasic.Config> = {};
  private _plotData: PlotlyBasic.Data[] = [];
  private _plotLayout: PlotlyBasic.Partial<PlotlyBasic.Layout> = {};
  private _models: IActivityChartPanelModelProps[] = models;
  private _panels: ActivityChartPanel[] = [];
  private _project: TProject;
  private _state: UnwrapRef<IActivityChartGraphState>;

  constructor(project: TProject, activityGraphProps?: IBaseActivityGraphProps) {
    super({ logger: { settings: { minLevel: 3 } } });

    this._project = project;
    this._plotConfig = {
      displaylogo: false,
      displayModeBar: true,
      responsive: true,
      editable: true,
      modeBarButtons: [
        [
          {
            name: "Download plot",
            icon: PlotlyBasic.Icons.camera,
            click: () => {
              let filename = this._project.name;
              filename = filename.replaceAll(" ", "_");
              const timestamp = moment(new Date()).format("YYMMDD");
              createDialog({
                title: "Save as image",
                text: "Select a image format",
                customComponent: {
                  component: DownloadPlotDialog,
                  props: { filename: `nest_desktop-${timestamp}-${filename}` },
                },
              }).then((response: PlotlyBasic.DownloadImgopts | undefined) =>
                response ? this.downloadImage(response) : null
              );
            },
          },
          // "toImage",
        ],
        ["zoom2d", "pan2d"],
        ["zoomIn2d", "zoomOut2d", "autoScale2d", "resetScale2d"],
        ["hoverClosestCartesian", "hoverCompareCartesian", "toggleSpikelines"],
      ],
      scrollZoom: true,
    };

    this._plotLayout = {
      autosize: true,
      barmode: "overlay",
      font: {
        color: currentColor(),
      },
      margin: {
        t: 40,
      },
      paper_bgcolor: currentBackgroundColor(),
      plot_bgcolor: currentBackgroundColor(),
      title: {
        xref: "paper",
        x: 0,
      },
    };

    this._state = reactive<IActivityChartGraphState>({
      traceColor: activityGraphProps?.color || "record",
    });

    this.addPanels(activityGraphProps?.panels);
  }

  get currentTime(): number {
    const simulationState = this._project.simulation.state;
    return simulationState.timeInfo.current > 0
      ? simulationState.timeInfo.current
      : simulationState.biologicalTime;
  }

  get endTime(): number {
    return this._project.simulation.state.biologicalTime;
  }

  get models(): IActivityChartPanelModelProps[] {
    return this._models;
  }

  get modelsAnalog(): IActivityChartPanelModelProps[] {
    return this._models.filter(
      (model: IActivityChartPanelModelProps) => model.activityType === "analog"
    );
  }

  get modelsSpike(): IActivityChartPanelModelProps[] {
    return this._models.filter(
      (model: IActivityChartPanelModelProps) => model.activityType === "spike"
    );
  }

  get panels(): ActivityChartPanel[] {
    return this._panels;
  }

  set panels(values: ActivityChartPanel[]) {
    this._panels = values;
    this.update();
  }

  get panelsVisible(): ActivityChartPanel[] {
    return this._panels.filter(
      (panel: ActivityChartPanel) => panel.state.visible
    );
  }

  get plotData(): PlotlyBasic.Data[] {
    return this._plotData;
  }

  get plotLayout(): PlotlyBasic.Partial<PlotlyBasic.Layout> {
    return this._plotLayout;
  }

  get project(): TProject {
    return this._project;
  }

  get state(): UnwrapRef<IActivityChartGraphState> {
    return this._state;
  }

  /**
   * Add panel.
   * @param panelProps
   */
  addPanel(
    panelProps: IActivityChartPanelProps = {
      model: { id: "spikeTimesRasterPlot" },
    }
  ): void {
    this.logger.trace("add panel:", panelProps.model?.id);

    this._panels.push(new ActivityChartPanel(this, panelProps));
  }

  /**
   * Add panels.
   * @param panelsProps
   */
  addPanels(panelsProps?: IActivityChartPanelProps[]): void {
    this.logger.trace("add panels");

    if (panelsProps != undefined && panelsProps.length > 0) {
      panelsProps.forEach((panelProps: IActivityChartPanelProps) =>
        this.addPanel(panelProps)
      );
    } else {
      if (this._project.activities.state.hasSomeAnalogRecorders) {
        this.addPanel({ model: { id: "analogSignalPlot" } });
      }
      if (this._project.activities.state.hasSomeSpikeRecorders) {
        this.addPanel({ model: { id: "spikeTimesRasterPlot" } });
        this.addPanel({ model: { id: "spikeTimesHistogram" } });
      }
    }
  }

  /**
   * Observer for activity chart graph changes.
   *
   * @remarks
   * It emits Plotly react and restyle.
   */
  changes(): void {
    this.update();
  }

  /**
   * Clear shapes.
   */
  clearShapes(): void {
    this._plotLayout["shapes"] = [];
  }

  /**
   * Delete traces.
   */
  deleteTraces(): void {
    // @ts-ignore
    Plotly.deleteTraces(this._state.ref as Root, 0);
  }

  /**
   * Download image of the activity chart graph.
   * @param options plotly download image options
   */
  downloadImage(options: PlotlyBasic.DownloadImgopts): void {
    if (!this._state.ref) return;
    this.logger.trace("download Image:", options);

    // @ts-ignore
    Plotly.downloadImage(this._state.ref, options);
  }

  /**
   * Empty graph data.
   */
  empty(): void {
    this._plotData = [];
    this._plotLayout.shapes = [];
  }

  /**
   * Gather data for the chart graph.
   * @param panel
   */
  gatherData(panel: ActivityChartPanel): void {
    panel.model.data.forEach(
      (data: PlotlyBasic.Partial<IActivityChartPanelModelData>) => {
        data.dataIdx = this._plotData.length;
        data.panelIdx = panel.idx;
        data.xaxis = "x" + panel.xAxis;
        data.yaxis = "y" + panel.yAxis;
        // data.yaxis = "y" + index;
        this._plotData.push(data);
      }
    );
  }

  /**
   * Initialize network chart graph.
   */
  init(): void {
    this.logger.trace("init");

    this.updateVisiblePanelsLayout();

    this.initPanelModels();

    this.react();
  }

  /**
   * Initialize Plotly events.
   */
  initEvents(): void {
    if (!this._state.ref) return;
    this.logger.trace("init events");

    // @ts-ignore - Property 'on' does not exist on type 'Root'. Property 'on' does not exist on type 'string'.
    this._state.ref.on("plotly_legendclick", (plot: any) => {
      nextTick(() => {
        if (plot && plot.data) {
          plot.data.forEach((d: PlotlyBasic.Partial<PlotlyBasic.Data>) => {
            const panel = this._panels[d.panelIdx];
            panel.model.state.visible = d.visible;
          });
        }
      });
    });
  }

  /**
   * Initialize panel models.
   */
  initPanelModels(): void {
    this._panels.forEach((panel: ActivityChartPanel) => panel.model.init());
  }

  /**
   * Create new Plot of the DOM reference.
   * @param ref
   */
  newPlot(ref: PlotlyBasic.Root): void {
    this.logger.trace("new plot");

    this._state.ref = ref;

    // @ts-ignore
    Plotly.newPlot(
      this._state.ref,
      this._plotData,
      this._plotLayout,
      this._plotConfig
    ).then(() => {
      // this.init();
      this.initEvents();
    });
  }

  /**
   * React plots to new updates.
   */
  react(): void {
    if (!this._state.ref) return;
    this.logger.trace("react");

    const toc = Date.now();
    // @ts-ignore
    Plotly.react(this._state.ref, this._plotData, this._plotLayout);
    this._project.state.state.stopwatch.plotly.react = Date.now() - toc;
  }

  /**
   * Relayout plots to new theme.
   */
  relayout(): void {
    if (!this._state.ref) return;
    this.logger.trace("relayout");

    this.updateThemeColor();
    // @ts-ignore
    Plotly.relayout(this._state.ref, this._plotLayout);
  }

  /**
   * Remove panel.
   * @param panel
   */
  removePanel(panel: ActivityChartPanel): void {
    this._panels = this._panels.filter((p: ActivityChartPanel) => p !== panel);
    this.update();
  }

  /**
   * Reset panels.
   */
  resetPanels(): void {
    this.panels = [];
    this.addPanels();
    this.update();
  }

  /**
   * Restyle plots with new updates.
   */
  restyle(): void {
    if (!this._state.ref) return;
    this.logger.trace("restyle");

    if (this.project.activities.state.hasSomeSpikeRecorders) {
      const restyleRaster = this.restyleMarkerHeightSpikeTimesRasterPlot();

      const toc = Date.now();
      // @ts-ignore
      Plotly.restyle(
        this._state.ref,
        restyleRaster.update,
        restyleRaster.traceIndices
      );
      this._project.state.state.stopwatch.plotly.restyle = Date.now() - toc;
    }
  }

  /**
   * Restyle marker height of spike times raster plot.
   */
  restyleMarkerHeightSpikeTimesRasterPlot(): {
    update: any;
    traceIndices: number[];
  } {
    if (!this._state.ref) return { update: {}, traceIndices: [] };

    const dataSpikeTimeRasterPlot = this._plotData.filter(
      (d: PlotlyBasic.Partial<PlotlyBasic.Data>) =>
        d.modelId === "spikeTimesRasterPlot"
    );

    const markerSizes = dataSpikeTimeRasterPlot.map(
      (d: PlotlyBasic.Partial<PlotlyBasic.Data>) => {
        const model = this._panels[d.panelIdx]
          .model as SpikeTimesRasterPlotModel;
        return model.markerSize;
      }
    );

    const update = {
      "marker.size": markerSizes,
    };

    const traceIndices = dataSpikeTimeRasterPlot.map(
      (d: PlotlyBasic.Partial<PlotlyBasic.Data>) => d.dataIdx
    );

    return { update, traceIndices };
  }

  /**
   * Serialize for JSON.
   * @return activity chart graph props
   */
  toJSON(): IActivityChartPanelProps[] {
    return this._panels.map((panel: ActivityChartPanel) => panel.toJSON());
  }

  /**
   * Updates chart graph with activities.
   *
   * @remarks
   * It required network activities.
   */
  update(): void {
    if (!this._state.ref) return;
    this.logger.trace("update");

    this.empty();

    this._project.activities.checkActivities();

    this.updateVisiblePanelsLayout();
    this.updatePanelModels();
    // this.updateLayoutColor();

    this.updateVisiblePanelsData();

    this.react();
    this.restyle();
  }

  /**
   * Update activities in panel models.
   */
  updateActivities(): void {
    this.logger.trace("update activities");

    this.panelsVisible.forEach((panel: ActivityChartPanel) => {
      panel.model.updateActivities();
      panel.model.initAnalogRecords();
    });
  }

  /**
   * Update the theme color of the chart graph.
   */
  updateThemeColor(): void {
    this._panels.forEach((panel: ActivityChartPanel) =>
      panel.model.updateBackgroundColor()
    );

    this._plotLayout.font.color = currentColor();
    this._plotLayout.paper_bgcolor = currentBackgroundColor();
    this._plotLayout.plot_bgcolor = currentBackgroundColor();
  }

  /**
   * Update the layout of the chart graph from each panel.
   * @param panel
   */
  updateLayoutPanel(panel: ActivityChartPanel): void {
    panel.layout.shapes.forEach((shape) => {
      shape.yref = "y" + (panel.yAxis > 1 ? panel.yAxis : "");
    });

    this._plotLayout.shapes = [
      ...this._plotLayout.shapes,
      ...panel.layout.shapes,
    ];

    this._plotLayout["yaxis" + (panel.yAxis > 1 ? panel.yAxis : "")] =
      panel.layout.yaxis;
    this._plotLayout["xaxis" + (panel.xAxis > 1 ? panel.xAxis : "")] =
      panel.layout.xaxis;
  }

  /**
   * Update data in visible panels.
   */
  updateVisiblePanelsData(): void {
    this.panelsVisible.forEach((panel: ActivityChartPanel) => {
      // panel.model.activities; // TODO: check if it is required.
      this.gatherData(panel);
      this.updateLayoutPanel(panel);
    });
  }

  /**
   * Update panel models.
   */
  updatePanelModels(): void {
    this.logger.trace("update panel models");
    this._panels.forEach((panel: ActivityChartPanel) => panel.model.update());
  }

  /**
   * Update color of records.
   *
   * @remarks
   * It renders new updates in activity plots.
   */
  updateRecordsColor(): void {
    this._panels.forEach((panel: ActivityChartPanel) =>
      panel.model.updateRecordsColor()
    );
    this.react();
  }

  /**
   * Update visible panel layout of the chart graph.
   */
  updateVisiblePanelsLayout(): void {
    this.panelsVisible.forEach((panel: ActivityChartPanel) =>
      panel.updateLayout()
    );
  }
}
