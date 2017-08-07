## PIXI 궁금한 점

- 기본 환경 구성 이해
  - ~~EventEmitter~~
    - ~~on, off, emit, removeAllListener~~
  - Thicker
    - properties
      - _head: 첫 리스너, 체인으로 등록됩니다.
      - maxElapsedMS (최대 경과 시간)
      - elapsedMS (경과시간) = 1 / 0.06 = 16.66  
        - 1000 / 16.66 = 60 fps
    - 링크드 리스트 만드는 과정
      - ThickerListener(fn, context = null, priority = 0, once = false);

      - Thicker._addListener(listener)

        - listener.connect(previous) 로 linked list 생성

      - TickerListener.connect(previous)

      - ```
        /**
         * @param previous {ThickerListener} _head를 넣어줍니다.
         */
        connect(previous)
        {
        	// 자산의 이전은 _head
            this.previous = previous;
            
            // _head의 next가 있으면 즉, 마지막 등록된 리스너
            if (previous.next)
            {
            	// 마지막 등록된 리스너의 이전은 나로 설정
                previous.next.previous = this;
            }
            
            // 나의 다음은 해드의 다음 즉, 나의 다음은 마지막에 등록된 리스너
            this.next = previous.next;
            
            // 해드의 다음은 나
            previous.next = this;
        }
        ```
      - 3을 등록하기 전
      - | listener      | prev  | next |
        | ------------- | ----- | ---- |
        | _head (기본리스너) | null  | 2    |
        | 0             | 1     | null |
        | 1             | 2     | 0    |
        | 2             | _head | 1    |
        | 3             |       |      |

      - 3을 등록한 후
      - | listener      | prev  | next |
        | ------------- | ----- | ---- |
        | _head (기본리스너) | null  | 3    |
        | 0             | 1     | null |
        | 1             | 2     | 0    |
        | 2             | 3     | 1    |
        | 3             | _head | 2    |

- remove 과정

    - TickerListener.destory(hard = false)

       ```
       destroy(hard = false)
       {
           this._destroyed = true;
           this.fn = null;
           this.context = null;

           // Disconnect, hook up next and previous
           if (this.previous)
           {
           	// 내 이전의 다음을 나의 다음으로 연결
               this.previous.next = this.next;
           }

           if (this.next)
           {
           	// 내 다음의 이전을 나의 이전으로 연결
               this.next.previous = this.previous;
           }

           // Redirect to the next item
           const redirect = this.previous;

           // Remove references
           this.next = hard ? null : redirect;
           this.previous = null;

           return redirect;
       }
       ```

    - 3까지 등록된 상태

       - | listener      | prev  | next |
         | ------------- | ----- | ---- |
         | _head (기본리스너) | null  | 3    |
         | 0             | 1     | null |
         | 1             | 2     | 0    |
         | 2             | 3     | 1    |
         | 3             | _head | 2    |

    - 2를 지운 후
       - | listener      | prev  | next |
         | ------------- | ----- | ---- |
         | _head (기본리스너) | null  | 3    |
         | 0             | 1     | null |
         | 1             | 3     | 0    |
         | 3             | _head | 1    |


- share 해서 사용하는 원리

    - core.ticker.shared는 전역 변수에 Ticker 하나를 생성한 것입니다.

- InteractionManager
    - renderer.plugins.interaction.mouse or pointer
      - core.CanvasRenderer.registerPlugin('interaction', InteractdionManager);
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

