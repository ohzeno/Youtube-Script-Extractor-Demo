interface TranscriptDict {
  title: string;
  transcript: Array<string | TranscriptItemData>;
}

interface TranscriptSettings {
  includeTimestamp: boolean;
  useLineBreak: boolean;
}

type YouTubeDataMap = {};

type YoutubeDataMapKey = keyof YouTubeDataMap;

type VideoIdExtractor<T> = (data: T) => string | undefined;

type TitleExtractor<T> = (data: T) => string;

type TranscriptType = "regular" | "shorts";

interface RequestBody {
  context: {
    client: {};
    request: {
      useSsl: boolean;
    };
  };
  params: string;
}

interface TranscriptSegment {}

interface TranscriptSectionHeader {}

type InitialSegment = TranscriptSegment | TranscriptSectionHeader;

interface ShortsEvent {}

type TranscriptItemData = [string, string];

interface InputElementDict {
  [key: string]: HTMLInputElement;
}

interface ButtonElementDict {
  [key: string]: HTMLButtonElement;
}

interface NotificationElement extends HTMLElement {
  timeoutId?: number;
}

type NotificationState = "loading" | "default" | "error" | "warning";

interface NotificationMapping {
  message: string;
  state: NotificationState;
}

type ErrorMappingType = {
  [key: string]: NotificationMapping;
};

interface SnowflakeDict {
  readonly [key: string]: {
    readonly realDist: number;
    readonly realPlaneArea: number;
    readonly velocityInPixelPlane: number;
    readonly fallTime: number;
    readonly realAreaRatio: number;
  };
}
