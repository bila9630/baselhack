import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { TextureService } from "./texture/texture.service";

const initializeApp = (assetsService: TextureService) => {
  return () =>
    assetsService.loadAssets().then(() => console.log("Textures loaded"));
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [TextureService],
      multi: true,
    },
  ],
};
