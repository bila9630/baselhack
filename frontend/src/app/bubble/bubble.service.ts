import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ulid } from "ulid";
import { BubbleMessage } from "./interface/bubble-message.interface";

@Injectable({
  providedIn: "root",
})
export class BubbleService {
  _bubble$ = new BehaviorSubject<BubbleMessage[]>([
    {
      question: "test123",
      referencePromptId: "123",
      id: ulid(),
    },
  ]);
  bubble$ = this._bubble$.asObservable();

  addNewBubble(question: string, referencePromptId: string) {
    const newBubble: BubbleMessage = {
      question,
      referencePromptId,
      id: ulid(),
    };
    this._bubble$.next([...this._bubble$.value, newBubble]);
  }
}
