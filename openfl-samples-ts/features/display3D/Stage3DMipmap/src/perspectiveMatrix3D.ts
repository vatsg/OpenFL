/*
Copyright (c) 2011, Adobe Systems Incorporated
All rights reserved.
Redistribution and use in source and binary forms, with or without 
modification, are permitted provided that the following conditions are
met:
* Redistributions of source code must retain the above copyright notice, 
this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the 
documentation and/or other materials provided with the distribution.
* Neither the name of Adobe Systems Incorporated nor the names of its 
contributors may be used to endorse or promote products derived from 
this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR 
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


import Matrix3D from "openfl/geom/Matrix3D";
import Vector3D from "openfl/geom/Vector3D";
import Vector from "openfl/Vector";


class PerspectiveMatrix3D extends Matrix3D {
	
	
	private _x = new Vector3D ();
	private _y = new Vector3D ();
	private _z = new Vector3D ();
	private _w = new Vector3D ();
	
	
	constructor (v:Vector<number> = null) {
		
		super (v);
		
	}
	
	
	public lookAtLH (eye:Vector3D, at:Vector3D, up:Vector3D):void {
		
		this._z.copyFrom (at);
		this._z.subtract (eye);
		this._z.normalize ();
		this._z.w = 0.0;
		
		this._x.copyFrom (up);
		this._crossProductTo (this._x, this._z);
		this._x.normalize ();
		this._x.w = 0.0;
		
		this._y.copyFrom (this._z);
		this._crossProductTo (this._y, this._x);
		this._y.w = 0.0;
		
		this._w.x = this._x.dotProduct (eye);
		this._w.y = this._y.dotProduct (eye);
		this._w.z = this._z.dotProduct (eye);
		this._w.w = 1.0;
		
		this.copyRowFrom (0, this._x);
		this.copyRowFrom (1, this._y);
		this.copyRowFrom (2, this._z);
		this.copyRowFrom (3, this._w);
		
	}
	
	
	public lookAtRH (eye:Vector3D, at:Vector3D, up:Vector3D):void {
		
		this._z.copyFrom (eye);
		this._z.subtract (at);
		this._z.normalize ();
		this._z.w = 0.0;
		
		this._x.copyFrom (up);
		this._crossProductTo (this._x, this._z);
		this._x.normalize ();
		this._x.w = 0.0;
		
		this._y.copyFrom (this._z);
		this._crossProductTo (this._y, this._x);
		this._y.w = 0.0;
		
		this._w.x = this._x.dotProduct (eye);
		this._w.y = this._y.dotProduct (eye);
		this._w.z = this._z.dotProduct (eye);
		this._w.w = 1.0;
		
		this.copyRowFrom (0, this._x);
		this.copyRowFrom (1, this._y);
		this.copyRowFrom (2, this._z);
		this.copyRowFrom (3, this._w);
		
	}
	
	
	public orthoLH (width:number, height:number, zNear:number, zFar:number):void {
		
		this.copyRawDataFrom (Vector.ofArray ([
			2.0 / width, 0.0, 0.0, 0.0,
			0.0, 2.0 / height, 0.0, 0.0,
			0.0, 0.0, 1.0 / (zFar - zNear), 0.0,
			0.0, 0.0, zNear / (zNear - zFar), 1.0
		]));
		
	}
	
	
	public orthoOffCenterLH (left:number, right:number, bottom:number, top:number, zNear:number, zFar:number):void {
		
		this.copyRawDataFrom (Vector.ofArray ([
			2.0 / (right - left), 0.0, 0.0, 0.0,
			0.0, 2.0 * zNear / (top - bottom), 0.0, 0.0,
			-1.0 - 2.0 * left / (right - left), 1.0 + 2.0 * top / (bottom - top), 1.0 / (zFar - zNear), 0.0,
			0.0, 0.0, zNear / (zNear - zFar), 1.0
		]));
		
	}

	public orthoOffCenterRH (left:number, right:number, bottom:number, top:number, zNear:number, zFar:number):void {
		
		this.copyRawDataFrom (Vector.ofArray ([
			2.0 / (right - left), 0.0, 0.0, 0.0,
			0.0, 2.0 * zNear / (top - bottom), 0.0, 0.0,
			-1.0 - 2.0 * left / (right - left), 1.0 + 2.0 * top / (bottom - top), 1.0 / (zNear - zFar), 0.0,
			0.0, 0.0, zNear / (zNear - zFar), 1.0
		]));
		
	}
	
	
	public orthoRH (width:number, height:number, zNear:number, zFar:number):void {
		
		this.copyRawDataFrom (Vector.ofArray ([
			2.0 / width, 0.0, 0.0, 0.0,
			0.0, 2.0 / height, 0.0, 0.0,
			0.0, 0.0, 1.0 / (zNear - zNear), 0.0,
			0.0, 0.0, zNear / (zNear - zFar), 1.0
		]));
		
	}
	
	
	public perspectiveFieldOfViewLH (fieldOfViewY:number, aspectRatio:number, zNear:number, zFar:number):void {
		
		var yScale = 1.0 / Math.tan (fieldOfViewY / 2.0);
		var xScale = yScale / aspectRatio;
		
		this.copyRawDataFrom (Vector.ofArray ([
			xScale, 0.0, 0.0, 0.0,
			0.0, yScale, 0.0, 0.0,
			0.0, 0.0, zFar / (zFar - zNear), 1.0,
			0.0, 0.0, (zNear * zFar) / (zNear - zFar), 0.0
		]));
		
	}
	
	
	public perspectiveFieldOfViewRH (fieldOfViewY:number, aspectRatio:number, zNear:number, zFar:number):void {
		
		var yScale = 1.0 / Math.tan (fieldOfViewY / 2.0);
		var xScale = yScale / aspectRatio;
		
		this.copyRawDataFrom (Vector.ofArray ([
			xScale, 0.0, 0.0, 0.0,
			0.0, yScale, 0.0, 0.0,
			0.0, 0.0, zFar / (zNear - zFar), -1.0,
			0.0, 0.0, (zNear * zFar) / (zNear - zFar), 0.0
		]));
		
	}
	
	
	public perspectiveOffCenterLH (left:number, right:number, bottom:number, top:number, zNear:number, zFar:number):void {
		
		this.copyRawDataFrom (Vector.ofArray ([
			2.0 * zNear / (right - left), 0.0, 0.0, 0.0,
			0.0, -2.0 * zNear / (bottom - top), 0.0, 0.0,
			-1.0 - 2.0 * left / (right - left), 1.0 + 2.0 * top / (bottom - top), -zFar / (zNear - zFar), 1.0,
			0.0, 0.0, (zNear * zFar) / (zNear - zFar), 0.0
		]));
		
	}
	
	
	public perspectiveLH (width:number, height:number, zNear:number, zFar:number):void {
		
		this.copyRawDataFrom (Vector.ofArray ([
			2.0 * zNear / width, 0.0, 0.0, 0.0,
			0.0, 2.0 * zNear / height, 0.0, 0.0,
			0.0, 0.0, zFar / (zFar - zNear), 1.0,
			0.0, 0.0, zNear * zFar / (zNear - zFar), 0.0
		]));
		
	}
	
	
	public perspectiveOffCenterRH (left:number, right:number, bottom:number, top:number, zNear:number, zFar:number):void {
		
		this.copyRawDataFrom (Vector.ofArray ([
			2.0 * zNear / (right - left), 0.0, 0.0, 0.0,
			0.0, -2.0 * zNear / (bottom - top), 0.0, 0.0,
			1.0 + 2.0 * left / (right - left), -1.0 - 2.0 * top / (bottom - top), zFar / (zNear - zFar), -1.0,
			0.0, 0.0, (zNear * zFar) / (zNear - zFar), 0.0
		]));
		
	}
	
	
	public perspectiveRH (width:number, height:number, zNear:number, zFar:number):void {
		
		this.copyRawDataFrom (Vector.ofArray ([
			2.0 * zNear / width, 0.0, 0.0, 0.0,
			0.0, 2.0 * zNear / height, 0.0, 0.0,
			0.0, 0.0, zFar / (zNear - zFar), -1.0,
			0.0, 0.0, zNear * zFar / (zNear - zFar), 0.0
		]));
		
	}
	
	
	private _crossProductTo (a:Vector3D, b:Vector3D):void {
		
		this._w.x = a.y * b.z - a.z * b.y;
		this._w.y = a.z * b.x - a.x * b.z;
		this._w.z = a.x * b.y - a.y * b.x;
		this._w.w = 1.0;
		a.copyFrom (this._w);
		
	}
	
	
}


export default PerspectiveMatrix3D;