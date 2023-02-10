import { IsString } from "class-validator";
import { MaxLength, MinLength } from "class-validator/types/decorator/decorators";

export class AuthDto {
    @IsString()
    @MinLength(2)
    @MaxLength(10)
    username: string
}