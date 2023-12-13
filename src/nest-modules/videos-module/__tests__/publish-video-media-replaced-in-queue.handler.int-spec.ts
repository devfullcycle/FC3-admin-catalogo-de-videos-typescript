import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../../database-module/database.module';
import { VideosModule } from '../videos.module';
import { UnitOfWorkSequelize } from '../../../core/shared/infra/db/sequelize/unit-of-work-sequelize';
import { ConfigModule } from '../../config-module/config.module';
import { SharedModule } from '../../shared-module/shared.module';
import { EventModule } from '../../event-module/event.module';
import { VideoAudioMediaUploadedIntegrationEvent } from '../../../core/video/domain/domain-events/video-audio-media-replaced.event';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { UseCaseModule } from '../../use-case-module/use-case.module';
import { RabbitmqModule } from '../../rabbitmq-module/rabbitmq.module';
import { VIDEOS_PROVIDERS } from '../videos.providers';
import { IVideoRepository } from '../../../core/video/domain/video.repository';
import { Video } from '../../../core/video/domain/video.aggregate';
import { Category } from '../../../core/category/domain/category.aggregate';
import { Genre } from '../../../core/genre/domain/genre.aggregate';
import { CastMember } from '../../../core/cast-member/domain/cast-member.aggregate';
import { ICategoryRepository } from '../../../core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from '../../categories-module/categories.providers';
import { IGenreRepository } from '../../../core/genre/domain/genre.repository';
import { GENRES_PROVIDERS } from '../../genres-module/genres.providers';
import { ICastMemberRepository } from '../../../core/cast-member/domain/cast-member.repository';
import { CAST_MEMBERS_PROVIDERS } from '../../cast-members-module/cast-members.providers';
import { UploadAudioVideoMediasUseCase } from '../../../core/video/application/use-cases/upload-audio-video-medias/upload-audio-video-medias.use-case';
import { getConnectionToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { EVENTS_MESSAGE_BROKER_CONFIG } from '../../../core/shared/infra/message-broker/events-message-broker-config';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ConsumeMessage } from 'amqplib';
import { AuthModule } from '../../auth-module/auth.module';

describe('PublishVideoMediaReplacedInQueueHandler Integration Tests', () => {
  let module: TestingModule;
  let channelWrapper: ChannelWrapper;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        SharedModule,
        DatabaseModule,
        EventModule,
        UseCaseModule,
        RabbitmqModule.forRoot(),
        AuthModule,
        VideosModule,
      ],
    })
      .overrideProvider('UnitOfWork')
      .useFactory({
        factory: (sequelize: Sequelize) => {
          return new UnitOfWorkSequelize(sequelize);
        },
        inject: [getConnectionToken()],
      })
      .compile();
    await module.init();

    const amqpConn = module.get<AmqpConnection>(AmqpConnection);
    channelWrapper = amqpConn.managedConnection.createChannel();
    await channelWrapper.addSetup((channel) => {
      return Promise.all([
        channel.assertQueue('test-queue-video-upload', {
          durable: false,
        }),
        channel.bindQueue(
          'test-queue-video-upload',
          EVENTS_MESSAGE_BROKER_CONFIG[
            VideoAudioMediaUploadedIntegrationEvent.name
          ].exchange,
          EVENTS_MESSAGE_BROKER_CONFIG[
            VideoAudioMediaUploadedIntegrationEvent.name
          ].routing_key,
        ),
      ]).then(() => channel.purgeQueue('test-queue-video-upload'));
    });
  });

  afterEach(async () => {
    await channelWrapper.close();
    await module.close();
  });

  it('should publish video media replaced event in queue', async () => {
    const category = Category.fake().aCategory().build();
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(category.category_id)
      .build();
    const castMember = CastMember.fake().aDirector().build();
    const video = Video.fake()
      .aVideoWithoutMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .addCastMemberId(castMember.cast_member_id)
      .build();

    const categoryRepo: ICategoryRepository = module.get(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );
    await categoryRepo.insert(category);

    const genreRepo: IGenreRepository = module.get(
      GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
    );
    await genreRepo.insert(genre);

    const castMemberRepo: ICastMemberRepository = module.get(
      CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
    );
    await castMemberRepo.insert(castMember);

    const videoRepo: IVideoRepository = module.get(
      VIDEOS_PROVIDERS.REPOSITORIES.VIDEO_REPOSITORY.provide,
    );
    await videoRepo.insert(video);

    const useCase: UploadAudioVideoMediasUseCase = module.get(
      VIDEOS_PROVIDERS.USE_CASES.UPLOAD_AUDIO_VIDEO_MEDIA_USE_CASE.provide,
    );

    await useCase.execute({
      video_id: video.video_id.id,
      field: 'video',
      file: {
        data: Buffer.from('data'),
        mime_type: 'video/mp4',
        raw_name: 'video.mp4',
        size: 100,
      },
    });

    const msg: ConsumeMessage = await new Promise((resolve) => {
      channelWrapper.consume('test-queue-video-upload', (msg) => {
        resolve(msg);
      });
    });

    const msgObj = JSON.parse(msg.content.toString());
    const updatedVideo = await videoRepo.findById(video.video_id);
    expect(msgObj).toEqual({
      resource_id: `${video.video_id.id}.video`,
      file_path: updatedVideo?.video?.raw_url,
    });
  });
});
