package
{
import flash.display.Bitmap;
import flash.display.BitmapData;
import flash.display.GraphicsTrianglePath;
import flash.display.Shape;
import flash.display.Sprite;
import flash.display.StageAlign;
import flash.display.StageQuality;
import flash.display.StageScaleMode;
import flash.events.Event;
import flash.events.KeyboardEvent;
import flash.events.MouseEvent;
import flash.geom.Matrix3D;
import flash.geom.PerspectiveProjection;
import flash.geom.Utils3D;
import flash.geom.Vector3D;
import flash.utils.getTimer;

    [SWF(frameRate=60, backgroundColor=0x000000)]

    /**
     * 3D Texture 예제.
     * @author Yongho, Ji
     * @since 2009.07.01
     * @see http://help.adobe.com/ko_KR/ActionScript/3.0_ProgrammingAS3/WSF24A5A75-38D6-4a44-BDC6-927A2B123E90.html
     */
    public class Texture3D extends Sprite
{
    [Embed(source="mybaby.png")]
    private var ImageClass:Class;

    // 투영된  Vertex 정보
    private var projected:Vector.<Number>;

    // 투영
    private var projection:PerspectiveProjection = new PerspectiveProjection();

    // World 변환 행렬
    private var world:Matrix3D = new Matrix3D();

    // Viewport (3D 렌더링 대상)
    private var viewport:Shape = new Shape();

    // Mesh 데이터
    private var mesh:GraphicsTrianglePath

    // Texture
    private var texture:BitmapData = (new ImageClass() as Bitmap).bitmapData;

    //triangle을 보여줄지 여부
    private var visibleTriangle:Boolean = false;

    //Texture를 보여줄지 여부
    private var visibleTexture:Boolean = true;

    //실린더  Mesh번호
    private const MESH_CYLINDER:int = 1;

    //원형체  Mesh번호
    private const MESH_TORUS:int = 2;

    //선택한 Mesh 번호
    private var selectedMesh:int;

    //Viewport의 Z축 위치
    private var viewPortZAxis:Number = 300;

    /**
     * 생성자
     */
    public function Texture3D()
    {
        super();

        //화면 설정
        stage.align = StageAlign.TOP_LEFT;
        stage.scaleMode = StageScaleMode.NO_SCALE;
        stage.quality = StageQuality.BEST;

        //viewport를 화면의 중심으로
        viewport.x = stage.stageWidth/2;
        viewport.y = stage.stageHeight/2;
        addChild(viewport);

        //projection의 fieldOfView를  60으로 지정
        projection.fieldOfView = 60;

        //mesh 데이터 설정
        selectMesh( MESH_CYLINDER );

        //이벤트 처리
        stage.addEventListener( Event.RESIZE, onResize );
        addEventListener( Event.ENTER_FRAME, onEnterFrame );
        stage.addEventListener( MouseEvent.CLICK, onMouseClick );
        stage.addEventListener( KeyboardEvent.KEY_DOWN, onKey );
        stage.addEventListener( MouseEvent.MOUSE_WHEEL, onMouseWheel );
    }

    /**
     * Mesh를 선택한다.
     */
    private function selectMesh( meshNumber:int ):void
    {
        if( selectedMesh == meshNumber ) return;
        selectedMesh = meshNumber;

        //투영결과 Vertex 데이타를 초기화시킨다.
        //이것을 해야 Mesh데이터가 바뀔때마다 drawTriangle에서 에러 발생 안함
        projected  = new Vector.<Number>(0, false);
        switch( selectedMesh )
        {
            //실린더
            case MESH_CYLINDER:
                mesh = createCylinderMesh( 50, 100, 20, 5 );
                break;
            //원형체
            case MESH_TORUS:
                mesh = createTorusMesh( 50, 25, 32, 16 );
                break;
        }
    }

    /**
     * 사이즈 변경시 처리
     */
    private function onResize( event:Event ):void
    {
        //viewport는 항상 화면의 중심에 위치하도록 처리
        viewport.x = stage.stageWidth/2;
        viewport.y = stage.stageHeight/2;
    }

    /**
     * 프레임 마다 처리.
     */
    private function onEnterFrame( event:Event ):void
    {
        world.identity(); //단위행렬로 전환
        world.appendRotation( getTimer() * 0.027, Vector3D.X_AXIS ); //X축 회전
        world.appendRotation( getTimer() * 0.061, Vector3D.Y_AXIS ); //Y축 회전
        world.appendTranslation(0, 0, viewPortZAxis); //이동
        world.append(projection.toMatrix3D()); //투영 변환 적용

        // mesh 데이터를  투영하여  projected 생성
        // uvtData도 갱신된다. 갱신되는 데이터는 T값이다.
        Utils3D.projectVectors( world, mesh.vertices, projected, mesh.uvtData );

        // texture를 이용해 렌더링
        viewport.graphics.clear();

        // Triangle 라인을 그림
        if( visibleTriangle )
        {
            viewport.graphics.lineStyle( 1, 0xff0000, 1.0 );
        }

        //Texture 입힌다.
        if( visibleTexture )
        {
            viewport.graphics.beginBitmapFill( texture, null, false, true );
            viewport.graphics.drawTriangles( projected, getSortedIndices(mesh), mesh.uvtData, mesh.culling );
        }
        else
        {
            viewport.graphics.beginFill( 0x00ccff, 1.0 );
            viewport.graphics.drawTriangles( projected, getSortedIndices(mesh), null, mesh.culling );
            viewport.graphics.endFill();
        }
    }

    /**
     * 마우스 클릭 처리
     */
    private function onMouseClick( event:MouseEvent ):void
    {
        //삼각형  선 Visible 바꿈
        visibleTriangle = !visibleTriangle;
    }

    /**
     * 키보드 이벤츠 처리
     */
    private function onKey( event:KeyboardEvent ):void
    {
        if( event.charCode == 116 )
        {
            visibleTexture = !visibleTexture;
        }
        else
        {
            selectMesh( event.charCode - 48 ); //1,2...
        }
    }

    /**
     * 마우스 휠 처리
     */
    private function onMouseWheel( event:MouseEvent ):void
    {
        viewPortZAxis += event.delta * 10;
    }
}
}

