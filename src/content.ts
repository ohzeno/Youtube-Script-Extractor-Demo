import { isYouTubeShorts } from "./utils/youtubeUtils";
import { TRANSCRIPT_TYPE } from "./constants";
import { createVideoTranscriptDict } from "./utils/transcriptUtils";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "getTranscriptDict")
    getTranscriptDict().then((transcript) => {
      sendResponse(transcript);
    });
  return true;
});

async function getTranscriptDict(): Promise<TranscriptDict> {
  const videoUrl: string = window.location.href;
  let dataType: TranscriptType = TRANSCRIPT_TYPE.REGULAR;
  if (isYouTubeShorts(videoUrl)) {
    dataType = TRANSCRIPT_TYPE.SHORTS;
  }
  return createVideoTranscriptDict(videoUrl, dataType);
}
