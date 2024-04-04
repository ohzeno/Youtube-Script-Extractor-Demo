import {
  getTranscriptDictIfNotExpired,
  saveTranscriptWithExpiry,
} from "./storageUtils";
import { sendMessageToTab, getPageUrl } from "./tabUtils";
import { showNotification } from "./domUtils";

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

async function processTranscript(
  data: TranscriptDict,
  checkboxes: InputElementDict
): Promise<string> {
  let fullScript = `Title: ${data.title}\n`;
  const timestamp = checkboxes["timestamp"].checked;
  const lineBreak = checkboxes["line-break"].checked;
  for (const item of data.transcript) {
    if (typeof item === "string") {
      if (fullScript[fullScript.length - 1] !== "\n") fullScript += "\n";
      fullScript += item + "\n";
    } else {
      const [timestampStr, text] = item;
      if (timestamp) fullScript += `(${timestampStr}) `;
      fullScript += text + (lineBreak ? "\n" : " ");
    }
  }
  return fullScript.trimEnd();
}

function sanitizeFilename(filename: string): string {
  const reservedWords: string[] = [
    "con",
    "aux",
    "nul",
    "prn",
    ...Array(10)
      .fill(null)
      .map((_, i) => `com${i}`),
    ...Array(10)
      .fill(null)
      .map((_, i) => `lpt${i}`),
  ];

  // 예약어 or '.'으로만 이루어진 이름 체크
  if (
    reservedWords.includes(filename.toLowerCase()) ||
    filename.replace(/\./g, "") === ""
  )
    filename = `${filename}_renamed`;
  else if (!filename)
    // 파일명이 비어있을 경우
    filename = `renamed`;

  const replaceDict: { [key: string]: string } = {
    "\\": "＼",
    "/": "／",
    "|": "｜",
    "?": "？",
    '"': "“",
    "*": "＊",
    ":": "：",
    ".": "․",
    "<": "＜",
    ">": "＞",
  };

  // 특수 문자 대체
  Object.entries(replaceDict).forEach(([original, replacement]) => {
    filename = filename.split(original).join(replacement);
  });
  return filename;
}

async function getFullscriptData(
  checkboxes: InputElementDict
): Promise<{ title: string; fullScript: string }> {
  const videoUrl: string = await getPageUrl();
  const transcriptDict = await getTranscriptDict(videoUrl);
  const fullScript = await processTranscript(transcriptDict, checkboxes);
  const timestamp = checkboxes["timestamp"].checked;
  const lineBreak = checkboxes["line-break"].checked;
  const sanitizedTitle = sanitizeFilename(transcriptDict.title);
  const title = `${sanitizedTitle}_${timestamp ? "TS" : "noTS"}_${
    lineBreak ? "LB" : "noLB"
  }`;
  return { title, fullScript };
}

export async function copyTranscript(
  checkboxes: InputElementDict
): Promise<void> {
  const { fullScript } = await getFullscriptData(checkboxes);
  navigator.clipboard
    .writeText(fullScript)
    .then(() => {
      showNotification("Transcript copied to clipboard!");
    })
    .catch((err: Error) => {
      showNotification(`Error: ${err.message}`);
    });
}

export async function downloadTranscript(
  checkboxes: InputElementDict
): Promise<void> {
  const { title, fullScript } = await getFullscriptData(checkboxes);
  const blob = new Blob([fullScript], { type: "text/plain" });
  const url = URL.createObjectURL(blob); // Blob 객체를 가리키는 URL 생성
  const a = document.createElement("a"); // a 태그 생성
  a.href = url;
  a.download = `${title}.txt`; // 다운로드될 파일명
  document.body.appendChild(a);
  a.click(); // 클릭 이벤트 발생
  showNotification("Check the download history of your browser.");
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // 생성된 URL 해제
}
