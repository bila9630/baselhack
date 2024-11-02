import { Injectable } from "@angular/core";
import { Assets, Texture, TexturePool } from "pixi.js";

@Injectable({
  providedIn: "root",
})
export class TextureService {
  private textures: Map<string, Texture> = new Map<string, Texture>([]);

  private chatonAssets: { [key: string]: string } = {
    chatonIdle: "chaton_bot/chaton_closed_mouth_smol.svg",
  };

  async loadAssets(): Promise<void> {
    // TexturePool.textureOptions.scaleMode = "nearest";
    // TexturePool.textureOptions.minFilter = "nearest";
    // TexturePool.textureOptions.magFilter = "nearest";
    const assets: { [key: string]: string } = {
      ...this.chatonAssets,
    };

    for (const [name, path] of Object.entries(assets)) {
      const newTexture: Texture = await Assets.load(path);
      this.textures.set(name, newTexture);
    }

    Assets.addBundle("chatonTalking", {
      chatonTalking1: "chaton_bot/chaton_talking_0.png",
      chatonTalking2: "chaton_bot/chaton_talking_1.png",
      chatonTalking3: "chaton_bot/chaton_talking_2.png",
      chatonTalking4: "chaton_bot/chaton_talking_3.png",
    });

    const chatonTalkingBundle = await Assets.loadBundle("chatonTalking");
    console.log(chatonTalkingBundle);
  }

  getTexture(name: string): Texture {
    return this.textures.has(name)
      ? (this.textures.get(name) as Texture)
      : (this.textures.get("missingTexture") as Texture);
  }
}
