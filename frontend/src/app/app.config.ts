import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { TextureService } from "./texture/texture.service";
import { routes } from "./app.routes";
import { provideRouter } from "@angular/router";

const initializeApp = (textureService: TextureService) => {
  return () =>
    textureService.loadAssets().then(() => console.log("Textures loaded"));
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
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
