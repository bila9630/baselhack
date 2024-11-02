import { Component, inject, OnInit } from "@angular/core";
import { ChatHistoryComponent } from "../../chat-history/chat-history.component";
import { ChatonBotComponent } from "../../chaton/chaton-bot/chaton-bot.component";
import { PromptInputComponent } from "../../prompt/prompt-input/prompt-input.component";
import { ChatGptService } from "../../chat-gpt/chat-gpt.service";
import {
  MatDrawerContainer,
  MatSidenavModule,
} from "@angular/material/sidenav";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";

@Component({
  selector: "app-chat-main",
  standalone: true,
  imports: [
    ChatHistoryComponent,
    ChatonBotComponent,
    PromptInputComponent,
    MatDrawerContainer,
    MatSidenavModule,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: "./chat-main.component.html",
  styleUrl: "./chat-main.component.scss",
})
export class ChatMainComponent implements OnInit {
  chatGpt = inject(ChatGptService);

  explanation: string = "";

  ngOnInit() {
    this.chatGpt.getTemporalId().subscribe((temporalId: string) => {
      console.log("Temporal ID: ", temporalId);
      this.chatGpt.temporalId = temporalId;
    });
  }
}
