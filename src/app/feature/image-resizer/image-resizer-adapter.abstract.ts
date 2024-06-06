export abstract class ImageResizerAdapter {
  abstract resize(buffer: Buffer, size: number): Promise<Buffer>;
}
