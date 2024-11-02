import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { PromptInputComponent } from "./prompt/prompt-input/prompt-input.component";
import { ChatHistoryComponent } from "./chat-history/chat-history.component";
import { ChatonBotComponent } from "./chaton/chaton-bot/chaton-bot.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    PromptInputComponent,
    ChatHistoryComponent,
    ChatonBotComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "Chaton";
}
