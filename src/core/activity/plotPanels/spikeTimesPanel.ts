import { ActivityChartGraph } from '../activityChartGraph';
import { ActivityGraphPanel } from './activityGraphPanel';
import { SpikeActivity } from '../spikeActivity';

export class SpikeTimesPanel extends ActivityGraphPanel {
  constructor(graph: ActivityChartGraph, configName: string = null) {
    super(graph, configName);
    this.name = 'SpikeTimesPanel';
    this.label = 'parent panel of spike times';
    this.init();
  }

  init(): void {
    this.activities = this.graph.project.spikeActivities;
    this.data = [];
  }

  updateColor(): void {
    this.activities.forEach((activity: SpikeActivity) => {
      const data: any = this.data.find(
        (d: any) => d.activityIdx === activity.idx
      );
      if (data == undefined) {
        return;
      }
      data.marker.color = activity.recorder.view.color;
    });
  }
}
