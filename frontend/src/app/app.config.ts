import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { TextureService } from "./texture/texture.service";
import { routes } from "./app.routes";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";

const initializeApp = (textureService: TextureService) => {
  return () =>
    textureService.loadAssets().then(() => console.log("Textures loaded"));
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [TextureService],
      multi: true,
    },
  ],
};
