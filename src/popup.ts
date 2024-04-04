import { handleInputChange } from "./utils/storageUtils";
import { copyTranscript, downloadTranscript } from "./utils/transcriptUtils";
import { validatePage } from "./utils/tabUtils";
import { getElementDict } from "./utils/domUtils";

async function initializeApp() {
  const checkboxes: InputElementDict = getElementDict<HTMLInputElement>([
    "timestamp",
    "line-break",
  ]);
  const buttons: ButtonElementDict = getElementDict<HTMLButtonElement>([
    "copy-button",
    "download-button",
  ]);

  const isValidPage = await validatePage(checkboxes, buttons);
  if (!isValidPage) return;

  Object.values(checkboxes).forEach((checkbox) => {
    checkbox.addEventListener("change", handleInputChange);
  });

  buttons["copy-button"].addEventListener("click", () =>
    copyTranscript(checkboxes)
  );

  buttons["download-button"].addEventListener("click", () =>
    downloadTranscript(checkboxes)
  );

  chrome.storage.local.get(["timestamp", "line-break"], (result) => {
    checkboxes["timestamp"].checked = result["timestamp"];
    checkboxes["line-break"].checked = result["line-break"];
  });
}

document.addEventListener("DOMContentLoaded", initializeApp);
