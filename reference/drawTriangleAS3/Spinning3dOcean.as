package { 
    import flash.display.* 
    import flash.events.*; 
    import flash.utils.getTimer; 
     
    public class Spinning3dOcean extends Sprite { 
        // plane vertex coordinates (and t values) 
        var x1:Number = -100,    y1:Number = -100,    z1:Number = 0,    t1:Number = 0; 
        var x2:Number = 100,    y2:Number = -100,    z2:Number = 0,    t2:Number = 0; 
        var x3:Number = 100,    y3:Number = 100,    z3:Number = 0,    t3:Number = 0; 
        var x4:Number = -100,    y4:Number = 100,    z4:Number = 0,    t4:Number = 0; 
        var focalLength:Number = 200;      
        // 2 triangles for 1 plane, indices will always be the same 
        var indices:Vector.<int>; 
         
        var container:Sprite; 
         
        var bitmapData:BitmapData; // texture 
        var imageLoader:ImageLoader; 
        public function Spinning3dOcean():void { 
            indices =  new Vector.<int>(); 
            indices.push(0,1,3, 1,2,3); 
             
            container = new Sprite(); // container to draw triangles in 
            container.x = 200; 
            container.y = 200; 
            addChild(container); 
             
            imageLoader = new ImageLoader("uv-texture.png"); 
            imageLoader.addEventListener(Event.COMPLETE, onImageLoaded); 
        } 
        function onImageLoaded(event:Event):void { 
            bitmapData = imageLoader.bitmap.bitmapData; 
            // animate every frame 
            addEventListener(Event.ENTER_FRAME, rotatePlane); 
        } 
        function rotatePlane(event:Event):void { 
            // rotate vertices over time 
            var ticker = getTimer()/400; 
            z2 = z3 = -(z1 = z4 = 100*Math.sin(ticker)); 
            x2 = x3 = -(x1 = x4 = 100*Math.cos(ticker)); 
             
            // calculate t values 
            t1 = focalLength/(focalLength + z1); 
            t2 = focalLength/(focalLength + z2); 
            t3 = focalLength/(focalLength + z3); 
            t4 = focalLength/(focalLength + z4); 
			
			trace(t1, t2, t3, t4);
             
            // determine triangle vertices based on t values 
            var vertices:Vector.<Number> = new Vector.<Number>(); 
            vertices.push(x1*t1,y1*t1, x2*t2,y2*t2, x3*t3,y3*t3, x4*t4,y4*t4); 
            // set T values allowing perspective to change 
            // as each vertex moves around in z space 
            var uvtData:Vector.<Number> = new Vector.<Number>(); 
            uvtData.push(0,0,t1, 1,0,t2, 1,1,t3, 0,1,t4); 
             
            // draw 
            container.graphics.clear(); 
            container.graphics.beginBitmapFill(bitmapData); 
            container.graphics.drawTriangles(vertices, indices, uvtData); 
        } 
    } 
}