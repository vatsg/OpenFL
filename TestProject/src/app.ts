import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import Shape from "openfl/display/Shape";
import Point from "openfl/geom/Point";
import TextField from "openfl/text/TextField";
import TextFormat from "openfl/text/TextFormat";
import Event from "openfl/events/Event";
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
	private oldPts:Array<Point>;
	
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
	}
	
	private createForceDirectedGraph ():void {
		
		var simulation = d3.forceSimulation(graph_data.nodes)
			.force("charge", d3.forceManyBody())
			.force("link", d3.forceLink(graph_data.links))
			.force("center", d3.forceCenter(width / 2, height / 2))
			.stop();
	    // .on("tick", this.updateGraph.bind(this));
	
		// run simulation
		simulation.tick(simLength);
		
		// add links
		for (let i = 0; i < graph_data.links.length; i++) {
			var line = new Shape();
			line.graphics.lineStyle (1, 0x808080);
	
			var srcPt = new Point(graph_data.links[i].source.x, graph_data.links[i].source.y);
			var dstPt = new Point(graph_data.links[i].target.x, graph_data.links[i].target.y);
			this.oldPts.push(srcPt);
			this.oldPts.push(dstPt);
			
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
	
	// re-draw graph nodes on every tick
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
	// UPDATE: Doesn't work properly. The math seems to be correct, but the lines are not drawn
	// properly.	
	private lineTransformation ():void {
		// for (let i = 0; i < graph_data.links.length; i++) {
		// 	var line = this.links[i];
		// 	var oldSrc = this.oldPts[i*2];
		// 	var oldDst = this.oldPts[i*2 + 1];
		// 	var newSrc = new Point(graph_data.links[i].source.x, graph_data.links[i].source.y);
		// 	var newDst = new Point(graph_data.links[i].target.x, graph_data.links[i].target.y);
		// 
		// 	var s1 = (oldDst.y - oldSrc.y) / (oldDst.x - oldSrc.x); 
		// 	var s2 = (newDst.y - newSrc.y) / (newDst.x - newSrc.x); 
		// 	var a1 = Math.atan(s1);
		// 	var a2 = Math.atan(s2);
		// 	var rad = Math.atan((s1 - s2)/(1 + s1*s2));
		// 	var ang = rad*180/Math.PI;
		// 	if (oldSrc.x < newSrc.x) {
		// 		ang = 180-ang;
		// 		rad = ang * Math.PI / 180;
		// 	}
		// 	else {
		// 		ang = 180-ang;
		// 		rad = ang * Math.PI / 180;
		// 	}
		// 
		// 	// console.log(ang);
		// 
		// 	var p1 = ((oldDst.x - oldSrc.x) * Math.cos(rad)) - ((oldDst.y - oldSrc.y) * Math.sin(rad)) + oldSrc.x;
		// 	var p2 = ((oldDst.y - oldSrc.y) * Math.cos(rad)) + ((oldDst.x - oldSrc.x) * Math.sin(rad)) + oldSrc.y;
		// 	p1 = p1 + (newSrc.x - oldSrc.x);
		// 	p2 = p2 + (newSrc.y - oldSrc.y);
		// 
		// 	var scX = Math.abs((newDst.x - newSrc.x) / (p1 - newSrc.x))
		// 	var scY = Math.abs((newDst.y - newSrc.y) / (p2 - newSrc.y));
		// 	// console.log(scX, scY);
		// 
		// 	if (oldSrc.x < newSrc.x) {
		// 		line.rotation+=ang;
		// 		line.x = newSrc.x;
		// 		line.y = newSrc.y;
		// 
		// 		line.scaleX = scX;
		// 		line.scaleY = scY;
		// 	}
		// 	else {
		// 		// console.log("Here?");
		// 		line.rotation+=ang;
		// 		line.x = newSrc.x;
		// 		line.y = newSrc.y;
		// 
		// 		line.scaleX = scX;
		// 		line.scaleY = scY;
		// 	}
		// 
		// 	// line.rotation += 1;
		// 	// line.scaleX += 1;
		// 
		// 	// console.log(line);
		// 	// line.graphics.lineStyle (1, 0x808080);		
		// 	// line.graphics.moveTo(graph_data.links[i].source.x, graph_data.links[i].source.y);
		// 	// line.graphics.lineTo(graph_data.links[i].target.x, graph_data.links[i].target.y);
		// 
		// 	this.oldPts[i*2] = newSrc;
		// 	this.oldPts[i*2 + 1] = newDst;
		// 
		// }
	}
		
	// zoom
	
}


var stage = new Stage (width, height, 0xFFFFFF, App);
document.body.appendChild (stage.element);