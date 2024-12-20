import { Global, Module } from '@nestjs/common'
import { CustomLogger } from '../logger/custom.logger'

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
