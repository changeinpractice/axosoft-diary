import * as rp from "request-promise";
import * as moment from "moment";

/**
 * GET and POST tasks from the api
 * 
 * @class Diary
 */
export class Diary {

  private _apiUri: string;
  private _apiToken: string;
  private _apiProjectId: string;
  private _apiJson: boolean;
  private _tasks: any = [];
  private _taskDay: string;
  private _taskMonth: string;
  private _taskDate: string;

  constructor(_config: any) {
    this._apiUri = _config.apiUri;
    this._apiToken = _config.apiToken;
    this._apiProjectId = _config.apiProjectId;
    this._apiJson = _config.apiJson;
    this._taskDay = _config.taskDay;
    this._taskMonth = _config.taskMonth;
    this._taskDate = _config.taskDate;
  }

  /**
   * Run the diary
   * 
   * @class Diary
   * @method run
   * @return void
   */
  public run(): void {

    this._getTasks()
      .then(tasks => {
        tasks.reduce((cur, next) => {
          return cur
            .then(() => {
              return this._postTask(next);
            });
        }, Promise.resolve()).then(() => {
          console.log("## All Promises Executed ##");
        })
          .catch(err => this._handleError(err));
      });
  }

  /**
   * Handle errors
   * 
   * @class Diary
   * @method _handleError
   * @return void
   */
  private _handleError(error: any): void {
    console.log(error);
  }

  /**
   * Get tasks from the api
   * 
   * @class Diary
   * @method _getTasks
   * @return Promise<any>
   */
  private _getTasks(): Promise<any> {
    const m = moment();
    const options = {
      "method": "GET",
      "uri": `${this._apiUri}/tasks`,
      "qs": {
        "access_token": this._apiToken,
        "project_id": this._apiProjectId
      },
      "json": this._apiJson
    };

    return rp(options)
      .then(tasks => {

        console.log(`_getTasks starts: ${tasks.data.length} tasks.`);

        tasks.data.forEach(task => {
          if (task.custom_fields[this._taskDay].indexOf(m.format("dddd")) !== -1 ||
            task.custom_fields[this._taskMonth].indexOf(m.format("MMMM")) !== -1 &&
            task.custom_fields[this._taskDate] === m.format("D")) {
            this._tasks.push(task);
          }
        });

        console.log(`_getTasks ends: ${this._tasks.length} tasks.`);
        return this._tasks;
      })
      .catch(err => this._handleError(err));
  }

  /**
   * Post tasks to the api
   * 
   * @class Diary
   * @method _postTask
   * @retunr Promise<any>
   */
  private _postTask(task: any): Promise<any> {
    const options = {
      "method": "POST",
      "uri": `${this._apiUri}/incidents`,
      "qs": {
        "access_token": this._apiToken,
      },
      "body": {
        "item": {
          "name": task.name,
          "description": task.description,
          "assigned_to": {
            "type": task.assigned_to.type,
            "id": task.assigned_to.id,
          },
          "project": {
            "id": task.project.id,
          }
        },
      },
      "json": this._apiJson
    };

    return rp(options)
      .then(res => {
        console.log(res.data.name);
        return res;
      })
      .catch(err => this._handleError(err));
  }
}
