import {
  getTranscriptDictIfNotExpired,
  saveTranscriptWithExpiry,
} from "./storageUtils";
import { sendMessageToTab, getPageUrl } from "./tabUtils";
import { showNotification } from "./domUtils";
import {
  getYtData,
  getTranscriptItems,
  getSectionHeader,
  getTranscriptItemData,
  determineTranscriptType,
} from "./youtubeUtils";
import {
  LONG_VIDEO_KEYS,
  YOUTUBE_DATA_KEYS,
  TRANSCRIPT_TYPE,
  ELEMENT_IDS,
} from "../constants";
import { sanitizeFilename } from "./fileUtils";
import { mapErrorToNotification } from "./errorUtils";

async function getTranscriptDict(videoUrl: string): Promise<TranscriptDict> {
  let transcriptDict = await getTranscriptDictIfNotExpired(videoUrl);
  if (!transcriptDict) {
    // 대본이 없거나 만료된 경우
    transcriptDict = (await sendMessageToTab(
      "getTranscriptDict"
    )) as TranscriptDict;
    saveTranscriptWithExpiry(videoUrl, transcriptDict);
  }
  return transcriptDict;
}

function processTranscript(
  data: TranscriptDict,
  settings: TranscriptSettings
): string {
  let fullScript = `Title: ${data.title}\n`;
  const { includeTimestamp, useLineBreak } = settings;
  for (const item of data.transcript) {
    if (typeof item === "string") {
      if (fullScript[fullScript.length - 1] !== "\n") fullScript += "\n";
      fullScript += item + "\n";
    } else {
      const [timestampStr, text] = item;
      if (includeTimestamp) fullScript += `(${timestampStr}) `;
      fullScript += text + (useLineBreak ? "\n" : " ");
    }
  }
  return fullScript.trimEnd();
}

function formatTitle(title: string, settings: TranscriptSettings): string {
  const sanitizedTitle = sanitizeFilename(title);
  const timestamp = settings.includeTimestamp ? "TS" : "noTS";
  const lineBreak = settings.useLineBreak ? "LB" : "noLB";
  return `${sanitizedTitle}_${timestamp}_${lineBreak}`;
}

function extractSettingsFromCheckboxes(
  checkboxes: InputElementDict
): TranscriptSettings {
  return {
    includeTimestamp: checkboxes[ELEMENT_IDS.CHECKBOXES.TIMESTAMP].checked,
    useLineBreak: checkboxes[ELEMENT_IDS.CHECKBOXES.LINE_BREAK].checked,
  };
}

async function getFullscriptData(
  checkboxes: InputElementDict
): Promise<{ title: string; fullScript: string }> {
  const videoUrl: string = await getPageUrl();
  const transcriptDict = await getTranscriptDict(videoUrl);
  if (transcriptDict.transcript.length === 0) {
    showNotification("No transcript available.", "warning");
    return { title: "", fullScript: "" };
  }
  const settings = extractSettingsFromCheckboxes(checkboxes);
  const fullScript = processTranscript(transcriptDict, settings);
  const title = formatTitle(transcriptDict.title, settings);
  return { title, fullScript };
}

export async function copyTranscript(
  checkboxes: InputElementDict
): Promise<void> {
  showNotification("Copying transcript...", "loading");
  const { fullScript } = await getFullscriptData(checkboxes);
  if (!fullScript) return;
  navigator.clipboard
    .writeText(fullScript)
    .then(() => {
      showNotification("Transcript copied to clipboard!", "default");
    })
    .catch((err: Error) => {
      const { message, state } = mapErrorToNotification(err);
      showNotification(message, state);
    });
}

