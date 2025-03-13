import { ERROR_MAPPING } from "../constants";

export function mapErrorToNotification(error: Error): NotificationMapping {
  if (error instanceof DOMException) {
    const customError = ERROR_MAPPING[error.name];
    if (customError) return customError;
  }
  return {
    message: `Error: ${error.message}`,
    state: "error",
  };
}
