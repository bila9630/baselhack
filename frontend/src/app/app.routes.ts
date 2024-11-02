import { Route } from "@angular/router";
import { ChatMainComponent } from "./chat-main/chat-main/chat-main.component";
import { GameComponent } from "./game/game.component";
import { SpeechAiComponent } from "./speech-ai/speech-ai.component";

export const routes: Route[] = [
  {
    path: "chat",
    component: ChatMainComponent,
  },
  {
    path: "game",
    component: GameComponent,
  },
  {
    path: "speech",
    component: SpeechAiComponent,
  },
  {
    path: "**",
    redirectTo: "chat",
    pathMatch: "full",
  },
];
