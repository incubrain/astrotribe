export interface BaseDTO {
  toEntity(): Record<string, any>;
}

export interface ValidationError {
  property: string;
  constraints: Record<string, string>;
}

export type ValidationResult<T> = {
  isValid: boolean;
  data?: T;
  errors?: ValidationError[];
};
