import { Component, inject } from "@angular/core";
import { MatInput } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { PromptService } from "../service/prompt.service";

@Component({
  selector: "app-prompt-input",
  standalone: true,
  imports: [MatInput, FormsModule],
  templateUrl: "./prompt-input.component.html",
  styleUrl: "./prompt-input.component.scss",
})
export class PromptInputComponent {
  userInput: string = "";

  promptService = inject(PromptService);

  addPrompt() {
    this.promptService.addNewPromptToChat(this.userInput, "user");
    this.userInput = "";
  }
}
