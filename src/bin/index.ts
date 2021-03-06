import * as moment from "moment";

import { Diary } from "../diary";
import { DEV, PROD } from "../config";

const environment = process.env.NODE_ENV || "DEV";
const m = moment();
let diary;

switch (environment) {
  case "production":
    console.log("### PRODUCTION ###");
    diary = new Diary(PROD);
    break;
  default:
    console.log("### DEVELOPMENT ###");
    diary = new Diary(DEV);
    break;
}

diary.run(m);
