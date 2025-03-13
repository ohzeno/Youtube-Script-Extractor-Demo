import { DONATE_BUTTON_TEXT, NOTIFICATION } from "../constants";
import { isChristmasSeason } from "./timeUtils";
import { createSnowflakeEffect } from "./christmasUtils";

export function getElementDict<T extends HTMLElement>(
  ids: string[]
): { [key: string]: T } {
  return ids.reduce((acc, id) => {
    acc[id] = document.getElementById(id) as T;
    return acc;
  }, {});
}

function clearExistingTimer(element: NotificationElement): void {
  if (element.timeoutId) {
    clearTimeout(element.timeoutId);
    element.timeoutId = undefined;
  }
}

function updateNotificationClass(
  notificationElement: NotificationElement,
  state: NotificationState
): void {
  notificationElement.className = NOTIFICATION.CLASS_NAMES.BASE;
  let toAdd = NOTIFICATION.CLASS_NAMES.STATE[state];
  notificationElement.classList.add(toAdd);
}

export function showNotification(
  message: string,
  state: NotificationState = "default",
  duration: number = NOTIFICATION.DEFAULT_DURATION
): void {
  const notificationElem: NotificationElement =
    document.getElementById("notification");
  const donationElem = document.getElementById(
    "donation-wrapper"
  ) as HTMLDivElement;
  // 기존 타이머 있으면 클리어
  clearExistingTimer(notificationElem);
  updateNotificationClass(notificationElem, state);
  notificationElem.innerHTML =
    state === "loading" ? createLoadingContent(message) : message;
  donationElem.style.display = "none";
  notificationElem.style.display = "block";

  if (state !== "loading")
    setAutoCloseTimer(notificationElem, donationElem, duration);
}

function createLoadingContent(message: string): string {
  return `
    <div class="notification-content">
      <div class="spinner"></div>
      <span>${message}</span>
    </div>
  `;
}

function setAutoCloseTimer(
  notificationElem: NotificationElement,
  donationElem: HTMLDivElement,
  duration: number = NOTIFICATION.DEFAULT_DURATION
): void {
  // 새 타이머를 설정하고 timeoutId에 저장
  // setTimeout의 반환값이 브라우저에선 number고 NodeJS에선 Timeout이라
  // unknown으로 먼저 타입 캐스팅을 해줘야 함
  notificationElem.timeoutId = setTimeout(() => {
    notificationElem.style.display = "none";
    donationElem.style.display = "block";
    // 타이머가 종료되면 timeoutId를 초기화
    notificationElem.timeoutId = undefined;
  }, duration) as unknown as number;
}

export function applyTheme() {
  const theme = isChristmasSeason() ? "christmas" : null;
  if (!theme) return;
  if (theme === "christmas") createSnowflakeEffect();
  const elements = ["body", "donate-button"];
  elements.forEach((elementId) => {
    const element =
      elementId === "body" ? document.body : document.getElementById(elementId);
    if (element) {
      if (theme === "christmas" && elementId === "donate-button") {
        element.textContent = DONATE_BUTTON_TEXT.CHRISTMAS;
      }
      element.setAttribute("data-theme", theme);
    }
  });
}
