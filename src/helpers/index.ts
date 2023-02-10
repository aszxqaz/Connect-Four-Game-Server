import { ConfigService } from "@nestjs/config";

export const getClientUrl = (configService: ConfigService) => {
  const clientUrl =
    configService.get('NODE_ENV') === 'production'
      ? configService.get('CLIENT_URL_PROD')
      : configService.get('CLIENT_URL_DEV');

    return clientUrl
};
