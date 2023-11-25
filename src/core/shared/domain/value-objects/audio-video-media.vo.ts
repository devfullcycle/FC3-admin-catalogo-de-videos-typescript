import { ValueObject } from '../value-object';

export enum AudioVideoMediaStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export abstract class AudioVideoMedia extends ValueObject {
  readonly name: string;
  readonly raw_location: string; //mp4
  readonly encoded_location: string | null;
  readonly status: AudioVideoMediaStatus;

  constructor({
    name,
    raw_location,
    encoded_location,
    status,
  }: {
    name: string;
    raw_location: string;
    encoded_location?: string | null;
    status: AudioVideoMediaStatus;
  }) {
    super();
    this.name = name;
    this.raw_location = raw_location;
    this.encoded_location = encoded_location ?? null;
    this.status = status;
  }

  get raw_url(): string {
    return `${this.raw_location}/${this.name}`;
  }

  toJSON() {
    return {
      name: this.name,
      raw_location: this.raw_location,
      encoded_location: this.encoded_location,
      status: this.status,
    };
  }
}
