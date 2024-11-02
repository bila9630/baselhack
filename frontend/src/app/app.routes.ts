import { Route } from "@angular/router";
import { ChatMainComponent } from "./chat-main/chat-main/chat-main.component";

export const routes: Route[] = [
  {
    path: "chat",
    component: ChatMainComponent,
  },
  {
    path: "**",
    redirectTo: "chat",
    pathMatch: "full",
  },
];
