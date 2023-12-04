import { IsInstance, IsInt, IsNotEmpty, IsString } from 'class-validator';

export type FileMediaInputConstructorProps = {
  raw_name: string;
  data: Buffer;
  mime_type: string;
  size: number;
};

export class FileMediaInput {
  @IsString()
  @IsNotEmpty()
  raw_name: string;

  @IsInstance(Buffer)
  @IsNotEmpty()
  data: Buffer;

  @IsString()
  @IsNotEmpty()
  mime_type: string;

  @IsInt()
  @IsNotEmpty()
  size: number;

  constructor(props: FileMediaInputConstructorProps) {
    if (!props) return;

    this.raw_name = props.raw_name;
    this.data = props.data;
    this.mime_type = props.mime_type;
    this.size = props.size;
  }
}
