import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatonStateService {
  changeState = new BehaviorSubject<"talk" | "listen">("listen");

  changeCurrentState(state: "talk" | "listen") {
    this.changeState.next(state);
  }
}
