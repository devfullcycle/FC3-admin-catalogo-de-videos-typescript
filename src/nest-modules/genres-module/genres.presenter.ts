import { Transform, Type } from 'class-transformer';

import { CollectionPresenter } from '../shared-module/collection.presenter';
import { ListGenresOutput } from '../../core/genre/application/use-cases/list-genres/list-genres.use-case';
import {
  GenreCategoryOutput,
  GenreOutput,
} from '../../core/genre/application/use-cases/common/genre-output';

export class GenreCategoryPresenter {
  id: string;
  name: string;
  @Transform(({ value }: { value: Date }) => {
    return value.toISOString();
  })
  created_at: Date;

  constructor(output: GenreCategoryOutput) {
    this.id = output.id;
    this.name = output.name;
    this.created_at = output.created_at;
  }
}

export class GenrePresenter {
  id: string;
  name: string;
  categories_id: string[];
  @Type(() => GenreCategoryPresenter)
  categories: GenreCategoryPresenter[];
  is_active: boolean;
  @Transform(({ value }: { value: Date }) => {
    return value.toISOString();
  })
  created_at: Date;

  constructor(output: GenreOutput) {
    this.id = output.id;
    this.name = output.name;
    this.categories_id = output.categories_id;
    this.categories = output.categories.map((item) => {
      return new GenreCategoryPresenter(item);
    });
    this.is_active = output.is_active;
    this.created_at = output.created_at;
  }
}

export class GenreCollectionPresenter extends CollectionPresenter {
  @Type(() => GenrePresenter)
  data: GenrePresenter[];

  constructor(output: ListGenresOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new GenrePresenter(item));
  }
}
