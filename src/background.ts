chrome.runtime.onInstalled.addListener(() => {
  // 만료된 데이터 주기적으로 청소
  chrome.alarms.create("dataCleanup", { periodInMinutes: 12 * 60 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dataCleanup") {
    chrome.storage.local.get(null, (datas) => {
      const allKeys = Object.keys(datas);
      const now = Date.now();

      allKeys.forEach((key) => {
        const data = datas[key];
        if (data.expiry && data.expiry <= now) {
          chrome.storage.local.remove(key);
        }
      });
    });
  }
});
