import { Component, OnInit, Input } from '@angular/core';

import { VisualizationService } from './visualization.service';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() frames: any[] = [];
  @Input() layout: any = {};
  @Input() config: any = {};

  constructor(
    public _visualizationervice: VisualizationService,
  ) { }

  ngOnInit() {
  }

}