import flash.display.GraphicsTrianglePath;
import flash.display.TriangleCulling;

/**
 * GraphicsTrianglePath를 기반으로, Z축으로 sort된 인덱스를 돌려준다.
 * 이 작업을 해주어야 z축 깊이에 따라 Triangle이 제대로 그려진다.
 * @param mesh 정보
 * @return sort된 index 데이터
 */
function getSortedIndices( mesh:GraphicsTrianglePath ):Vector.<int>
{
    var triangles:Array = [];
    var length:uint = mesh.indices.length;

    //z축 sort를 위한 기반 제작 
    for ( var i:uint=0; i < length; i += 3 )
    {
        var i1:uint = mesh.indices[ i+0 ];
        var i2:uint = mesh.indices[ i+1 ];
        var i3:uint = mesh.indices[ i+2 ];
        var z:Number = Math.min( mesh.uvtData[i1 * 3 + 2], mesh.uvtData[i2 * 3 + 2], mesh.uvtData[i3 * 3 + 2]);
        if (z > 0)
        {
            triangles.push({i1:i1, i2:i2, i3:i3, z:z});
        }
    }

    //z축으로 sort
    triangles = triangles.sortOn("z", Array.NUMERIC);

    //sort된 값을 이용해 Vector값 만듬 
    var sortedIndices:Vector.<int> = new Vector.<int>(0, false);
    for each (var triangle:Object in triangles)
    {
        sortedIndices.push(triangle.i1, triangle.i2, triangle.i3);
    }
    return sortedIndices;
}

/**
 * 원통모양의 Mesh 데이터 작성
 * @param radius 원통의 반지름
 * @param height 원통의 높이
 * @param hDiv 반지름 방향으로 조각 수
 * @param vDiv 높이 방향의 조각수
 * @return mesh 데이터
 */
function createCylinderMesh( radius:Number, height:Number, hDiv:uint, vDiv:uint ):GraphicsTrianglePath
{
    var vertices:Vector.<Number> = new Vector.<Number>( 0, false );
    var indices:Vector.<int> = new Vector.<int>( 0, false );
    var uvtData:Vector.<Number> = new Vector.<Number>( 0, false );
    var mesh:GraphicsTrianglePath = new GraphicsTrianglePath( vertices, indices, uvtData, TriangleCulling.NONE );

    for( var i:uint = 0; i <= hDiv; i++ )
    {
        var theta:Number = Math.PI * 2 * i / hDiv; //z축에서 y축으로 잰각
        for( var j:uint = 0; j <= vDiv; j++ )
        {
            var x:Number = -height/2 + j * height/vDiv;
            var y:Number = radius * Math.sin( theta );
            var z:Number = radius * Math.cos( theta );
            mesh.vertices.push( x, y, z );				//하나의 Vertex 데이타
            mesh.uvtData.push( i / hDiv, j / vDiv, 1 ); //하나의 UVT 데이타 . Texture의 점과 Vectex를 일치시켜 Texture를 입히기 위한 데이타이다.
            if( j < vDiv && i < hDiv )
            {
                var a:uint =  i      * (vDiv + 1) + j;
                var b:uint = (i + 1) * (vDiv + 1) + j;
                mesh.indices.push(a, a + 1, b, b + 1, b, a + 1); //삼각형의 index이다. culling방향 고려 
            }
        }
    }
    return mesh;
}

/**
 * 원환체(도너츠모양) Mesh 데이터 작성
 * @param hRadius 원환체의 수평축 반지름
 * @param vRadius 원환체의 수직축 반지름
 * @param hDiv 수평 방향의 조각 수
 * @param vDiv 높이 방향의 조각수
 * @return mesh 데이터
 */
function createTorusMesh( hRadius:Number, vRadius:Number, hDiv:uint, vDiv:uint ):GraphicsTrianglePath
{
    var vertices:Vector.<Number> = new Vector.<Number>( 0, false );
    var indices:Vector.<int> = new Vector.<int>( 0, false );
    var uvtData:Vector.<Number> = new Vector.<Number>( 0, false );
    var mesh:GraphicsTrianglePath = new GraphicsTrianglePath( vertices, indices, uvtData, TriangleCulling.NONE );
    for (var i:uint=0; i<=hDiv; i++)
    {
        var s1:Number = Math.PI * 2 * i / hDiv;
        for (var j:uint=0; j<=vDiv; j++)
        {
            var s2:Number = Math.PI * 2 * j / vDiv;
            var r:Number = Math.cos(s2) * vRadius + hRadius;
            var x:Number = Math.cos(s1) * r;
            var y:Number = Math.sin(s1) * r;
            var z:Number = Math.sin(s2) * vRadius;
            mesh.vertices.push( x, y, z );
            mesh.uvtData.push(i / hDiv, j / vDiv, 1);
            if (j < vDiv && i < hDiv) {
                var a:uint =  i      * (vDiv + 1) + j;
                var b:uint = (i + 1) * (vDiv + 1) + j;
                mesh.indices.push(b, a + 1, a, a + 1, b, b + 1);
            }
        }
    }
    return mesh;
}