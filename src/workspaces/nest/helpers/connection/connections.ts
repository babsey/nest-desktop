// connections.ts

import { BaseConnections } from "@/helpers/connection/connections";

import { INESTConnectionProps, NESTConnection } from "./connection";
import { NESTNetwork } from "../network/network";
import { NESTCode } from "../code/code";

export class NESTConnections extends BaseConnections {
  constructor(network: NESTNetwork, connectionsProps: INESTConnectionProps[] = []) {
    super(network, connectionsProps);
  }

  override get Connection() {
    return NESTConnection;
  }

  override get all(): NESTConnection[] {
    return this._connections as NESTConnection[];
  }

  override get connections(): NESTConnection[] {
    return this._connections as NESTConnection[];
  }

  override get network(): NESTNetwork {
    return this._network as NESTNetwork;
  }

  /**
   * filter connection list by weight recorder.
   */
  get recordedByWeightRecorder(): NESTConnection[] {
    return this.all.filter((connection: NESTConnection) => {
      const synapseModel = connection.synapse.model;
      return synapseModel.hasWeightRecorderParam;
    });
  }

  /**
   * Add code nodes.
   * @param connection connection component.
   *
   */
  override addCodeNodes(connection: NESTConnection): void {
    const code = this.network.project.code as NESTCode;
    connection.codeNodes.node = code.addConnectNodes(connection as NESTConnection);
  }

  // /**
  //  * Add connection component to the network.
  //  * @param connectionProps connection props
  //  * @returns connection object
  //  */
  // override addConnection(connectionProps: INESTConnectionProps): NESTConnection {
  //   this.logger.trace("add");

  //   const connection: NESTConnection = new this.Connection(this, connectionProps);
  //   this.connections.push(connection);

  //   this.clean();
  //   return connection;
  // }

  /**
   * Clean nodes and connection components.
   */
  override clean(): void {
    this.logger.trace("clean");

    this.all.forEach((connection: NESTConnection) => connection.clean());

    this.all.forEach((connection: NESTConnection) => {
      if (connection.source.isNode) connection.sourceSlice.update();
      if (connection.target.isNode) connection.targetSlice.update();
    });
  }

  /**
   * Get connection by synapse model id.
   * @param modelId string
   * @returns connection component.
   */
  getBySynapseModelId(modelId: string): NESTConnection | undefined {
    return this.all.find((connection: NESTConnection) => connection.synapse.modelId === modelId);
  }
}
