import { REPLACE_DICT, RESERVED_WORDS } from "../constants";

export function generateReservedWords(): readonly string[] {
  const baseWords = ["con", "aux", "nul", "prn"];
  const comPorts = Array(10)
    .fill(null)
    .map((_, i) => `com${i}`);
  const lptPorts = Array(10)
    .fill(null)
    .map((_, i) => `lpt${i}`);

  return [...baseWords, ...comPorts, ...lptPorts] as const;
}

export function sanitizeFilename(filename: string): string {
  // 예약어 or '.'으로만 이루어진 이름 체크
  if (
    RESERVED_WORDS.includes(filename.toLowerCase()) ||
    filename.replace(/\./g, "") === ""
  )
    filename = `${filename}_renamed`;
  else if (!filename)
    // 파일명이 비어있을 경우
    filename = `renamed`;

  // 특수 문자 대체
  Object.entries(REPLACE_DICT).forEach(([original, replacement]) => {
    filename = filename.split(original).join(replacement);
  });
  return filename;
}
