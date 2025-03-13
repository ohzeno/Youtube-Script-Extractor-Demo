import { SNOWFLAKE_COUNTS, SNOWFLAKE_DICT } from "../constants";
import { radians } from "./mathUtils";

function shouldApplyBlur(): boolean {
  const threads = navigator.hardwareConcurrency || 4;
  return threads >= 8;
}

export function createSnowflakeEffect() {
  const body = document.body;
  const applyBlur = shouldApplyBlur();
  for (const pixel of Object.keys(SNOWFLAKE_DICT)) {
    const fallTime = SNOWFLAKE_DICT[pixel].fallTime;
    const count = SNOWFLAKE_COUNTS[pixel];
    createSnowflake(body, pixel, fallTime, applyBlur, count);
  }
}

function createSnowflake(body, pixel, fallTime, applyBlur, count = 1) {}

export function genSnowflakeDict(): SnowflakeDict {}
