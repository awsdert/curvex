function isFlt( val, def )
{
	val = Number.parseFloat(val);
	if ( !(Number.isFinite(val)) )
		return isFlt( def, 0 );
	return val;
}

function isInt( val, def )
{
	val = Number.parseInt(val);
	if ( !(Number.isInteger(val)) )
		return isInt( def, 0 );
	return val;
}

function createPositionsBuffer( gl, positions ) {

	// Create a buffer for the square's positions.
	const buff = gl.createBuffer();

	// Select the positionBuffer as the one to apply buffer
	// operations to from here out.
	gl.bindBuffer( gl.ARRAY_BUFFER, buff );

	// Now pass the list of positions into WebGL to build the
	// shape. We do this by creating a Float32Array from the
	// JavaScript array, then use it to fill the current buffer.
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array( positions ),
		gl.STATIC_DRAW
	);

	return buff;
}

function newPointXY( x, y )
{
	return { x : x, y : y };
}

function buildSolidTriangle( points, a, b, c )
{
	points.push( a.x, a.y, b.x, b.y, c.x, c.y );
	return points;
}

function cxDraw( box, gl, app, vxaPoints, sides, width, height )
{
	var ret = { border: 0, area: 0, html: "" };
	var points = [];
	gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.useProgram( app );
	gl.enableVertexAttribArray( vxaPoints );
	var pxWidth = box.clientWidth, pxHeight = box.clientHeight, mine = 0;
	var radius = width / 2
		, stop = sides / 4
		, middle = stop / 2
		, curve = 2
		, div = 1 / stop
		, frac = div / stop
		, square1 = (width < height) ? width * width : height * height
		, square2 = (width > height) ? width * width : height * height
		, addmore = 1
		, border_len = 0
		, one = Math.sqrt(square2 * 2)
		, two = Math.sqrt(square1 + (square2 * 2));
	
	stop -= 2;
	console.log( "stop: " + stop + "; div: " + div + "; frac: " + frac );
	for ( var i = 0, x = 0, y = width; i < stop; ++i )
	{
		var X = x - 0.25, Xp = (X + div), Xm = (X - div);
		var Y = y - 2, Yp = (Y + div), Ym = (Y - div);
		
		console.log( "X = " + X + "; Y = " + Y );
		points = buildSolidTriangle
		(
			points
			, newPointXY( Xm, Ym )
			, newPointXY( X, Y )
			, newPointXY( Xp, Ym )
		);
		points = buildSolidTriangle
		(
			points
			, newPointXY( -Xm, Ym )
			, newPointXY( -X, Y )
			, newPointXY( -Xp, Ym )
		);
		points = buildSolidTriangle
		(
			points
			, newPointXY( Xm, -Ym )
			, newPointXY( X, -Y )
			, newPointXY( Xp, -Ym )
		);
		points = buildSolidTriangle
		(
			points
			, newPointXY( -Xm, -Ym )
			, newPointXY( -X, -Y )
			, newPointXY( -Xp, -Ym )
		);
		x += frac + ((frac * curve) * (i == curve));
		y -= frac + ((frac * (stop - curve)) * (i == curve));
		curve += 2 * (i == curve);
		mine += (one * (i != curve)) + (two * (i == curve));
	}
	
	stop += 2;
	//var mine = stop / (((one / (stop / 2.5)) + 5));
	
	border_len = (mine / stop) * 2.6;
	pi = border_len / 2;
	
	ret.area = border_len / 2;
	ret.border = border_len;
	
	const vxPoints = createPositionsBuffer( gl, points );
	
	gl.bindBuffer( gl.ARRAY_BUFFER, vxPoints );
	
	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	var size = 2;          // 2 components per iteration
	var type = gl.FLOAT;   // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0;        // start at the beginning of the buffer
	gl.vertexAttribPointer
	(
		vxaPoints
		, size
		, type
		, normalize
		, stride
		, offset
	);
	
	var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = points.length / 2;
    gl.drawArrays( primitiveType, offset, count );
	return ret;
}

function piDraw( box, gl, app, vxaPoints, sides, width, height )
{
	var ret = { border: 0, area: 0, html: "" };
	var hradius = width / 2, vradius = height / 2;
	ret.border = (2 * Math.PI) * hradius;
	ret.area = Math.PI * hradius;
	return ret;
}

function openWebGL( nBox )
{
	var gl = nBox.getContext("webgl");
	gl = gl ? gl : nBox.getContext("2d");
	if ( !gl )
	{
		alert("Couldn't open WebGL!");
		return null;
	}
	return gl;
}

