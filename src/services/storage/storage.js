import AsyncStorage from "@react-native-async-storage/async-storage";

class DeviceStorage {
  constructor(prefix) {
    prefix = prefix || "@storage_" + new Date().getTime();
    this._prefix = prefix;

    this._storedKeys = [];
  }

  _getValidatedKey(key) {
    if (!key) {
      throw new Error("valid key required");
    }

    return this._prefix + "_" + key;
  }

  async get(key) {
    key = this._getValidatedKey(key);

    let value = await AsyncStorage.getItem(key);

    try {
      value = JSON.parse(value);
      return value;
    } catch (error) {
      return value;
    }
  }

  async store(key, value) {
    key = this._getValidatedKey(key);

    if (typeof value === "object") {
      value = JSON.stringify(value);
    }

    await AsyncStorage.setItem(key, value);

    this._storedKeys.push(key);
  }

  async clearAll() {
    if (this._storedKeys.length) {
      await AsyncStorage.multiRemove(this._storedKeys);
    }

    this._storedKeys = [];
  }
}

export default DeviceStorage;
