import { Injectable } from "@angular/core";
import { Assets, Texture } from "pixi.js";

@Injectable({
  providedIn: "root",
})
export class TextureService {
  private textures: Map<string, Texture> = new Map<string, Texture>([]);
  //
  // private chatonAssets: { [key: string]: string } = {
  //   chatonIdle: "public/chaton_bot/chaton_closed_mouth.png",
  // };

  // ...this.chatonAssets,
  async loadAssets(): Promise<void> {
    const assets: { [key: string]: string } = {};

    for (const [name, path] of Object.entries(assets)) {
      const newTexture: Texture = await Assets.load(path);
      this.textures.set(name, newTexture);
    }
  }
}
