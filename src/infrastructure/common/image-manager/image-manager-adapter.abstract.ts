export abstract class ImageManagerAdapter {
  abstract resize(buffer: Buffer, size: number): Promise<Buffer>;
}
