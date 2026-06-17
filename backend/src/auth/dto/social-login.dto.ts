import { IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  idToken!: string;
}

export class AppleLoginDto {
  @IsString()
  identityToken!: string;

  @IsString()
  email?: string;

  @IsString()
  name?: string;
}
