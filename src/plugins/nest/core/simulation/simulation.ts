// simulation.ts - 9 anys

import { reactive, UnwrapRef } from "vue";
import { Config } from "@/helpers/config";
import { openToast } from "@/helpers/toast";

import { Project } from "../project/project";
import { SimulationCode, SimulationCodeProps } from "./simulationCode";
import { SimulationKernel, SimulationKernelProps } from "./simulationKernel";
import { useNESTSimulatorStore } from "@nest/store/backends/nestSimulatorStore";

export interface SimulationProps {
  code?: SimulationCodeProps;
  kernel?: SimulationKernelProps;
  time?: number;
}

interface SimulationState {
  biologicalTime: number;
  running: boolean;
  timeInfo: { [key: string]: number };
}

export class Simulation extends Config {
  private _code: SimulationCode;
  private _kernel: SimulationKernel; // simulation kernel
  private _project: Project; // parent
  private _state: UnwrapRef<SimulationState>;
  private _time: number; // simulation time

  constructor(project: Project, simulation: SimulationProps = {}) {
    super("Simulation");
    this._project = project;

    // Initialize code, kernel and time.
    this._code = new SimulationCode(this, simulation.code);
    this._kernel = new SimulationKernel(this, simulation.kernel);
    this._time = simulation.time ? simulation.time : 1000;

    // Initialize simulation state.
    this._state = reactive({
      biologicalTime: 0,
      running: false,
      timeInfo: {
        begin: 0,
        current: 0,
        end: 0,
        stepSize: 1,
      },
    });
  }

  get nestSimulator(): any {
    const nestSimulatorStore = useNESTSimulatorStore();
    return nestSimulatorStore.backend
  }

  get code(): SimulationCode {
    return this._code;
  }

  get kernel(): SimulationKernel {
    return this._kernel;
  }

  get project(): Project {
    return this._project;
  }

  get state(): UnwrapRef<SimulationState> {
    return this._state;
  }

  get time(): number {
    return this._time;
  }

  set time(value: number) {
    this._time = value;
  }

  get timeFixed(): string {
    return this._time.toFixed(1);
  }

  /**
   *Generate seed and simulation code.
   */
  generateSeed(): void {
    if (this._kernel.config.autoRNGSeed) {
      this._kernel.rngSeed = Math.round(Math.random() * 1000);
      this._code.generate();
    }
  }

  /**
   * Reset simulation states.
   */
  resetState(): void {
    this._state.biologicalTime = 0;
    this._state.timeInfo = {
      begin: 0,
      current: 0,
      end: 0,
      stepSize: 1,
    };
  }

  /**
   * Run simulation.
   *
   * @remarks
   * After the simulation it updates the activities and commits the network.
   */
  private async runSimulation(): Promise<any> {
    console.debug("Run simulation");

    return this.nestSimulator.instance
      .post("exec", {
        source: this._code.script,
        return: "response",
      })
      .then((response: any) => {
        let data: any;
        switch (response.status) {
          case 0:
            openToast("Failed to find NEST Simulator.", {type: "error"});
            break;
          case 200:
            if (response.data.data == null) {
              break;
            }
            data = response.data.data;

            // Get biological time
            this.state.biologicalTime =
              data.biological_time != null ? data.biological_time : this._time;

            break;
          default:
            openToast(response.data, {type:"error"});
            break;
        }
        return response;
      })
      .catch((error: any) => {
        if ("response" in error && error.response.data != undefined) {
          // The request made and the server responded.
          openToast(error.response.data, {type:"error"});
        } else if ("request" in error) {
          // The request was made but no response was received.
          openToast(
            "Failed to perform simulation (NEST Simulator is not running).",
            {type:"error"}
          );
        } else if ("message" in error && error.message != undefined) {
          // Something happened in setting up the request
          // that triggered an error.
          openToast(error.message, {type:"error"});
        } else {
          openToast(error, {type:"error"});
        }
      })
      .finally(() => {
        this._state.running = false;
      });
  }

  /**
   * Run simulation with recording backend Insite.
   *
   * @remarks
   * During the simulation it gets and updates activities.
   */
  private async runWithInsite(): Promise<any> {
    console.debug("Run simulation with Insite");
    this._state.timeInfo = {
      begin: 0,
      current: 0,
      end: 0,
      stepSize: 1,
    };

    return this.nestSimulator.instance
      .post("exec", { source: this._code.script })
      .then((response: any) => {
        switch (response.status) {
          case 0:
            openToast(
              "Failed to perform simulation (NEST Simulator is not running).",
              {type:"error"}
            );
            this._project.insite.cancelAllIntervals();
            break;
          case 200:
            if (this._code.runSimulation) {
              this._project.insite.simulationEndNotification();
            }
            break;
          default:
            openToast(response.responseText, {type:"error"});
            this._project.insite.cancelAllIntervals();
            break;
        }
        return response;
      })
      .catch((error: any) => {
        this._project.insite.cancelAllIntervals();
        if ("response" in error && error.response.data != undefined) {
          openToast(error.response.data, {type:"error"});
        }
        return error;
      })
      .finally(() => {
        this._state.running = false;
      });
  }

  /**
   * Start simulation.
   *
   * @remarks
   * It runs the simulation with or without Insite.
   */
  async start(): Promise<any> {
    this.resetState();

    // Generate seed and update simulation code.
    this.generateSeed();

    this._state.running = true;
    return this._code.runSimulationInsite
      ? this.runWithInsite()
      : this.runSimulation();
  }

  /**
   * Serialize for JSON.
   * @return simulation object
   */
  toJSON(): SimulationProps {
    const simulation: SimulationProps = {
      code: this._code.toJSON(),
      kernel: this._kernel.toJSON(),
      time: this._time,
    };
    return simulation;
  }
}