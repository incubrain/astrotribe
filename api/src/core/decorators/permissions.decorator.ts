// decorators/permission.decorator.ts
import { SetMetadata } from "@nestjs/common";
import { DatabaseAction } from "../../types/permissions.types";

export const Table = (table: string) => SetMetadata("table", table);
export const Action = (action: DatabaseAction) => SetMetadata("action", action);
