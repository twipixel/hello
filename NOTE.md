## 학습 로드맵

- ~~직선 그리기~~
- ~~삼각형 그리기~~
- ~~사각형 그리기~~
- ~~큐브 그리기~~
- ~~z  테스트~~
- ~~x, y, z 좌표계 (+, - 확인)~~
- 회전
  - ~~x 축 회전~~
  - ~~y 축 회전~~
  - ~~z 축 회전~~ 
  - [Yaw, Pitch, Roll](http://planning.cs.uiuc.edu/node102.html)
- 3D redener
  - [뷰 행렬](http://egloos.zum.com/EireneHue/v/984622)
    - ~~눈의 위치 (Eye Vector)~~
    - ~~바라보는 지점 (Look Vector)~~
    - ~~[Matrix.LookAtLH, Matrix.PerspectiveFovLH](http://blog.naver.com/tramper2/100060771566)~~
  - ~~World 좌표 회전~~ 
  - Camera
    - ~~Camera 회전~~
  - 투영 (Projection)
    - Orthographic
    - Perspective
- ~~[Sphere 생성](http://blog.andreaskahler.com/2009/06/creating-icosphere-mesh-in-code.html)~~
- 조명 적용 (라이팅)
- Texture 적용
  - [UV맵핑, 원근투영](http://jidolstar.tistory.com/543)
  - [Cube Map](http://jidolstar.tistory.com/574)
  - [토성 그리기](http://jidolstar.tistory.com/547) 
- Orbit 회전 구현
- 3D Object 만들기
  - Cylinders
  - 휘어진 스티커

<br>

#### 용어

- Shape
  - icosahedron (20면체)
    - [Triakis icosahedron](https://en.wikipedia.org/wiki/Triakis_icosahedron)
    - [Regular icosahedron](https://en.wikipedia.org/wiki/Regular_icosahedron)
  - Sphere
    - [Icosphere](https://github.com/hughsk/icosphere)
    - Procedural (UV)
    - [Hammersley](http://www.cse.cuhk.edu.hk/~ttwong/papers/udpoint/udpoint.pdf)
- [뷰 행렬](http://egloos.zum.com/EireneHue/v/984622)
- [투영 (Projection)](http://egloos.zum.com/EireneHue/v/985792)
  - Near (0)
  - Far (1)
  - Fov (Field Of View)
    - 화면에 표현할 시야의 각도를 표현하는 것으로, 구체적으로는 보여줄 각도만큼 투여시킬 화면의 범위를 넓혀주는 것으로 생각하면 됩니다.
    - ![Fov](http://pds27.egloos.com/pds/201401/29/96/d0136696_52e8ceb27d42d.png) 
  - Orthographic
  - Perspective
- [3D Objects (Prisms, cylinders, Cones, Spheres)](http://www.shmoop.com/basic-geometry/three-d-prisms-cylinders-cones-spheres.html)
- 메쉬 (Meshes)
- [폴리곤](https://en.wikipedia.org/wiki/Polygon_mesh) (Polygon)
  - ![Polygon](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Mesh_overview.svg/720px-Mesh_overview.svg.png)
- [UV Mapping](https://en.wikipedia.org/wiki/UV_mapping)
  - [UV Mapping Sphere](http://mft-dev.dk/uv-mapping-sphere/)
- Wireframe

<br>

#### 참고 링크

- [Starling Manual](http://manual.starling-framework.org/ko/#_메쉬_meshes)
- [Building a 3D Engine With JavaScript](https://www.sitepoint.com/building-3d-engine-javascript/)
- [How to write a 3D soft engine from JavaScript](https://www.davrous.com/2013/06/13/tutorial-series-learning-how-to-write-a-3d-soft-engine-from-scratch-in-c-typescript-or-javascript/)
- [Build your own HTML5 3D engine](http://www.creativebloq.com/3d/build-your-own-html5-3d-engine-7112935)
- [3D graphics tutorial](http://petercollingridge.appspot.com/3D-tutorial/)
- [3D Shapes](https://www.khanacademy.org/computing/computer-programming/programming-games-visualizations/programming-3d-shapes/a/what-are-3d-shapes)
- [How To Create 3D Graphics Using Canvas](https://msdn.microsoft.com/en-us/library/hh535759(v=vs.85).aspx)
- [Rotating a Vector in 3D Space](http://stackoverflow.com/questions/14607640/rotating-a-vector-in-3d-space)
- [polygon mesh](https://en.wikipedia.org/wiki/Polygon_mesh)
- [plane triangulation](https://github.com/r3mi/poly2tri.js)
- [Four Ways to Create a Mesh for a Sphere](https://gamedevdaily.io/four-ways-to-create-a-mesh-for-a-sphere-d7956b825db4)
- [Creating an icosphere mesh in code](http://blog.andreaskahler.com/2009/06/creating-icosphere-mesh-in-code.html)
- [Icosphere generator C#](http://disq.us/url?url=http%3A%2F%2Fcodescrib.blogspot.com%2F%3AGTwU4dcq96lIEIpJc8INii4ptuY&cuid=104353)
- [Sphere Mesh Creation](http://sol.gfxile.net/sphere/index.html)
- [Planet Texture Maps](http://planetpixelemporium.com/earth.html)
- [The icosahedron-based geodesic sphere](http://donhavey.com/blog/tutorials/tutorial-3-the-icosahedron-sphere/)
- [Geodesic polyhedron](https://en.wikipedia.org/wiki/Geodesic_polyhedron)
- [Procedurally Generated Sphere](http://jacksondunstan.com/articles/1904)
- [World Building](http://pcg.wikidot.com/pcg-algorithm:world-building)
- [Creating an Octahedron Sphere in Unity](http://www.binpress.com/tutorial/creating-an-octahedron-sphere/162)

<br>

#### Code Example

- [3D Orthographic View](http://codepen.io/SitePoint/pen/obapXL)
- [3D Perspective View](http://codepen.io/SitePoint/pen/VeEyvm)
- [3D Perspective Projection on Canvas](http://thecodeplayer.com/walkthrough/3d-perspective-projection-canvas-javascript)
- [Cube rotating with user interaction](https://www.khanacademy.org/computer-programming/cube-rotating-with-user-interaction/5953495622746112)
- [Draw 3D Sphere with HTML5](http://www.bitstorm.it/blog/en/2011/05/3d-sphere-html5-canvas/)

<br>

#### CodePen

- [3D icosahedron with pure JS](https://codepen.io/mcdorli/pen/LkdoZo)
- [JS 3D System II](https://codepen.io/ploom/pen/jVLbJM)
- Sphere
  - Canvas
    - [Canvas Sphere](https://codepen.io/jaburns/pen/nEpjA)
    - [Patchwork sphere](https://codepen.io/enxaneta/pen/rLmKOL)
  - THREE
    - [3D Earth](https://codepen.io/bartuc/pen/yMMyav) (텍스처 굿)
- [Spherical UV Mapping HTML5 Canvas](https://codepen.io/jonbrennecke/pen/zqDaj/)
- [Icosphere](https://github.com/hughsk/icosphere)
- [UV Sphere](http://codepen.io/mcdorli/pen/NAByWV)

<br>

#### Libraries

- [PEX](https://vorg.github.io/pex/)
- [Cango3D](http://www.arc.id.au/Canvas3DGraphics.html)

<br>

#### 좌표표시 예제

- ![Like It](https://i.stack.imgur.com/rQfnu.png)