import { Global, Module } from '@nestjs/common'
import { CustomLogger } from './custom.logger'

@Global()
@Module({
  providers: [
    {
      provide: CustomLogger,
      useFactory: () => {
        return new CustomLogger()
      },
    },
  ],
  exports: [CustomLogger],
})
export class LoggerModule {}
