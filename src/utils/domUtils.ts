export function getElementDict<T extends HTMLElement>(
  ids: string[]
): { [key: string]: T } {
  return ids.reduce((acc, id) => {
    acc[id] = document.getElementById(id) as T;
    return acc;
  }, {});
}

function updateNotificationClass(
  notificationElement: NotificationElement,
  message: string
): void {
  notificationElement.className = "notification";
  let toAdd = "notification-default";
  if (message === "This page is not a YouTube video page.") {
    toAdd = "notification-error";
  } else if (message === "No transcript available.")
    toAdd = "notification-warning";
  notificationElement.classList.add(toAdd);
}

export function showNotification(
  message: string,
  duration: number = 3500
): void {
  const notificationElement: NotificationElement =
    document.getElementById("notification");

  if (notificationElement.timeoutId)
    clearTimeout(notificationElement.timeoutId);

  updateNotificationClass(notificationElement, message);
  notificationElement.innerText = message;
  notificationElement.style.display = "block";

  notificationElement.timeoutId = setTimeout(() => {
    notificationElement.style.display = "none";
    notificationElement.timeoutId = undefined;
  }, duration) as unknown as number;
}
