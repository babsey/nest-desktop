import { Connection } from './connection';
import { drawPath } from './connectionGraph';

export class ConnectionView {
  private _colorExcitation = '#595289'; // '#467ab3';
  private _colorInhibition = '#AF143C'; // '#b34846';
  private _connection: Connection; // parent

  constructor(connection: Connection) {
    this._connection = connection;
  }

  colorWeight(): string {
    const value: number = this._connection.synapse.weight;
    if (value === 0) {
      return 'black';
    }
    return value > 0 ? this._colorExcitation : this._colorInhibition;
  }

  isSelected(): boolean {
    return this._connection.network.view.isConnectionSelected(this._connection);
  }

  isFocused(): boolean {
    return this._connection.network.view.isConnectionFocused(this._connection);
  }

  distance(): number {
    if (this._connection.source === this._connection.target) {
      return 0;
    }
    const source: any = this._connection.source.view.position;
    const target: any = this._connection.target.view.position;
    const x1: number = source.x;
    const y1: number = source.y;
    const x2: number = target.x;
    const y2: number = target.y;
    const dx: number = x2 - x1;
    const dy: number = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  probabilistic(): boolean {
    return !['all_to_all', 'one_to_one'].includes(this._connection.rule);
  }

  // getBackgroundImage(): string {
  //   const bg: string = '#fafafa';
  //   const srcColor: string = this._connection.source.view.color;
  //   const tgtColor: string = this._connection.target.view.color;
  //   const gradient: string = ['150deg', srcColor, srcColor, bg, bg, tgtColor, tgtColor].join(', ');
  //   return 'linear-gradient(' + gradient + ')';
  // }

  /**
   * Generates a string describing the end of this connections' marker.
   */
  markerEnd(): string {
    if (this._connection.synapse.weight > 0 && !this.connectRecorder()) {
      return 'url(#exc' + this._connection.idx + ')';
    } else if (this._connection.synapse.weight < 0 && !this.connectRecorder()) {
      return 'url(#inh' + this._connection.idx + ')';
    } else {
      return 'url(#generic' + this._connection.idx + ')';
    }
  }

  select(): void {
    this._connection.network.view.selectedConnection = this._connection;
  }

  focus(): void {
    this._connection.network.view.focusedConnection = this._connection;
  }

  connectRecorder(): boolean {
    return (
      this._connection.source.model.elementType === 'recorder' ||
      this._connection.target.model.elementType === 'recorder'
    );
  }

  connectSpikeDetector(): boolean {
    return this._connection.target.model.existing === 'spike_recorder';
  }

  drawPath(): string {
    const source: any = this._connection.source.view.position;
    const target: any = this._connection.target.view.position;
    const config: any = {
      radius: this._connection.source.config.graph.radius.value,
      ellipticalArc: this._connection.config.graph.ellipticalArc.value,
      xAxisRotation: this._connection.config.graph.xAxisRotation.value,
    };
    return drawPath(source, target, config);
  }

}
