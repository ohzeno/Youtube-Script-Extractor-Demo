import {
  getInitialData,
  getInitialSegments,
  getSectionHeader,
  getSegmentData,
} from "./utils/youtubeUtils";
import { sectionHeaderKey, segmentKey } from "./constants";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "getTranscriptDict")
    getTranscriptDict().then((transcript) => {
      sendResponse(transcript);
    });
  return true;
});

async function getTranscriptDict(): Promise<TranscriptDict> {
  const { title, initialData } = await getInitialData();
  const initialSegments = await getInitialSegments(initialData);
  let sectionNumber = 1;
  const transcript = [];
  for (const item of initialSegments) {
    if (sectionHeaderKey in item) {
      const sectionHeader = getSectionHeader(item);
      transcript.push(`section ${sectionNumber++}: ${sectionHeader}`);
    } else if (segmentKey in item) {
      const timestampAndText: [string, string] = getSegmentData(item);
      transcript.push(timestampAndText);
    } else {
      console.error("getTranscriptDict error", item);
    }
  }
  return { title, transcript };
}
