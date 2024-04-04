export function getElementDict<T extends HTMLElement>(
  ids: string[]
): { [key: string]: T } {
  return ids.reduce((acc, id) => {
    acc[id] = document.getElementById(id) as T;
    return acc;
  }, {});
}

export function showNotification(
  message: string,
  duration: number = 3500
): void {
  const notificationElement = document.getElementById("notification");
  notificationElement.innerText = message;
  notificationElement.style.display = "block";

  setTimeout(() => {
    notificationElement.style.display = "none";
  }, duration);
}
