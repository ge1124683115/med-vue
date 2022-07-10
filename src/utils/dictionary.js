const DictionaryKey = 'DICT'

function setStorageDictionary(dictionary) {
  return localStorage.setItem(DictionaryKey, typeof dictionary === 'string' ? dictionary : JSON.stringify(dictionary))
}

function getStorageDictionary() {
  const str = localStorage.getItem(DictionaryKey);
  try {
    return JSON.parse(str);
  } catch (e) {
    return str
  }
}


export {
  DictionaryKey,
  setStorageDictionary,
  getStorageDictionary,
}
