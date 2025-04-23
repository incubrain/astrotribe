export const schema = {
  Contents: [
    {
      name: 'id',
      data_type: 'VarChar',
      is_primary_key: true,
      max_length: 36,
    },
    {
      name: 'content_vector',
      data_type: 'FloatVector',
      dim: 768,
    },
    {
      name: 'content_type',
      data_type: 'VarChar',
      max_length: 20,
      is_partition_key: true,
    },
    {
      name: 'summary',
      nullable: true,
      data_type: 'VarChar',
      max_length: 2000,
    },
    {
      name: 'published_at',
      data_type: 'Int64',
    },
    {
      name: 'hot_score',
      nullable: true,
      data_type: 'Double',
    },
    {
      name: 'url',
      data_type: 'VarChar',
      max_length: 1024,
    },
    {
      name: 'title',
      data_type: 'VarChar',
      max_length: 500,
    },
    {
      name: 'author',
      data_type: 'VarChar',
      nullable: true,
      max_length: 200,
    },
  ],
}
