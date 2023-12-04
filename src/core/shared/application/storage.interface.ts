export interface IStorage {
  store(object: {
    data: Buffer;
    mime_type?: string;
    id: string;
  }): Promise<void>;

  get(id: string): Promise<{ data: Buffer; mime_type: string | undefined }>;
}
