import { Injectable } from "@angular/core";
import { PromtMessage } from "../interface/promt-message.interface";
import { BehaviorSubject } from "rxjs";
import { ulid } from "ulid";

@Injectable({
  providedIn: "root",
})
export class PromptService {
  private _prompts$ = new BehaviorSubject<PromtMessage[]>([
    {
      message:
        "Hi there! I’m Chaton, your purr-sonal insurance expert with a knack for making things simple. Whether you’re exploring new options or have questions about your policy, I’m here to help. Think of me as the friendly paw guiding you through the world of insurance. Let’s tackle those questions together and find the perfect fit for you!",
      author: "chaton",
      id: ulid(),
      explanation: [],
    },
    {
      message:
        "So, tell me—do you already have an idea of the kind of insurance you’re looking for? Or would you like me to help you" +
        " explore your options? I’m here to make sure you feel confident and comfortable with your choice. Just let me know how I can" +
        " help!",
      author: "chaton",
      id: "123",
      explanation: [],
    },
  ]);

  prompts$ = this._prompts$.asObservable();

  addNewPromptToChat(
    message: string,
    author: "user" | "chaton",
    explanation: string[],
  ) {
    const newPrompt: PromtMessage = {
      message,
      author,
      id: ulid(),
      explanation,
    };
    this._prompts$.next([...this._prompts$.value, newPrompt]);
    console.log(this._prompts$.value);
    return newPrompt.id;
  }
}
