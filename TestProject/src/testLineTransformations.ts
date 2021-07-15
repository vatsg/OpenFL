// Testing line transformations

// This is just a file to store code used for experimenting with
// line transformations

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
// else { // need to fix this
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

// private createInitCircles ():void {
//   for (let i = 0; i < 10; i++) {
//     var circle = new Sprite ();
// 
//     circle.graphics.beginFill (0x24AFC4);
//     circle.graphics.drawCircle (50 + i*150, 50, 50);
//     circle.x = 0;
//     circle.y = 0;
// 
//     this.circArr.push(circle);
//     this.addChild (circle);			
//   }
// }	
// 
