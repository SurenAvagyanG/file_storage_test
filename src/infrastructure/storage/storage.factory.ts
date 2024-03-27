import { IStorage } from './storage.interface';

export class StorageFactory {
  static readonly storageDrivers = new Map<string, IStorage>();

  static getStorage(driver: string): IStorage {
    return StorageFactory.storageDrivers.get(driver);
  }

  static addStorageDriver(name: string, driver: IStorage): void {
    StorageFactory.storageDrivers.set(name, driver);
  }
}
