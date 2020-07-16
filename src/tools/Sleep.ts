import { resolve } from "path";
import { setTimeout } from "timers";

export default ms => new Promise(resolve => setTimeout(resolve, ms))
