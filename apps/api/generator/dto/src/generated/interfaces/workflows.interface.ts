import { BaseEntity } from '@core/base/entity';
import { Iworkflow_jobs } from './workflow_jobs.interface';


/**
 * 
 */
export interface Iworkflows extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  name: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  status: any;
  /**
   * 
   */
  metadata?: Record<string, any>;
  /**
   * 
   * @validation @IsDate
   */
  started_at?: Date;
  /**
   * 
   * @validation @IsDate
   */
  completed_at?: Date;
  /**
   * 
   * @validation @IsDate
   */
  created_at?: Date;
  /**
   * 
   * @validation @IsDate
   */
  updated_at?: Date;
  /**
   * 
   * @validation @IsNotEmpty
   */
  workflow_jobs: any;
}

export interface IworkflowsWithworkflow_jobs
extends Iworkflows
{
workflow_jobs:
Iworkflow_jobs; }

export type Partialworkflows = Partial<Iworkflows>;
export type Requiredworkflows = Required<Iworkflows>;