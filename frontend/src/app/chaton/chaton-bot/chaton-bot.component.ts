import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  NgZone,
  ViewChild,
} from "@angular/core";
import { Application } from "pixi.js";

@Component({
  selector: "app-chaton-bot",
  standalone: true,
  imports: [],
  templateUrl: "./chaton-bot.component.html",
  styleUrl: "./chaton-bot.component.scss",
})
export class ChatonBotComponent implements AfterViewInit {
  @ViewChild("container") protected container!: ElementRef;

  application = new Application();

  protected backgroundColor: string = "#2bea31";

  protected ngZone: NgZone = inject(NgZone);

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(async (): Promise<void> => {
      await this.application.init({
        background: this.backgroundColor,
        width: 100,
        height: 100,
      });
      this.container.nativeElement.appendChild(this.application.canvas);
    });
  }
}