function newShader(gl, type, code) {
	const shader = gl.createShader( type );

	// Send the source to the shader object
	gl.shaderSource( shader, code );

	// Compile the shader program
	gl.compileShader( shader );
	
	// See if it compiled successfully
	if (!gl.getShaderParameter( shader, gl.COMPILE_STATUS) )
	{
		alert
		(
			'An error occurred compiling the shaders: '
			+ gl.getShaderInfoLog( shader )
		);
		gl.deleteShader( shader );
		return null;
	}

	return shader;
}

function newApp( gl, vsCode, fsCode )
{
	// Initialize a shader program, so WebGL knows how to draw our data
	const vs = newShader( gl, gl.VERTEX_SHADER, vsCode );
	const fs = newShader( gl, gl.FRAGMENT_SHADER, fsCode );
	
	const ctx = gl.createProgram();
	gl.attachShader( ctx, vs );
	gl.attachShader( ctx, fs );
	gl.linkProgram( ctx );
	
	if ( !gl.getProgramParameter( ctx, gl.LINK_STATUS ) ) {
		alert(
			'Unable to initialize the ctx program: '
			+ gl.getProgramInfoLog( ctx )
		);
		return null;
	}
	
	return ctx;
}

var _cxGL = null, _piGL = null;

const _vsCode = `
	// an attribute will receive data from a buffer
  attribute vec4 aPoints;

  // all shaders have a main function
  void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = aPoints;
  }`;
	
const _fsCode = `
	// fragment shaders don't have a default precision so we need
	// to pick one. mediump is a good default. It means "medium precision"
	precision mediump float;

	void main()
	{
		// gl_FragColor is a special variable a fragment shader
		// is responsible for setting
		gl_FragColor = vec4(1, 0, 0.5, 1); // return reddish-purple
	}`;

function main(form)
{
	var nSides = form.nSides, nWidth = form.nWidth, nHeight = form.nHeight;
	var sides = isInt( nSides.value, 64 );
	var width = isFlt( nWidth.value, 2 );
	var height = isFlt( nHeight.value, 2 );
	
	for ( i = sides / 4; Math.floor(i) < i; ++sides, i = sides / 4 );
	width += (width <= 0);
	height += (height <= 0);
	nSides.value = sides;
	nWidth.value = width;
	nHeight.value = height;
	
	var nhRadius = form.nhRadius, nvRadius = form.nvRadius;
	var hradius = width / 2, vradius = height / 2;
	nhRadius.value = hradius;
	nvRadius.value = vradius;
	
	var cxBox = form.cxBox.lastElementChild.firstElementChild;
	var piBox = form.piBox.lastElementChild.firstElementChild;
	
	var cxGL = openWebGL(cxBox, _cxGL), cxApp = newApp( cxGL, _vsCode, _fsCode );
	var piGL = openWebGL(piBox, _piGL), piApp = newApp( piGL, _vsCode, _fsCode );
	const cx_vxaPoints = cxGL.getAttribLocation ( cxApp, 'aPoints' );
	const pi_vxaPoints = piGL.getAttribLocation ( piApp, 'aPoints' );
	var cxOut = cxDraw( cxBox, cxGL, cxApp, cx_vxaPoints, sides, width, height );
	var piOut = piDraw( piBox, piGL, piApp, pi_vxaPoints, sides, width, height );
	_cxGL = cxGL;
	_piGL = piGL;
	form.cxWidth.value = cxBox.clientWidth;
	form.piWidth.value = piBox.clientWidth;
	form.cxHeight.value = cxBox.clientHeight;
	form.piHeight.value = piBox.clientHeight;
	form.cxArea.value = cxOut.area;
	form.piArea.value = piOut.area;
	form.cxBorder.value = cxOut.border;
	form.piBorder.value = piOut.border;
	form.cxAreaDividedByBorder.value = cxOut.border / cxOut.area;
	form.piAreaDividedByBorder.value = piOut.border / piOut.area;
	form.cxWidthPI.value = cxOut.border / width;
	form.piWidthPI.value = piOut.border / width;
	form.cxHeightPI.value = cxOut.border / height;
	form.piHeightPI.value = piOut.border / height;
	form.cxPI.value = cxOut.border / ((height / 2) + (width / 2));
	form.piPI.value = piOut.border / ((height / 2) + (width / 2));
	form.cxBox.lastElementChild.lastElementChild.innerHTML = cxOut.html;
	form.piBox.lastElementChild.lastElementChild.innerHTML = piOut.html;
}
