import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import {
  AnimatedSprite,
  Application,
  Assets,
  Container,
  Sprite,
  Texture,
} from "pixi.js";
import { TextureService } from "../../texture/texture.service";
import { ChatonStateService } from "../chaton-state/chaton-state.service";

@Component({
  selector: "app-chaton-bot",
  standalone: true,
  imports: [],
  templateUrl: "./chaton-bot.component.html",
  styleUrl: "./chaton-bot.component.scss",
})
export class ChatonBotComponent implements AfterViewInit {
  @ViewChild("container") protected container!: ElementRef;

  @ViewChild("talk") talk!: ElementRef;

  application = new Application();

  protected backgroundColor: string = "#2bea31";

  protected ngZone: NgZone = inject(NgZone);

  textureService = inject(TextureService);

  chatonStateService = inject(ChatonStateService);

  chaton: Container | null = null;

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(async (): Promise<void> => {
      await this.application.init({
        backgroundAlpha: 0,
        width: 150,
        height: 150,
        antialias: true,
      });
      this.container.nativeElement.appendChild(this.application.canvas);
      this.switchChatonToIdleState();

      this.chatonStateService.changeState.subscribe((state) => {
        if (state === "talk") {
          this.switchChatonToTalkingState();
        } else {
          this.switchChatonToIdleState();
        }
      });
    });
  }

  switchChatonToIdleState() {
    (this.chaton as AnimatedSprite)?.stop();
    this.application.stage?.removeChild(this.chaton as Container);
    const texture: Texture = this.textureService.getTexture(
      "chatonIdle",
    ) as Texture;

    let sprite: Sprite = new Sprite(texture);
    sprite.label = "chaton";

    this.application.stage.addChild(sprite);
    this.chaton = this.application.stage.getChildByName("chaton");
  }

  switchChatonToTalkingState() {
    this.application.stage?.removeChild(this.chaton as Container);
    const animatedSprite: AnimatedSprite = new AnimatedSprite(
      this.textureService.chatonAnimation,
    );
    animatedSprite.label = "chaton";
    animatedSprite.animationSpeed = 0.75;
    this.application.stage.addChild(animatedSprite);
    this.chaton = this.application.stage.getChildByName("chaton");
    (this.chaton as AnimatedSprite).play();
  }
}
