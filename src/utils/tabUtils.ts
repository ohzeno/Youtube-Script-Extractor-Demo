import { showNotification } from "./domUtils";
import { REGEX, URLS } from "../constants";

async function getActiveTab(): Promise<chrome.tabs.Tab> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

export async function getPageUrl(): Promise<string> {
  const activeTab = await getActiveTab();
  return activeTab.url;
}

export async function sendMessageToTab(message: any): Promise<any> {
  const activeTab = await getActiveTab();
  const response = await chrome.tabs.sendMessage(activeTab.id, message);
  return response;
}

export async function validatePage(
  checkboxes: InputElementDict,
  buttons: ButtonElementDict
): Promise<boolean> {
  const pageUrl: string = await getPageUrl();
  if (REGEX.general.test(pageUrl)) return true;
  for (const key in checkboxes) checkboxes[key].disabled = true;
  for (const key in buttons) buttons[key].disabled = true;
  showNotification("This page is not a YouTube video page.", "error", 10000);
  return false;
}

export function openDonationPage() {
  chrome.tabs.create({
    url: URLS.DONATION,
    active: true,
  });
}
