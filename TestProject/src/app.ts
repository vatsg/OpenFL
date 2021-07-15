import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import Shape from "openfl/display/Shape";
import Point from "openfl/geom/Point";
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
	
	private circArr:Array<Shape>;
	private nodes:Array<Shape>; 
	private links:Array<Shape>;
	private oldPts:Array<Point>;
	
	constructor () {
		
		super ();
		this.circArr = [];
		this.nodes = [];
		this.links = [];
		this.oldPts = [];
		
		// this.createInitCircles();	
		this.createForceDirectedGraph();
	}
	
	private createForceDirectedGraph ():void {
		
		var simulation = d3.forceSimulation(graph_data.nodes)
			.force("charge", d3.forceManyBody())
			.force("link", d3.forceLink(graph_data.links))
			.force("center", d3.forceCenter(width / 2, height / 2));
	    // .on("tick", this.tick.bind(this));
	
		for (let i = 0; i < simLength; i++) {
			simulation.tick();
		}
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
			circle.graphics.drawCircle(graph_data.nodes[i].x, graph_data.nodes[i].y, nodeRadius);
	
			this.addChild(circle);
			this.nodes.push(circle);							
		}
			
			// var newSrc = new Point(600,600);
			// var newDst = new Point(1000,700);
			// var oldSrc = new Point(1000,400);
			// var oldDst = new Point(100,900);
			// 
			// var l1 = new Shape();
			// l1.graphics.lineStyle (5, 0x000000);
			// // l1.graphics.moveTo(100,0);
			// l1.x=oldSrc.x;
			// l1.y=oldSrc.y;
			// l1.graphics.lineTo(l1.globalToLocal(oldDst).x, l1.globalToLocal(oldDst).y);
			// this.addChild(l1);
			// 
			// var l2 = new Shape();
			// l2.graphics.lineStyle (5, 0x808080);
			// // l2.graphics.moveTo(100,0);
			// l2.x=newSrc.x;
			// l2.y=newSrc.y;
			// l2.graphics.lineTo(l2.globalToLocal(newDst).x, l2.globalToLocal(newDst).y);
			// this.addChild(l2);
			// 
			// var s1 = (oldDst.y - oldSrc.y) / (oldDst.x - oldSrc.x); 
			// var s2 = (newDst.y - newSrc.y) / (newDst.x - newSrc.x); 
			// var a1 = Math.atan(s1);
			// var a2 = Math.atan(s2);
			// var rad = Math.atan((s1 - s2)/(1 + s1*s2));
			// var ang = rad*180/Math.PI;
			// if (oldSrc.x < newSrc.x) {
			// 	ang = 180-ang;
			// 	rad = ang * Math.PI / 180;
			// }
			// else {
			// 	ang = 180-ang;
			// 	rad = ang * Math.PI / 180;
			// }
			// 
			// console.log(ang);
			// 
			// var p1 = ((oldDst.x - oldSrc.x) * Math.cos(rad)) - ((oldDst.y - oldSrc.y) * Math.sin(rad)) + oldSrc.x;
			// var p2 = ((oldDst.y - oldSrc.y) * Math.cos(rad)) + ((oldDst.x - oldSrc.x) * Math.sin(rad)) + oldSrc.y;
			// p1 = p1 + (newSrc.x - oldSrc.x);
			// p2 = p2 + (newSrc.y - oldSrc.y);
			// 
			// var scX = Math.abs((newDst.x - newSrc.x) / (p1 - newSrc.x))
			// var scY = Math.abs((newDst.y - newSrc.y) / (p2 - newSrc.y));
			// console.log(scX, scY);
			// 
			// if (oldSrc.x < newSrc.x) {
			// 	l1.rotation+=ang;
			// 	l1.x = newSrc.x;
			// 	l1.y = newSrc.y;
			// 
			// 	l1.scaleX = scX;
			// 	l1.scaleY = scY;
			// }
			// else {
			// 	console.log("Here?");
			// 	l1.rotation+=ang;
			// 	l1.x = newSrc.x;
			// 	l1.y = newSrc.y;
			// 
			// 	l1.scaleX = scX;
			// 	l1.scaleY = scY;
			// }
			// // this.removeChild(l2);
			// 
			// // line.rotation = 360;
			// var circle = new Shape ();
			// circle.graphics.beginFill(0x24AFC4);
			// circle.graphics.drawCircle(p1,p2,20);
			// this.addChild(circle);
			// this.links.push(line);

		// 
		// 	simulation.tick();
		// }
	}
	
	// re-draw graph nodes on every tick
	private tick ():void {
		for (let i = 0; i < graph_data.links.length; i++) {
			var line = this.links[i];
			this.removeChild(line);
		}
		this.links = [];
		for (let i = 0; i < graph_data.links.length; i++) {
			var line = new Shape();
			line.graphics.lineStyle (1, 0x808080);
	
			var srcPt = new Point(graph_data.links[i].source.x, graph_data.links[i].source.y);
			var dstPt = new Point(graph_data.links[i].target.x, graph_data.links[i].target.y);
			
			line.graphics.moveTo(graph_data.links[i].source.x, graph_data.links[i].source.y);
			line.graphics.lineTo(graph_data.links[i].target.x, graph_data.links[i].target.y);
	
			this.addChild(line);
			this.links.push(line);
		}
		
		
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
	
		// add nodes
		for (let i = 0; i < graph_data.nodes.length; i++) {
			var circle = this.nodes[i];
			circle.x = graph_data.nodes[i].x;
			circle.y = graph_data.nodes[i].y;
		}
	}
	
	// create circles to add to stage
	private createInitCircles ():void {
				
		for (let i = 0; i < 10; i++) {
			var circle = new Sprite ();

			circle.graphics.beginFill (0x24AFC4);
			circle.graphics.drawCircle (50 + i*150, 50, 50);
			circle.x = 0;
			circle.y = 0;

			this.circArr.push(circle);
			this.addChild (circle);			
		}
	}	
}


var stage = new Stage (width, height, 0xFFFFFF, App);
document.body.appendChild (stage.element);