import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { NetworkSketchService } from './network-sketch/network-sketch.service';
import { SimulationService } from '../simulation/services/simulation.service';
import { SimulationProtocolService } from '../simulation/services/simulation-protocol.service';

import { Data } from '../classes/data';


@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit, AfterViewInit {
  @Input() data: Data;
  @Output() networkChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('content', { static: false }) content: ElementRef;
  public width: number = 600;
  public height: number = 400;

  constructor(
    private _networkSketchService: NetworkSketchService,
    private _simulationService: SimulationService,
    private _simulationProtocolService: SimulationProtocolService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    // console.log('Init network')
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.height = this.content['elementRef'].nativeElement.clientHeight;
      this.width = this.content['elementRef'].nativeElement.clientWidth - 40;
    }, 1)
  }

  onNetworkChange(data) {
    this.networkChange.emit(data);
  }

  save() {
    this._networkSketchService.edit(false);
    this._simulationProtocolService.save(this.data, true)
  }

}