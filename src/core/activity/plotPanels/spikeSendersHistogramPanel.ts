import * as d3 from 'd3';

import { ActivityChartGraph } from '../activityChartGraph';
import { SpikeActivity } from '../spikeActivity';
import { SpikeTimesPanel } from './spikeTimesPanel';

export class SpikeSendersHistogramPanel extends SpikeTimesPanel {
  constructor(graph: ActivityChartGraph) {
    super(graph);
    this.name = 'SpikeSendersHistogramPanel';
    this.icon = 'mdi-chart-bar';
    this.label = 'histogram of spike senders';
    this.visible = false;
    this.xaxis = 4;
    this.init();
  }

  /**
   * Update data for spike sender histogram.
   */
  updateData(activity: SpikeActivity): void {
    // console.log('Update data of spike time histogram.');
    const x: number[] = activity.events.senders;
    const start: number = d3.min(x);
    const end: number = d3.max(x) + 1;
    const size = 1;

    this.data.push({
      activityIdx: activity.idx,
      type: 'histogram',
      source: 'x',
      histfunc: 'count',
      legendgroup: 'spikes' + activity.idx,
      name: 'Histogram of spike senders in' + activity.recorder.view.label,
      hoverinfo: 'y',
      showlegend: false,
      opacity: 0.6,
      xbins: {
        start,
        end,
        size,
      },
      marker: {
        color: activity.recorder.view.color,
        line: {
          color: 'white',
          width: (end - start) / size > 100 ? 0 : 1,
        },
      },
      x,
    });
  }

  /**
   * Update layout label for spike sender histogram.
   */
  updateLayoutLabel(): void {
    this.layout.xaxis.title = 'Neuron ID';
    this.layout.yaxis.title = 'Spike count';
  }
}
