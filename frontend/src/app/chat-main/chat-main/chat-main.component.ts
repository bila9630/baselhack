import { Component } from "@angular/core";
import { ChatHistoryComponent } from "../../chat-history/chat-history.component";
import { ChatonBotComponent } from "../../chaton/chaton-bot/chaton-bot.component";
import { PromptInputComponent } from "../../prompt/prompt-input/prompt-input.component";

@Component({
  selector: "app-chat-main",
  standalone: true,
  imports: [ChatHistoryComponent, ChatonBotComponent, PromptInputComponent],
  templateUrl: "./chat-main.component.html",
  styleUrl: "./chat-main.component.scss",
})
export class ChatMainComponent {}
