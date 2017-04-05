## 학습 로드맵

- 직선 그리기
- 삼각형 그리기
- 사각형 그리기
- 큐브 그리기
- z  테스트
- 회전
  - x 축 회전
  - y 축 회전
  - z 축 회전 
  - [Yaw, Pitch, Roll](http://planning.cs.uiuc.edu/node102.html)
- 3D redener
  - Vector3D
  - Matrix
  - [뷰 행렬](http://egloos.zum.com/EireneHue/v/984622)
    - 눈의 위치 (Eye Vector)
    - 바라보는 지점 (Look Vector)
    - [Matrix.LookAtLH, Matrix.PerspectiveFovLH](http://blog.naver.com/tramper2/100060771566)
  - Camera
    - Camera 회전
  - 투영 (Projection)
    - Orthographic
    - Perspective
- Sphere 생성
- Texture 적용
- Orbit 회전 구현
- 3D Object 만들기
  - Cylinders
  - 휘어진 스티커

<br>

#### 용어

- Shape
  - icosahedron
    - [Triakis icosahedron](https://en.wikipedia.org/wiki/Triakis_icosahedron)
    - [Regular icosahedron](https://en.wikipedia.org/wiki/Regular_icosahedron)
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

<br>

#### Code Example

- [3D Orthographic View](http://codepen.io/SitePoint/pen/obapXL)
- [3D Perspective View](http://codepen.io/SitePoint/pen/VeEyvm)
- [Cube rotating with user interaction](https://www.khanacademy.org/computer-programming/cube-rotating-with-user-interaction/5953495622746112)
- [Draw 3D Sphere with HTML5](http://www.bitstorm.it/blog/en/2011/05/3d-sphere-html5-canvas/)

<br>

#### CodePen

- [3D icosahedron with pure JS](https://codepen.io/mcdorli/pen/LkdoZo)
- [JS 3D System II](https://codepen.io/ploom/pen/jVLbJM)

<br>

#### Libraries

- [PEX](https://vorg.github.io/pex/)