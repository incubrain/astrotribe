// templates/entity/base.model.ejs
export interface BaseModel {
  id: string | number;
  created_at?: Date;
  updated_at?: Date;

  deleted_at?: Date;
}
