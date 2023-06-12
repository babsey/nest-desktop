// projectDB.ts

import { DatabaseService } from '@/helpers/database';

export class ProjectDB extends DatabaseService {
  constructor() {
    super('NEST_PROJECT_STORE');
  }

  /**
   * Add projects to the database.
   */
  async addProjects(data: any[]): Promise<any> {
    console.debug('Add projects');
    const projects: any[] = data.map(
      (project: any) =>
        new Promise<any>(resolve => {
          this.addProject(project).then(() => {
            resolve(project);
          });
        })
    );
    return Promise.all(projects);
  }

  /**
   * Import projects from assets to the database.
   */
  async importProjectsFromAssets(): Promise<any> {
    console.debug('Import projects from assets');
    let promise: Promise<any> = Promise.resolve();
    // this.app.config.projects.forEach((file: string) => {
    //   const data: any = require('../../assets/projects/' + file + '.json');
    //   promise = promise.then(() => this.addProject(data));
    // });
    return promise;
  }

  /**
   * Add project to the database.
   */
  async addProject(data: any): Promise<any> {
    console.debug('Add project: ' + data.name);
    // const project: Project = new Project(data);
    // return this.create(project);
  }
}
