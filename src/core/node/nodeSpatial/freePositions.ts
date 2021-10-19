import * as math from 'mathjs';

import { Node } from '../node';
import { NodeSpatial } from './nodeSpatial';

export class FreePositions {
  private readonly _name = 'free';
  private _edgeWrap: boolean;
  private _extent: number[];
  private _numDimensions: number;
  private _pos: any;
  private _spatial: NodeSpatial;

  constructor(spatial: NodeSpatial, positions: any = {}) {
    this._spatial = spatial;

    this._pos = positions.pos || [];
    this._numDimensions = positions.numDimensions || 2;
    this._extent = positions.extent || new Array(this._numDimensions).fill(1);
    this._edgeWrap = positions.edgeWrap || false;
  }

  get edgeWrap(): boolean {
    return this._edgeWrap;
  }

  set edgeWrap(value: boolean) {
    this._edgeWrap = value;
  }

  get extent(): number[] {
    return this._extent;
  }

  set extent(value: number[]) {
    this._extent = value;
  }

  get name(): string {
    return this._name;
  }

  get numDimensions(): number {
    return this._numDimensions;
  }

  set numDimensions(value: number) {
    this._numDimensions = value;
    this._extent = new Array(this._numDimensions).fill(1);
  }

  get pos(): number[][] {
    return this._pos;
  }

  set pos(value: number[][]) {
    this._pos = value;
  }

  get spatial(): NodeSpatial {
    return this._spatial;
  }

  /**
   * Rounds down the value (to two places after the comma).
   */
  round(value: number): number {
    return Math.floor(value * 100) / 100;
  }

  /**
   * Generate positions.
   */
  generate(): void {
    const minX: number = (-1 * this._extent[0]) / 2;
    const maxX: number = this._extent[0] / 2;
    const minY: number = (-1 * this._extent[1]) / 2;
    const maxY: number = this._extent[1] / 2;
    const minZ: number = (-1 * this._extent[2]) / 2;
    const maxZ: number = this._extent[2] / 2;
    // console.log(center,extent,minX,maxX,minY,maxY,length)

    this._pos = Array.from({ length: this._spatial.node.size }, () => {
      const x: number = math.random(minX, maxX);
      const y: number = math.random(minY, maxY);
      const pos: number[] = [this.round(x), this.round(y)];
      if (this._numDimensions === 3) {
        const z: number = math.random(minZ, maxZ);
        pos.push(this.round(z));
      }
      return pos;
    });
  }

  /**
   * Write code for free positons.
   */
  toCode(): string {
    let args: string[] = [];
    if (this._pos.length > 0) {
      args.push(
        '[' +
          this._pos
            .map((p: number[]) => {
              const plist: string[] = p.map((pp: number) => pp.toFixed(2));
              return '[' + plist.join(',') + ']';
            })
            .join(',') +
          ']'
      );
    } else {
      args.push(`nest.random.uniform(-0.5, 0.5)`);
      args.push(`num_dimensions=${this._numDimensions}`);
    }
    return (
      'nest.spatial.free(' +
      this.spatial.node.code._(2) +
      args.join(',' + this.spatial.node.code._(2)) +
      '\n)'
    );
  }

  /**
   * Serialize for JSON.
   * @return free positons object
   */
  toJSON(): any {
    const positions: any = {
      edgeWrap: this._edgeWrap,
      extent: this._extent,
      numDimensions: this._numDimensions,
      pos: this._pos,
    };
    return positions;
  }
}