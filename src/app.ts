import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Event from "openfl/events/Event";
import TimerEvent from "openfl/events/TimerEvent";
import Timer from "openfl/utils/Timer";
import MouseEvent from "openfl/events/MouseEvent";

class App extends Sprite {


	constructor () {

		super ();

		// this.graphics.beginFill(0x24AFC4);
		// this.graphics.drawRect(0, 0, 100, 100);

		// BitmapData.loadFromFile("openfl.png").onComplete((bitmapData) => {
		// 	var bitmap = new Bitmap(bitmapData);
		// 	bitmap.x = 10;
		// 	bitmap.y = 200;
		// 	bitmap.rotation = -10;
		// 	bitmap.alpha = 0.5;
		//
		// 	let direction = true;

			// this.addEventListener (Event.ENTER_FRAME, (e:Event) => {
			// 	if (direction) {
			// 			bitmap.x += 1;
			// 			if (bitmap.x >= 200) direction = !direction;
			// 	} else {
			// 			bitmap.x -= 1;
			// 			if (bitmap.x <= 0) direction = !direction;
			// 	}
			// });

			// let increment = -0.005;
			// let timer = new Timer (1000 / 60, 200);
			// timer.addEventListener (TimerEvent.TIMER, (e:TimerEvent) => {
			// 	bitmap.alpha += increment;
			// });
			// timer.addEventListener (TimerEvent.TIMER_COMPLETE, (e:TimerEvent) => {
			// 	increment *= -1;
			// 	timer.reset ();
			// 	timer.start ();
			// });
			// timer.start();
			//
			// this.addChild(bitmap);
		// });


		BitmapData.loadFromFile ("favicon.png").onComplete ((bitmapData) => {
			var bitmap = new Bitmap (bitmapData);
			bitmap.x = 100;
			bitmap.y = 100;

			var sprite = new Sprite ();
			sprite.addChild (bitmap);
			sprite.buttonMode = true;
			this.addChild (sprite);
			// sprite.addEventListener(MouseEvent.MOUSE_DOWN, (e:MouseEvent) => {
			// 	alert ("MOUSE DOWN");
			// });
			// sprite.addEventListener (MouseEvent.MOUSE_DOWN, (e:MouseEvent) => {
			// 	e.currentTarget.startDrag ();
			// });
			// sprite.addEventListener (MouseEvent.MOUSE_UP, (e:MouseEvent) => {
			// 	e.currentTarget.stopDrag ();
			// });

			let offsetX = 0;
			let offsetY = 0;
			let targetX = 0;
			let targetY = 0;
			let dragging = false;
			sprite.addEventListener (MouseEvent.MOUSE_DOWN, (e:MouseEvent) => {
				offsetX = sprite.x - e.stageX;
				offsetY = sprite.y - e.stageY;
				dragging = true;
			});

			this.stage.addEventListener (MouseEvent.MOUSE_UP, (e:MouseEvent) => {
				dragging = false;
			});

			this.stage.addEventListener (Event.ENTER_FRAME, (e:Event) => {
				if (dragging) {
					targetX = this.stage.mouseX + offsetX;
					targetY = this.stage.mouseY + offsetY;
				}

				let diffX = targetX - sprite.x;
				let diffY = targetY - sprite.y;

				if (Math.abs (diffX) < 1) {
					sprite.x = targetX;
				} else {
					sprite.x += (diffX * 0.2);
				}

				if (Math.abs (diffY) < 1) {
					sprite.y = targetY;
				} else {
					sprite.y += (diffY * 0.2);
				}

			});
		});

	}
}


var stage = new Stage (550, 400, 0xFFFFFF, App);
document.body.appendChild (stage.element);
