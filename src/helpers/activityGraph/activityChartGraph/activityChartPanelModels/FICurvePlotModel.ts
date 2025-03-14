// FICurvePlotModel.ts

import { ActivityChartPanel } from "../activityChartPanel";
import { IActivityChartPanelModelProps } from "../activityChartPanelModel";
import { SpikeActivity } from "../../../activity/spikeActivity";
import { SpikeTimesPanelModel } from "./spikeTimesPanelModel";
import { line } from "../graphObjects/line";

export class SpikeTimesRasterPlotModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, modelProps: IActivityChartPanelModelProps = {}) {
    super(panel, modelProps);
    this.icon = "mdi:mdi-chart-bell-curve-cumulative";
    this.id = "FICurvePlot";
    this.label = "F-I curve";
    this.panel.height = 30;
    this.panel.xAxis = 5;
  }

  /**
   * Add data of FI curve for trace panel.
   * @param activity spike activity object
   */
  override addData(activity: SpikeActivity): void {
    if (activity.nodeIds.length === 0) return;

    this.data.push(
      line({
        activityIdx: activity.idx,
        hoverinfo: "none",
        legendgroup: "spikes" + activity.idx,
        marker: {
          color: activity.traceColor,
          size: 5,
        },
        name: "Spikes" + "record" in activity ? " of " + activity.traceLabel : "",
        visible: this.state.visible,
        x: activity.events.times,
        y: activity.events.senders,
      }),
    );
  }

  /**
   * Update layout label for FI curve.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title.text = "Neuron ID";
    this.panel.layout.yaxis.title.text = "Spike count";
  }
}
