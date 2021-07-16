import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import Shape from "openfl/display/Shape";
import Point from "openfl/geom/Point";
import TextField from "openfl/text/TextField";
import TextFormat from "openfl/text/TextFormat";
import Event from "openfl/events/Event";
import KeyboardEvent from "openfl/events/KeyboardEvent";
import Keyboard from "openfl/ui/Keyboard";
// import * as d3 from 'd3-force';
import * as d3 from 'd3';
import { graph_data } from "./graphData";

console.log(graph_data);

var width = 2000;
var height = 1000;
var nodeRadius = 10;
var simLength = 100;

var color = d3.scaleOrdinal(d3.schemeCategory10);

class App extends Sprite {
	
	private nodes:Array<Shape>; 
	private links:Array<Shape>;
	private oldPts:Array<Point>; // use to store previous endpoints of links
	
	constructor () {
		
		super ();
		this.nodes = [];
		this.links = [];
		this.oldPts = [];
		
		this.createForceDirectedGraph();
		
		// add title
		var title = new TextField();
		title.text = "Test Graph";
		title.setTextFormat(new TextFormat("Arial",45));
		title.x = width/2-60;
		title.y = 25;
		title.width = 500;
		this.addChild(title);
		
		this.stage.addEventListener (KeyboardEvent.KEY_DOWN, this.onKeyDown.bind(this));
	}
	
	private createForceDirectedGraph ():void {
		
		var simulation = d3.forceSimulation(graph_data.nodes)
			.force("charge", d3.forceManyBody())
			.force("link", d3.forceLink(graph_data.links))
			.force("center", d3.forceCenter(width / 2, height / 2))
			// .stop();
	    .on("tick", this.updateGraph.bind(this));
	
		// run simulation manually
		// simulation.tick(simLength);
		
		// add links
		for (let i = 0; i < graph_data.links.length; i++) {
			var line = new Shape();
			line.graphics.lineStyle (1, 0x808080);
	
			// Store the link endpoints -- to be used if attempting to transform links instead of re-drawing them
			// var srcPt = new Point(graph_data.links[i].source.x, graph_data.links[i].source.y);
			// var dstPt = new Point(graph_data.links[i].target.x, graph_data.links[i].target.y);
			// this.oldPts.push(srcPt);
			// this.oldPts.push(dstPt);
			
			line.graphics.moveTo(graph_data.links[i].source.x, graph_data.links[i].source.y);
			line.graphics.lineTo(graph_data.links[i].target.x, graph_data.links[i].target.y);
	
			this.addChild(line);
			this.links.push(line);
		}
	
		// add nodes
		for (let i = 0; i < graph_data.nodes.length; i++) {
			var circle = new Shape ();
	
			circle.graphics.beginFill(color(graph_data.nodes[i].group).replace("#", "0x"));
			circle.x = graph_data.nodes[i].x;
			circle.y = graph_data.nodes[i].y;
			circle.graphics.drawCircle(0, 0, nodeRadius);
	
			this.addChild(circle);
			this.nodes.push(circle);							
		}
		
		// this.addEventListener (Event.ENTER_FRAME, this.updateGraph.bind(this));	// alternative to using d3 tick function
	}
	
	// update the positions of the graph nodes and edges on every tick
	// NOTE: The animation runs slowly. 
	private updateGraph ():void {
	
		// update links -- slows down application
		for (let i = 0; i < graph_data.links.length; i++) {
			var line = this.links[i];
			line.graphics.clear();
			
			line.graphics.lineStyle (1, 0x808080);
			line.graphics.moveTo(graph_data.links[i].source.x, graph_data.links[i].source.y);
			line.graphics.lineTo(graph_data.links[i].target.x, graph_data.links[i].target.y);
		}
		
		// update nodes
		for (let i = 0; i < graph_data.nodes.length; i++) {
			var circle = this.nodes[i];
			circle.x = graph_data.nodes[i].x;
			circle.y = graph_data.nodes[i].y;
		}
	}

	// Attempt to speed up animation by transforming lines instead of re-drawing them
	// NOTE: Doesn't work properly. Need to fix.
	private lineTransformation ():void {
		for (let i = 0; i < graph_data.links.length; i++) {
			var line = this.links[i];
			var oldSrc = this.oldPts[i*2];
			var oldDst = this.oldPts[i*2 + 1];
			var newSrc = new Point(graph_data.links[i].source.x, graph_data.links[i].source.y);
			var newDst = new Point(graph_data.links[i].target.x, graph_data.links[i].target.y);

			// calculate angle to rotate the old line by to be parallel to new line
			var s1 = (oldDst.y - oldSrc.y) / (oldDst.x - oldSrc.x); 
			var s2 = (newDst.y - newSrc.y) / (newDst.x - newSrc.x); 
			var a1 = Math.atan(s1);
			var a2 = Math.atan(s2);
			var rad = Math.atan((s1 - s2)/(1 + s1*s2));
			var ang = rad*180/Math.PI;
			ang = 180-ang;
			rad = ang * Math.PI / 180;
		
			// find endpoint of the rotated line
			var p1 = ((oldDst.x - oldSrc.x) * Math.cos(rad)) - ((oldDst.y - oldSrc.y) * Math.sin(rad)) + oldSrc.x;
			var p2 = ((oldDst.y - oldSrc.y) * Math.cos(rad)) + ((oldDst.x - oldSrc.x) * Math.sin(rad)) + oldSrc.y;
			p1 = p1 + (newSrc.x - oldSrc.x);
			p2 = p2 + (newSrc.y - oldSrc.y);
		
			// get scaling factor for rotated line
			var scX = Math.abs((newDst.x - newSrc.x) / (p1 - newSrc.x))
			var scY = Math.abs((newDst.y - newSrc.y) / (p2 - newSrc.y));
			// console.log(scX, scY);
		
			// rotate and scale line to match new endpoints
			line.rotation+=ang;
			line.x = newSrc.x;
			line.y = newSrc.y;
	
			line.scaleX = scX;
			line.scaleY = scY;
						
			// update stored line endpoints
			this.oldPts[i*2] = newSrc;
			this.oldPts[i*2 + 1] = newDst;
		}
	}
		
	// scale the nodes of the graph 
	// increase scale by pressing the equal key
	// decrease scale by pressing the minus key
	private onKeyDown (event:KeyboardEvent):void {
			var scaleChange = 0.1;
			
			if (event.keyCode == Keyboard.EQUAL) { // equal key used to increase scale
				
				// increase node sizes
				for (let i = 0; i < graph_data.nodes.length; i++) {
					var circle = this.nodes[i];
					circle.scaleX += scaleChange;
					circle.scaleY += scaleChange;
				}				
			}
			else if (event.keyCode == Keyboard.MINUS) { // minus key used to decrease scale
				
				// decrease node sizes
				for (let i = 0; i < graph_data.nodes.length; i++) {
					var circle = this.nodes[i];
					circle.scaleX -= scaleChange;
					circle.scaleY -= scaleChange;
				}				
			}
	}	
}


var stage = new Stage (width, height, 0xFFFFFF, App);
document.body.appendChild (stage.element);