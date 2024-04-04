export function saveTranscriptWithExpiry(
  url: string,
  transcriptDict: TranscriptDict
): void {
  const hour = 3600 * 1000;
  const expiry: number = Date.now() + 12 * hour;
  // URL을 키로 대본 저장
  chrome.storage.local.set({ [url]: { transcriptDict, expiry } });
}

export async function getTranscriptDictIfNotExpired(
  url: string
): Promise<TranscriptDict | void> {
  return new Promise((resolve) => {
    chrome.storage.local.get(url, (result) => {
      if (!result[url]) {
        // 저장된 데이터가 없는 경우
        resolve(undefined);
        return;
      }
      const { transcriptDict, expiry } = result[url];
      if (Date.now() < expiry) resolve(transcriptDict);
      else {
        // 데이터가 만료된 경우, 해당 URL의 데이터를 삭제
        chrome.storage.local.remove(url);
        resolve(undefined);
      }
    });
  });
}

export function handleInputChange(event) {
  const target = event.target;
  chrome.storage.local.set({
    [target.id]: target.checked,
  });
}
