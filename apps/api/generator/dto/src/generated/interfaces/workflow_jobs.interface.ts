import { BaseEntity } from '@core/base/entity';
import { Iworkflows } from './workflows.interface';


/**
 * 
 */
export interface Iworkflow_jobs extends BaseEntity {
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  workflow_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  job_id: string;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  job_name: string;
  /**
   * 
   * @validation @IsNotEmpty
   */
  status: any;
  /**
   * 
   * @validation @IsNotEmpty, @IsNumber([object Object])
   */
  sequence_number: number;
  /**
   * 
   * @validation @IsNotEmpty, @IsString
   */
  depends_on: string;
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
  workflows: any;
}

export interface Iworkflow_jobsWithworkflows
extends Iworkflow_jobs
{
workflows:
Iworkflows; }

export type Partialworkflow_jobs = Partial<Iworkflow_jobs>;
export type Requiredworkflow_jobs = Required<Iworkflow_jobs>;