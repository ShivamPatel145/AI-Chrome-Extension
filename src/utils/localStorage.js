/*global chrome*/

const isChromeExtension = () => {
  return typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
};

// Function to save data to local storage or Chrome extension storage
export const saveData = async (key, data) => {
  if (!key) return;

  if (isChromeExtension()) {
    try {
      // Save data to Chrome extension storage
      await chrome.storage.local.set({ [key]: data });
    } catch (error) {
      console.error("Error saving to extension storage", error);
    }
    return;
  }

  try {
    // Save data to local storage
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to local storage", error);
  }
};

// Function to load data from local storage or Chrome extension storage
export const loadData = async (key) => {
  if (!key) return null;

  if (isChromeExtension()) {
    try {
      // Load data from Chrome extension storage
      const data = await chrome.storage.local.get(key);
      return data?.[key] ?? null;
    } catch (error) {
      console.error("Error loading from extension storage", error);
      return null;
    }
  }

  try {
    // Load data from local storage
    const rawData = localStorage.getItem(key);
    if (rawData === null) return null;

    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error loading from local storage", error);
    return null;
  }
};
