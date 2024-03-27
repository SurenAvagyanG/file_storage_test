import { IStorage } from './storage.interface';

export class StorageFactory {
  static readonly storageDrivers = new Map<string, IStorage>();

  static getStorage(driver: string): IStorage {
    const storage = StorageFactory.storageDrivers.get(driver);
    if (!storage) {
      throw new Error('storage driver is not defined');
    }
    return storage;
  }

  static addStorageDriver(name: string, driver: IStorage): void {
    StorageFactory.storageDrivers.set(name, driver);
  }
}
