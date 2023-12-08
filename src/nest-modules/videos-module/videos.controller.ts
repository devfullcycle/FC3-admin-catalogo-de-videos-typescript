import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  ParseUUIDPipe,
  UploadedFiles,
  ValidationPipe,
} from '@nestjs/common';
import { CreateVideoUseCase } from '../../core/video/application/create-video/create-video.use-case';
import { UpdateVideoUseCase } from '../../core/video/application/update-video/update-video.use-case';
import { UploadAudioVideoMediasUseCase } from '../../core/video/application/upload-audio-video-medias/upload-audio-video-medias.use-case';
import { GetVideoUseCase } from '../../core/video/application/get-video/get-video.use-case';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { UpdateVideoInput } from '../../core/video/application/update-video/update-video.input';

@Controller('videos')
export class VideosController {
  @Inject(CreateVideoUseCase)
  private createUseCase: CreateVideoUseCase;

  @Inject(UpdateVideoUseCase)
  private updateUseCase: UpdateVideoUseCase;

  @Inject(UploadAudioVideoMediasUseCase)
  private uploadAudioVideoMedia: UploadAudioVideoMediasUseCase;

  @Inject(GetVideoUseCase)
  private getUseCase: GetVideoUseCase;

  @Post()
  async create(@Body() createVideoDto: CreateVideoDto) {
    const { id } = await this.createUseCase.execute(createVideoDto);
    //VideoPresenter
    return await this.getUseCase.execute({ id });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    //VideoPresenter
    return await this.getUseCase.execute({ id });
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateVideoDto: any,
  ) {
    const hasData = Object.keys(updateVideoDto).length > 0;

    if (hasData) {
      const data = await new ValidationPipe({
        errorHttpStatusCode: 422,
      }).transform(updateVideoDto, {
        metatype: UpdateVideoDto,
        type: 'body',
      });
      const input = new UpdateVideoInput({ id, ...data });
      const { id: newId } = await this.updateUseCase.execute(input);
      return await this.getUseCase.execute({ id: newId });
    }
  }

  @Patch(':id/upload')
  uploadFile(
    @Body()
    data,
  ) {}
}
