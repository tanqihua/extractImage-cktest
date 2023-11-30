import Phaser from "phaser";

export class Bootstrap extends Phaser.Scene {
  constructor() {
    super("bootstrap");
  }

  init() {}

  preload() {
    this.load.video(
      "squart",
      "/video/billboard_bg.mp4",
      "loadeddata",
      false,
      true
    );

    this.load.image("broad", "/2d/test.png");

    for (let i = 1; i < 501; i++) {
      let num = i.toString().padStart(5, "0");
      this.load.image(`test${i}`, `/2d/scenesprite_sheet_webp/${num}.webp`);
    }
  }

  create() {
    this.w = this.sys.game.config.width;
    this.h = this.sys.game.config.height;
    // this.video = this.add.video(this.w / 2, this.h / 2, "squart");
    // this.video.scale = this.h / 336;
    // this.video.play(true);

    this.broad = this.add.sprite(
      this.w / 2,
      this.h / 2 - this.h * 0.075,
      "broad"
    );
    this.broad.setDisplaySize((this.h * 0.5 * 1920) / 1080, this.h * 0.5);

    this.broad.setAlpha(0.9);

    // create animation
    this.anims.create({
      key: "landingvideo",
      frames: ArrayFrame(0, 501, false),
      frameRate: 30,
      repeat: -1,
    });

    this._bg_broad = this.add.sprite(this.w / 2, this.h / 2, "test1");
    this._bg_broad.setDisplaySize((this.h * 1920) / 1080, this.h);
    // z index
    this._bg_broad.setDepth(-1);

    this._bg_broad.play("landingvideo");
  }
}

function ArrayFrame(start, end, reverse) {
  if (reverse) {
    let arr = [];
    for (let i = start; i >= end; i--) {
      arr.push({ key: "test" + i });
    }
    return arr;
  } else {
    let arr = [];
    for (let i = start; i <= end; i++) {
      arr.push({ key: "test" + i });
    }
    return arr;
  }
}
