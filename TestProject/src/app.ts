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
var simLength = 1;

class App extends Sprite {
	
	private circArr:Array<Shape>;
	private nodePts:Array<Point>; 
	
	constructor () {
		
		super ();
		this.circArr = [];
		this.nodePts = [];
		
		// this.createInitCircles();	
		this.createForceDirectedGraph();
	}
	
	private createForceDirectedGraph ():void {
		
		var simulation = d3.forceSimulation(graph_data.nodes)
			.force("charge", d3.forceManyBody())
			.force("link", d3.forceLink(graph_data.links))
			.force("center", d3.forceCenter(width / 2, height / 2));
	
	
	  var color = d3.scaleOrdinal(d3.schemeCategory10);
		for (let i = 0; i < 100; i++) {
			simulation.tick(); // this will center graph on screen
		}
		for (let n = 0; n < simLength; n++) {

			// add links
			for (let i = 0; i < graph_data.links.length; i++) {
				var line = new Shape();
				line.graphics.lineStyle (1, 0x808080);
				
				line.graphics.moveTo(graph_data.links[i].source.x, graph_data.links[i].source.y);
				line.graphics.lineTo(graph_data.links[i].target.x, graph_data.links[i].target.y);
				
				this.addChild(line);
			}
			
			// add nodes
			for (let i = 0; i < graph_data.nodes.length; i++) {
				var pt = new Point(graph_data.nodes[i].x, graph_data.nodes[i].y);
				var circle = new Shape ();

				circle.graphics.beginFill(color(graph_data.nodes[i].group).replace("#", "0x"));
				circle.graphics.drawCircle(pt.x, pt.y, nodeRadius);

				this.addChild(circle);							
			}
			
			simulation.tick();
		}
	}
	
	// re-draw graph nodes on every tick
	// private tick ():void {
	// 	for (let i = 0; i < nodePts.length; i++) {
	// 		var circle = new Sprite ();
	// 
	// 		circle.graphics.beginFill (0x24AFC4);
	// 		circle.graphics.drawCircle (nodePts[i].x, nodePts[i].y, 10);
	// 
	// 		this.addChild(circle);						
	// 	}
	// }
	
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