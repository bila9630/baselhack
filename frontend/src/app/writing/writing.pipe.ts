import { inject, Pipe, PipeTransform } from "@angular/core";
import { interval, Observable, of, switchMap, takeWhile } from "rxjs";
import { ChatonStateService } from "../chaton/chaton-state/chaton-state.service";

@Pipe({
  name: "writing",
  standalone: true,
})
export class WritingPipe implements PipeTransform {
  emissions = 0;

  chatonStateService = inject(ChatonStateService);

  transform(value: string, ...args: unknown[]): Observable<string> {
    const [isLastValue] = args;
    this.chatonStateService.changeCurrentState("talk");
    if (isLastValue) {
      return interval(100).pipe(
        takeWhile(() => this.emissions < value.split(" ").length, true),
        switchMap(() => {
          this.emissions++;
          if (this.emissions === value.split(" ").length) {
            this.chatonStateService.changeCurrentState("listen");
          }
          return of(value.split(" ").slice(0, this.emissions).join(" "));
        }),
      );
    }
    return of(value);
  }
}
