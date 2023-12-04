import { IStorage } from '../../application/storage.interface';

export class InMemoryStorage implements IStorage {
  private storage: Map<string, { data: Buffer; mime_type?: string }> =
    new Map();

  async store(object: {
    data: Buffer;
    mime_type?: string | undefined;
    id: string;
  }): Promise<void> {
    this.storage.set(object.id, {
      data: object.data,
      mime_type: object.mime_type,
    });
  }

  async get(
    id: string,
  ): Promise<{ data: Buffer; mime_type: string | undefined }> {
    const file = this.storage.get(id);
    if (!file) {
      throw new Error(`File ${id} not found`);
    }

    return { data: file.data, mime_type: file.mime_type };
  }
}
