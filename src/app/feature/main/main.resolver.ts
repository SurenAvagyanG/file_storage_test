import { Query, Resolver } from '@nestjs/graphql';
import { MainService } from '@feature/main/main.service';
@Resolver()
export class MainResolver {
  constructor(private readonly appService: MainService) {}

  @Query(() => String)
  getHealthMessage(): string {
    return this.appService.getHealthMessage();
  }

  @Query(() => String)
  getVersionMessage(): string {
    return this.appService.getVersion();
  }
}
