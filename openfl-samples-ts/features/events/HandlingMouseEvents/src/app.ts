import Actuate from "motion/Actuate";
import Bitmap from "openfl/display/Bitmap";
import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import MouseEvent from "openfl/events/MouseEvent";
import AssetLibrary from "openfl/utils/AssetLibrary";
import AssetManifest from "openfl/utils/AssetManifest";
import Assets from "openfl/utils/Assets";


class App extends Sprite {
	
	
	private Logo:Sprite;
	private Logo2:Sprite;
	private Destination:Sprite;
	
	private cacheOffsetX:number;
	private cacheOffsetY:number;
	private selectedObject:Sprite;

	
	public constructor () {
		
		super ();
		
		this.Logo = new Sprite ();
		this.Logo.addChild (new Bitmap (Assets.getBitmapData ("assets/openfl.png")));
		this.Logo.x = 100;
		this.Logo.y = 100;
		this.Logo.buttonMode = true;

		this.Logo2 = new Sprite ();
		this.Logo2.addChild (new Bitmap (Assets.getBitmapData ("assets/openfl.png")));
		this.Logo2.x = 100;
		this.Logo2.y = 500;
		this.Logo2.buttonMode = true;

		
		this.Destination = new Sprite ();
		this.Destination.graphics.beginFill (0xF5F5F5);
		this.Destination.graphics.lineStyle (1, 0xCCCCCC);
		this.Destination.graphics.drawRect (0, 0, this.Logo.width + 10, this.Logo.height + 10);
		this.Destination.x = 800;
		this.Destination.y = 300;
		
		this.addChild (this.Destination);
		this.addChild (this.Logo);
		this.addChild (this.Logo2);
		
		this.Logo.addEventListener (MouseEvent.MOUSE_DOWN, this.Logo_onMouseDown);
		this.Logo2.addEventListener (MouseEvent.MOUSE_DOWN, this.Logo_onMouseDown);
		this.stage.addEventListener (MouseEvent.MOUSE_WHEEL, this.Stage_onMouseWheel);
		
	}
	
	
	
	
	// Event Handlers
	
	private Stage_onMouseWheel = (event:MouseEvent):void => {
		for (let i = 0; i < this.numChildren; i++) {
			if (event.delta > 0) {
				this.getChildAt(i).scaleX += 0.25;
				this.getChildAt(i).scaleY += 0.25;
			}
			else {
				this.getChildAt(i).scaleX -= 0.25;
				this.getChildAt(i).scaleY -= 0.25;				
			}
		}
	}
	
	
	private Logo_onMouseDown = (event:MouseEvent):void => {
		this.selectedObject = event.target;

		this.cacheOffsetX = this.selectedObject.x - event.stageX;
		this.cacheOffsetY = this.selectedObject.y - event.stageY;
		
		this.stage.addEventListener (MouseEvent.MOUSE_MOVE, this.stage_onMouseMove);
		this.stage.addEventListener (MouseEvent.MOUSE_UP, this.stage_onMouseUp);
		
	}
	
	
	private stage_onMouseMove = (event:MouseEvent):void => {
		
		this.selectedObject.x = event.stageX + this.cacheOffsetX;
		this.selectedObject.y = event.stageY + this.cacheOffsetY;
		
	}
	
	
	private stage_onMouseUp = (event:MouseEvent):void => {
		
		if (this.Destination.hitTestPoint (event.stageX, event.stageY)) {
			
			Actuate.tween (event.target, 1, { x: this.Destination.x + 5, y: this.Destination.y + 5 } );
		}
		
		this.stage.removeEventListener (MouseEvent.MOUSE_MOVE, this.stage_onMouseMove);
		this.stage.removeEventListener (MouseEvent.MOUSE_UP, this.stage_onMouseUp);
		
	}
	
	
}


var manifest = new AssetManifest ();
manifest.addBitmapData ("assets/openfl.png");

AssetLibrary.loadFromManifest (manifest).onComplete ((library) => {
	
	Assets.registerLibrary ("default", library);
	
	var stage = new Stage (1000, 1000, 0xFFFFFF, App);
	document.body.appendChild (stage.element);
	
}).onError ((e) => {
	
	console.error (e);
	
});