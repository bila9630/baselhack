import { Route } from "@angular/router";
import { ChatMainComponent } from "./chat-main/chat-main/chat-main.component";
import { GameComponent } from "./game/game.component";
import { TestComponent } from "./test/test.component";

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
    path: "test",
    component: TestComponent,
  },
  {
    path: "**",
    redirectTo: "chat",
    pathMatch: "full",
  },
];
