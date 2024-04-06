export class User {
  constructor(
    public id: string,
    public given_name: string | null,
    public surname: string | null,
    public username: string | null,
    public email: string,
    public dob: string | null | undefined,
    public avatar: string | null,
    public cover_image: string | null,
    public introduction: string | null,
    public quote: string | null,
    public role: Role,
    public last_seen: string | null | undefined
  ) {}
}

export class Role {
  constructor(
    public id: number,
    public name: string,
    public body: string | null,
    public created_at: string | null | undefined
  ) {}
}
