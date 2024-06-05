import { Module } from '@nestjs/common';
import { HttpService } from '@infrastructure/common/http-client/axios/http.service';

@Module({
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
