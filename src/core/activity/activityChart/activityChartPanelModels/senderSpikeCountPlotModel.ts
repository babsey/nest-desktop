import { ActivityChartPanel } from '../activityChartPanel';
import { SpikeActivity } from '../../spikeActivity';
import { SpikeTimesPanelModel } from './spikeTimesPanelModel';

export class SenderSpikeCountPlotModel extends SpikeTimesPanelModel {
  constructor(panel: ActivityChartPanel, model: any = {}) {
    super(panel, model);
    this.panel.xaxis = 4;
    this.params = [
      {
        id: 'mode',
        input: 'select',
        label: 'Mode',
        items: ['counts', 'rate'],
        value: 'counts',
      },
      {
        id: 'plotMode',
        input: 'select',
        items: ['bar', 'lines', 'lines+markers', 'markers'],
        label: 'Plot mode',
        value: 'bar',
      },
      {
        id: 'lineShape',
        input: 'select',
        items: [
          { text: 'linear', value: 'linear' },
          { text: 'spline', value: 'spline' },
          { text: 'vertical-horizontal-vertical steps', value: 'vhv' },
          { text: 'horizontal-vertical-horizontal steps', value: 'hvh' },
          { text: 'vertical-horizontal steps', value: 'vh' },
          { text: 'horizontal-vertical steps', value: 'hv' },
        ],
        label: 'Line shape',
        value: 'linear',
      },
    ];
  }

  get lineShape(): string {
    return this.params[2].value;
  }

  get plotMode(): string {
    return this.params[1].value;
  }

  get plotType(): string {
    return this.plotMode === 'bar' ? this.plotMode : 'scatter';
  }

  get spikeRate(): boolean {
    return this.params[0].value == 'rate';
  }

  /**
   * Update data for spike sender histogram.
   */
  override async updateData(activity: SpikeActivity): Promise<any> {
    return new Promise((resolve, reject) => {
      if (activity.nodeIds.length === 0) reject(true);

      const x: number[] = activity.nodeIds;
      const senders: number[] = activity.events.senders;

      const counts = {};
      for (const sender of senders) {
        counts[sender] = counts[sender] ? counts[sender] + 1 : 1;
      }

      const time = this.spikeRate ? activity.endtime / 1000 : 1;
      const y: number[] = x.map((nodeId: number) =>
        counts[nodeId] ? counts[nodeId] / time : 0
      );
      const size = x.length;

      this.data.push({
        activityIdx: activity.idx,
        hoverinfo: 'x+y',
        legendgroup: 'spikes' + activity.idx,
        line: {
          shape: this.lineShape,
        },
        marker: {
          color: activity.recorder.view.color,
          line: {
            color: activity.project.app.darkMode ? '#121212' : 'white',
            width: size > 100 ? 0 : 1,
          },
        },
        mode: this.plotMode,
        name: 'Spike count in each sender in' + activity.recorder.view.label,
        opacity: 0.6,
        showlegend: false,
        type: this.plotType,
        visible: this.state.visible,
        x,
        y,
      });

      resolve(true);
    });
  }

  /**
   * Update layout label for spike sender histogram.
   */
  override updateLayoutLabel(): void {
    this.panel.layout.xaxis.title = 'Neuron ID';
    this.panel.layout.yaxis.title = this.spikeRate
      ? 'Spike rate [1/s]'
      : 'Spike counts';
  }
}
