export function msToTimeString(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const formattedSeconds = seconds.toString().padStart(2, "0");
  if (hours > 0) {
    return `${hours}:${minutes}:${formattedSeconds}`;
  }
  return `${minutes}:${formattedSeconds}`;
}

function getThanksgivingDate(year: number): Date {
  const firstOfNov = new Date(year, 10, 1);
  const dayOfFirst = firstOfNov.getDay();
  let diff;
  if (dayOfFirst <= 4) {
    diff = 4 - dayOfFirst; // 목요일까지 남은 일수
  } else {
    diff = 7 - dayOfFirst + 4; // 7 - dayOfFirst: 다음 일요일까지 남은 일수
  }
  const firstThursday = 1 + diff;
  return new Date(year, 10, firstThursday + 21);
}

export function isChristmasSeason(): boolean {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  // 11, 12월이 아니면 false
  if (month < 10) return false;

  const thanksgiving = getThanksgivingDate(year);
  const seasonStart = new Date(year, 10, thanksgiving.getDate() + 1); // 블랙 프라이데이
  const seasonEnd = new Date(year + 1, 0, 1); // 다음 해 1월 1일 00시 00분 00초
  return seasonStart <= today && today <= seasonEnd;
}
