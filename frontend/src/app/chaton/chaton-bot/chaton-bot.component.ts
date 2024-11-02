import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  NgZone,
  ViewChild,
} from "@angular/core";
import { Application, Sprite, Texture } from "pixi.js";
import { TextureService } from "../../texture/texture.service";

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

  textureService = inject(TextureService);

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(async (): Promise<void> => {
      await this.application.init({
        background: this.backgroundColor,
        width: 500,
        height: 500,
      });
      this.container.nativeElement.appendChild(this.application.canvas);

      const texture: Texture = this.textureService.getTexture(
        "chatonIdle",
      ) as Texture;

      let sprite: Sprite = new Sprite(texture);

      sprite.scale = 0.3;

      this.application.stage.addChild(sprite);
    });
  }
}