export async function downloadTranscript(
  checkboxes: InputElementDict
): Promise<void> {
  showNotification("Downloading transcript...", "loading");
  const { title, fullScript } = await getFullscriptData(checkboxes);
  if (!fullScript) return;
  const blob = new Blob([fullScript], { type: "text/plain" });
  const url = URL.createObjectURL(blob); // Blob 객체를 가리키는 URL 생성
  const a = document.createElement("a"); // a 태그 생성
  a.href = url;
  a.download = `${title}.txt`; // 다운로드될 파일명
  document.body.appendChild(a);
  a.click(); // 클릭 이벤트 발생
  showNotification("Check the download history of your browser.", "default");
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // 생성된 URL 해제
}

function createVideoTranscriptArray(
  input: InitialSegment[] | ShortsEvent[],
  dataType: TranscriptType
): (string | TranscriptItemData)[] {
  if (dataType === TRANSCRIPT_TYPE.REGULAR) {
    return createLongVideoTranscriptArray(input as InitialSegment[]);
  }
  return createShortVideoTranscriptArray(input as ShortsEvent[]);
}

function createLongVideoTranscriptArray(
  segments: InitialSegment[]
): (string | TranscriptItemData)[] {
  let sectionNumber = 1;
  const transcript = [];
  for (const seg of segments) {
    if (LONG_VIDEO_KEYS.SECTION_HEADER in seg) {
      const sectionHeader = getSectionHeader(seg);
      transcript.push(`section ${sectionNumber++}: ${sectionHeader}`);
    } else if (LONG_VIDEO_KEYS.SEGMENT in seg) {
      const timestampAndText: TranscriptItemData = getTranscriptItemData(
        seg,
        TRANSCRIPT_TYPE.REGULAR
      );
      transcript.push(timestampAndText);
    } else {
      console.error("getTranscriptDict error", seg);
    }
  }
  return transcript;
}

function createShortVideoTranscriptArray(
  events: ShortsEvent[]
): TranscriptItemData[] {
  const transcript = [];
  for (const event of events) {
    if (!("segs" in event)) continue;
    if (
      event.segs.length === 1 &&
      (event.segs[0].utf8 === "\n" || event.segs[0].utf8 === "")
    )
      continue;
    const timestampAndText: TranscriptItemData = getTranscriptItemData(
      event,
      TRANSCRIPT_TYPE.SHORTS
    );
    transcript.push(timestampAndText);
  }
  return transcript;
}

export async function createVideoTranscriptDict(
  videoUrl: string,
  initialDataType: TranscriptType
): Promise<TranscriptDict> {
  const { title, ytData, dataKey, dataType } = await resolveYouTubeData(
    videoUrl,
    initialDataType
  );
  const segments = (await getTranscriptItems(ytData, dataKey)) as
    | InitialSegment[]
    | ShortsEvent[];
  if (segments.length === 0) return { title, transcript: [] };
  const transcript = createVideoTranscriptArray(segments, dataType);
  return { title, transcript };
}

async function resolveYouTubeData(
  videoUrl: string,
  initialDataType: TranscriptType
): Promise<{
  title: string;
  ytData: YouTubeDataMap[typeof dataKey];
  dataKey: YoutubeDataMapKey;
  dataType: TranscriptType;
}> {
  let dataKey =
    initialDataType === TRANSCRIPT_TYPE.REGULAR
      ? YOUTUBE_DATA_KEYS.key1
      : YOUTUBE_DATA_KEYS.key2;
  let { title, [dataKey]: ytData } = await getYtData(videoUrl, dataKey);
  if (dataKey === YOUTUBE_DATA_KEYS.key1) {
    const actualDataType = determineTranscriptType(ytData as Key1);
    if (actualDataType === TRANSCRIPT_TYPE.SHORTS) {
      dataKey = YOUTUBE_DATA_KEYS.key2;
      ({ title, [dataKey]: ytData } = await getYtData(
        videoUrl,
        YOUTUBE_DATA_KEYS.key2
      ));
      initialDataType = TRANSCRIPT_TYPE.SHORTS;
    }
  }
  return { title, ytData, dataKey, dataType: initialDataType };
}
