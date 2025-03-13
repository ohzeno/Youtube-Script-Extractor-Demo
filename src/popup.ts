import { handleInputChange } from "./utils/storageUtils";
import { copyTranscript, downloadTranscript } from "./utils/transcriptUtils";
import { openDonationPage, validatePage } from "./utils/tabUtils";
import { applyTheme, getElementDict } from "./utils/domUtils";
import { ELEMENT_IDS, STORAGE_KEYS } from "./constants";

async function initializeApp() {
  const checkboxes: InputElementDict = getElementDict<HTMLInputElement>([
    ELEMENT_IDS.CHECKBOXES.TIMESTAMP,
    ELEMENT_IDS.CHECKBOXES.LINE_BREAK,
  ]);
  const buttons: ButtonElementDict = getElementDict<HTMLButtonElement>([
    ELEMENT_IDS.BUTTONS.COPY,
    ELEMENT_IDS.BUTTONS.DOWNLOAD,
    ELEMENT_IDS.BUTTONS.DONATE,
  ]);

  const isValidPage = await validatePage(checkboxes, buttons);
  if (!isValidPage) return;

  Object.values(checkboxes).forEach((checkbox) => {
    checkbox.addEventListener("change", handleInputChange);
  });

  buttons[ELEMENT_IDS.BUTTONS.COPY].addEventListener("click", () =>
    copyTranscript(checkboxes)
  );

  buttons[ELEMENT_IDS.BUTTONS.DOWNLOAD].addEventListener("click", () =>
    downloadTranscript(checkboxes)
  );

  buttons[ELEMENT_IDS.BUTTONS.DONATE].addEventListener(
    "click",
    openDonationPage
  );

  chrome.storage.local.get(
    [STORAGE_KEYS.TIMESTAMP, STORAGE_KEYS.LINE_BREAK],
    (result) => {
      checkboxes[ELEMENT_IDS.CHECKBOXES.TIMESTAMP].checked =
        result[STORAGE_KEYS.TIMESTAMP];
      checkboxes[ELEMENT_IDS.CHECKBOXES.LINE_BREAK].checked =
        result[STORAGE_KEYS.LINE_BREAK];
    }
  );
  applyTheme();
}

initializeApp();
