import { ConfigService } from '@nestjs/config';
export declare const HEALTH_MESSAGE = "OK";
export declare class AppService {
    private readonly version;
    constructor(configService: ConfigService);
    getHealthMessage(): string;
    getVersion(): string;
}
