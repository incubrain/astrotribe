export class News {
  constructor(
    public id: number,
    public title: string,
    public body: string | null,
    public category: Category,
    public tags: Tag[],
    public author: string | null,
    public source: string,
    public publishedAt: Date | null,
    public createdAt: Date,
    public updatedAt: Date | null,
    public description: string | null,
    public featuredImage: string | null,
    public hasSummary: boolean,
    public url: string
  ) {}
}

export class Category {
  constructor(
    public id: number,
    public title: string,
    public body: string | null,
    public createdAt: Date
  ) {}
}

export class Tag {
  constructor(
    public id: number,
    public title: string,
    public body: string | null,
    public createdAt: Date
  ) {}
}
