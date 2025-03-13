import { genSnowflakeDict } from "./utils/christmasUtils";
import { generateReservedWords } from "./utils/fileUtils";

export const URLS = {
  GET_TRANSCRIPT: "",
  DONATION: "",
} as const;

export const LONG_VIDEO_KEYS = {} as const;

export const REGEX = {
  general: /^https?:\/\/(?:www\.)?youtube\.com\/(?:watch|live|shorts)/,
  shorts: /youtube\.com\/shorts\//,
};

export const ELEMENT_IDS = {
  CHECKBOXES: {
    TIMESTAMP: "timestamp",
    LINE_BREAK: "line-break",
  },
  BUTTONS: {
    COPY: "copy-button",
    DOWNLOAD: "download-button",
    DONATE: "donate-button",
  },
} as const;

export const STORAGE_KEYS = {
  TIMESTAMP: "timestamp",
  LINE_BREAK: "line-break",
} as const;

export const YOUTUBE_DATA_KEYS = {} as const;

export const TRANSCRIPT_TYPE = {
  REGULAR: "regular",
  SHORTS: "shorts",
} as const;

export const NOTIFICATION = {
  MESSAGES: {
    NOT_YOUTUBE_PAGE: "This page is not a YouTube video page.",
    NO_TRANSCRIPT: "No transcript available.",
    DOCUMENT_NOT_FOCUSED: "Please keep the popup window focused while copying.",
  },
  CLASS_NAMES: {
    BASE: "notification",
    STATE: {
      default: "notification-default",
      error: "notification-error",
      warning: "notification-warning",
      loading: "notification-loading",
    },
  },
  DEFAULT_DURATION: 3500,
} as const;

export const ERROR_MAPPING: ErrorMappingType = {
  NotAllowedError: {
    message: NOTIFICATION.MESSAGES.DOCUMENT_NOT_FOCUSED,
    state: "warning",
  },
} as const;

export const REPLACE_DICT: { [key: string]: string } = {} as const;

export const RESERVED_WORDS = generateReservedWords();

export const SNOWFLAKE_DICT: SnowflakeDict = genSnowflakeDict();

export const SNOWFLAKE_COUNTS = {} as const;

export const DONATE_BUTTON_TEXT = {
  CHRISTMAS: "☕ Support with cocoa",
} as const;
