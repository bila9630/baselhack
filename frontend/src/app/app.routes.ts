import { Route } from "@angular/router";
import { ChatMainComponent } from "./chat-main/chat-main/chat-main.component";
import { GameComponent } from "./game/game.component";

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
    path: "**",
    redirectTo: "chat",
    pathMatch: "full",
  },
];
