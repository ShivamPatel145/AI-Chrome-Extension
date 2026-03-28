/*global chrome*/

const isChromeExtension = () => {
  return typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
};

export const saveData = async (key, data) => {
  if (!key) return;

  if (isChromeExtension()) {
    try {
      await chrome.storage.local.set({ [key]: data });
    } catch (error) {
      console.error("Error saving to extension storage", error);
    }
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to local storage", error);
  }
};

export const loadData = async (key) => {
  if (!key) return null;

  if (isChromeExtension()) {
    try {
      const data = await chrome.storage.local.get(key);
      return data?.[key] ?? null;
    } catch (error) {
      console.error("Error loading from extension storage", error);
      return null;
    }
  }

  try {
    const rawData = localStorage.getItem(key);
    if (rawData === null) return null;
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error loading from local storage", error);
    return null;
  }
};
