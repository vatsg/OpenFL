import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import Event from "openfl/events/Event";
import Lib from "openfl/Lib";


class App extends Sprite {


	private cacheTime:number;
	private speed:number;
	private sprite:Sprite;
	private circSprite:Sprite;
	private rectSprite:Sprite;
	private ellipseSprite:Sprite;

	public constructor () {

		super ();

		this.sprite = new Sprite ();
		this.sprite.graphics.beginFill (0x24AFC4);
		this.sprite.graphics.drawRect (0, 0, 100, 100);
		this.sprite.y = 50;
		this.addChild (this.sprite);

		// add circle object
		this.circSprite = new Sprite ();
		this.circSprite.graphics.beginFill (0xff0000);
		this.circSprite.graphics.drawCircle (50, 0, 55);
		this.circSprite.y = 50;
		this.circSprite.x = 50;
		this.addChild (this.circSprite);

		// add rounded rectangle object
		this.rectSprite = new Sprite ();
		this.rectSprite.graphics.beginFill (0x00FF00);
		this.rectSprite.graphics.drawRoundRect (50, 0, 160, 100, 50);
		this.rectSprite.y = 450;
		this.rectSprite.x = 10;
		this.rectSprite.rotation=-30;
		this.addChild(this.rectSprite);

		// add ellipse object
		this.ellipseSprite = new Sprite ();
		this.ellipseSprite.graphics.beginFill (0x800080);
		this.ellipseSprite.graphics.drawEllipse (50, 0, 50, 100);
		this.ellipseSprite.y = 450;
		this.ellipseSprite.x = 400;
		this.ellipseSprite.rotation=-45;
		this.addChild(this.ellipseSprite);

		this.speed = 0.3;
		this.cacheTime = Lib.getTimer ();

		this.addEventListener (Event.ENTER_FRAME, this.this_onEnterFrame);
	}


	private update (deltaTime:number):void {

		if (this.sprite.x + this.sprite.width >= this.stage.stageWidth || this.sprite.x < 0) {
			this.speed *= -1;
		}

		this.sprite.x += this.speed * deltaTime;
		this.circSprite.y += this.speed * deltaTime;
		this.rectSprite.x += this.speed * deltaTime;
		this.rectSprite.y -= this.speed * deltaTime;
		this.ellipseSprite.x -= this.speed * deltaTime;
		this.ellipseSprite.y -= this.speed * deltaTime;
	}




	// Event Handlers




	private this_onEnterFrame = (event:Event):void => {

		var currentTime = Lib.getTimer ();
		this.update (currentTime - this.cacheTime);
		this.cacheTime = currentTime;

	}


}


var stage = new Stage (550, 550, 0xFFFFFF, App);
document.body.appendChild (stage.element);
