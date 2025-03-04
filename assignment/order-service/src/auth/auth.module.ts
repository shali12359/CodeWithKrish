import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStratergy } from './jwt.strategy';

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    providers: [JwtStratergy],
    exports: [PassportModule]
})
export class AuthModule {}
