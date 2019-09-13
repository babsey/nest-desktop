import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NetworkConfigService } from '../network-config/network-config.service';
import { PositionService } from '../services/position.service';

@Component({
  selector: 'app-node-spatial',
  templateUrl: './node-spatial.component.html',
  styleUrls: ['./node-spatial.component.scss']
})
export class NodeSpatialComponent implements OnInit {
  @Input() node: any;
  @Input() collection: any;
  @Output() spatialClick: EventEmitter<any> = new EventEmitter();
  @Output() spatialChange: EventEmitter<any> = new EventEmitter();
  public data: any[] = [];
  public layout: any = {};
  public showPlot: boolean = false;
  public positionType: string = 'free';

  constructor(
    public _networkConfigService: NetworkConfigService,
    private _positionService: PositionService,
  ) { }

  ngOnInit() {
  }

  plot() {
    if (!this.collection.spatial.hasOwnProperty('positions')) return
    var x = [];
    var y = [];
    this.collection.spatial.positions.map(p => {
      x.push(p[0])
      y.push(p[1])
    })

    this.data = [{
      mode: 'markers',
      type: 'scattergl',
      x: x,
      y: y,
      hoverinfo: 'x+y',
      showlegend: false,
      marker: {
        color: 'black',
        size: 5,
      }
    }]

    var center = this.collection.spatial.center || [0, 0];
    var extent = this.collection.spatial.extent || [1, 1];
    var minX = center[0] - extent[0] / 2;
    var maxX = center[0] + extent[0] / 2;
    var minY = center[1] - extent[1] / 2;
    var maxY = center[1] + extent[1] / 2;

    this.layout = {
      xaxis: {
        range: [minX + minX / 100, maxX + maxX / 100],
        title: 'Row',
      },
      yaxis: {
        range: [minY + minY / 100, maxY + maxY / 100],
        title: 'Column',
      },
      title: 'Positions'
    };
  }

  spatialEvent(event) {
    this.collection.spatial['edge_wrap'] = event.option.selected;
    // this.spatialChange.emit()
  }

  genPositions() {
    switch (this.positionType) {
      case 'free':
        this.collection.spatial.positions = this._positionService.freePositions(this.collection);
        break;
      case 'grid':
        this.collection.spatial.positions = this._positionService.gridPositions(this.collection);
        break;
    }
    delete this.collection.rows;
    delete this.collection.columns;
    this.plot()
    this.spatialChange.emit(this.collection.spatial)
  }
}
