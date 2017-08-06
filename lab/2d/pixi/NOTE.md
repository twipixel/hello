## PIXI 궁금한 점

- 기본 환경 구성 이해
  - ~~EventEmitter~~
    - ~~on, off, emit, removeAllListener~~
  - Thicker
    - properties
      - _head: 첫 리스너, 체인으로 등록됩니다.
      - maxElapsedMS (최대 경과 시간)
      - elapsedMS = 1 / 0.06 = 16.66  (경과시간)
        - 1000 / 16.66 = 60 fps
    - 링크드 리스트 만드는 과정
      - _addListener(listener)

      - | _head |      |      |
        | ----- | ---- | ---- |
        | 0     |      |      |
        |       |      |      |
        |       |      |      |

      - share 해서 사용하는 원리


      - core.ticker.shared 는 전역 변수에 Ticker 하나를 생성한 것입니다.
  - InteractionManager
    - renderer.plugins.interaction.mouse or pointer
      - core.CanvasRenderer.registerPlugin('interaction', InteractdionManager);
    - ​
    - 마우스 클릭 감지
    - 마우스 좌표 처리
  - registerPlugin 원리
    - 등록 방법
    - 사용 방법
    - 로직 분리 효과가 있는건가? 왜 사용 하는가?


- Pixi 실행 환경
  - Application 생성
    - 객체 생성
  - loop
    - renderer.render(stage);


- 랜더링
  - Application
  - Matrix
  - Transform
  - DisplayObject
  - Container
  - Graphics
  - Sprite
  - Renderer
    - Canvas
    - WebGL
  - 화면에 어떻게 그려지는 지
  - Mask 적용
  - Filter 적용
- 옵션
  - renderer.roundPixels 처리

