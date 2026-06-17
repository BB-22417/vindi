import {
  IsDateString, IsOptional, IsNumber, IsBoolean, IsString, Min, Max, IsEnum
} from 'class-validator';
import { SymptomSeverity } from '@prisma/client';

export class CreateDailyLogDto {
  @IsDateString()
  date!: string;

  @IsOptional()
  @IsNumber()
  sleepHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  sleepQuality?: number;

  @IsOptional()
  @IsNumber()
  nightAwakenings?: number;

  @IsOptional()
  @IsBoolean()
  nightSweats?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  moodScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  anxietyScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  stressScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  irritabilityScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  energyLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  brainFog?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  focusLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  memoryIssues?: number;

  @IsOptional()
  @IsEnum(SymptomSeverity)
  hotFlashes?: SymptomSeverity;

  @IsOptional()
  @IsEnum(SymptomSeverity)
  jointPain?: SymptomSeverity;

  @IsOptional()
  @IsEnum(SymptomSeverity)
  headaches?: SymptomSeverity;

  @IsOptional()
  @IsEnum(SymptomSeverity)
  heartPalpitations?: SymptomSeverity;

  @IsOptional()
  @IsEnum(SymptomSeverity)
  breastTenderness?: SymptomSeverity;

  @IsOptional()
  @IsEnum(SymptomSeverity)
  bloating?: SymptomSeverity;

  @IsOptional()
  @IsEnum(SymptomSeverity)
  lowLibido?: SymptomSeverity;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  bloodPressureSystolic?: number;

  @IsOptional()
  @IsNumber()
  bloodPressureDiastolic?: number;

  @IsOptional()
  @IsNumber()
  bodyTemperature?: number;

  @IsOptional()
  @IsBoolean()
  exercise?: boolean;

  @IsOptional()
  @IsNumber()
  alcoholIntake?: number;

  @IsOptional()
  @IsNumber()
  waterIntake?: number;

  @IsOptional()
  @IsNumber()
  caffeineIntake?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  nutritionScore?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
