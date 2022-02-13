export default class App {
  constructor() {
    this.initialize();
    this.initializeGUI();
  }

  initialize() {
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    var imagePaths = ['../../../../asset/image/2d/pixi-particles/bubbles.png'],
      config = {
        "alpha": {
          "start": 1,
          "end": 0.22
        },
        "scale": {
          "start": 0.25,
          "end": 0.75,
          "minimumScaleMultiplier": 0.5
        },
        "color": {
          "start": "ffffff",
          "end": "ffffff"
        },
        "speed": {
          "start": 200,
          "end": 50
        },
        "startRotation": {
          "min": 0,
          "max": 360
        },
        "rotationSpeed": {
          "min": 0,
          "max": 10
        },
        "lifetime": {
          "min": 1200,
          "max": 1200
        },
        "blendMode": "normal",
        "frequency": 0.016,
        "emitterLifetime": 0,
        "maxParticles": 20000,
        "pos": {
          "x": 0,
          "y": 0
        },
        "addAtBack": false,
        "spawnType": "point"
      },
      type = null,
      useParticleContainer = false,
      stepColors = false;

    var canvas = document.getElementById("stage");
    var rendererOptions = {view: canvas};

    var stage = new PIXI.Container(),
      emitter = null,
      renderer = new PIXI.CanvasRenderer(canvas.width, canvas.height, rendererOptions);

    var elapsed = Date.now();
    var updateId;
    var update = function () {
      stats.begin();
      updateId = requestAnimationFrame(update);

      var now = Date.now();
      if (emitter)
        emitter.update((now - elapsed) * 0.001);
      elapsed = now;
      stats.end();
      renderer.render(stage);
    };

    window.parent.onresize = function () {
      const iframe = window.parent.document.getElementById('iframe');
      const {left, top, width, height} = iframe.getBoundingClientRect();
      canvas.width = width - left;
      canvas.height = height - top;
      renderer.resize(canvas.width, canvas.height);
    };
    window.parent.onresize();

    // Preload the particle images and create PIXI textures from it
    var urls, makeTextures = false;
    if (imagePaths.spritesheet)
      urls = [imagePaths.spritesheet];
    else if (imagePaths.textures)
      urls = imagePaths.textures.slice();
    else {
      urls = imagePaths.slice();
      makeTextures = true;
    }

    var loader = PIXI.loader;
    for (var i = 0; i < urls.length; ++i)
      loader.add("img" + i, urls[i]);
    loader.load(function () {
      //collect the textures, now that they are all loaded
      var art;
      if (makeTextures) {
        art = [];
        for (var i = 0; i < imagePaths.length; ++i)
          art.push(PIXI.Texture.fromImage(imagePaths[i]));
      } else
        art = imagePaths.art;
      // Create the new emitter and attach it to the stage
      var emitterContainer;
      if (useParticleContainer) {
        emitterContainer = new PIXI.ParticleContainer();
        emitterContainer.setProperties({
          scale: true,
          position: true,
          rotation: true,
          uvs: true,
          alpha: true
        });
      } else
        emitterContainer = new PIXI.Container();
      stage.addChild(emitterContainer);
      window.emitter = emitter = new PIXI.particles.Emitter(
        emitterContainer,
        art,
        config
      );
      if (stepColors)
        emitter.startColor = PIXI.particles.ParticleUtils.createSteppedGradient(config.color.list, stepColors);
      if (type == "path")
        emitter.particleConstructor = PIXI.particles.PathParticle;
      else if (type == "anim")
        emitter.particleConstructor = PIXI.particles.AnimatedParticle;

      // Center on the stage
      emitter.updateOwnerPos(window.innerWidth / 2, window.innerHeight / 2);

      // Click on the canvas to trigger
      canvas.addEventListener('mouseup', function (e) {
        if (!emitter) return;
        emitter.emit = true;
        emitter.resetPositionTracking();
        emitter.updateOwnerPos(e.offsetX || e.layerX, e.offsetY || e.layerY);
      });

      // Start the update
      update();

      //for testing and debugging
      window.destroyEmitter = function () {
        emitter.destroy();
        emitter = null;
        window.destroyEmitter = null;
        //cancelAnimationFrame(updateId);

        //reset SpriteRenderer's batching to fully release particles for GC
        if (renderer.plugins && renderer.plugins.sprite && renderer.plugins.sprite.sprites)
          renderer.plugins.sprite.sprites.length = 0;

        renderer.render(stage);
      };

      var blurFilter = new PIXI.filters.BlurFilter();
      blurFilter.blur = 10;
      blurFilter.autoFit = true;

      stage.filters = [blurFilter];
      stage.filterArea = renderer.screen;
    });
  }

  initializeGUI() {
    this.gui = new dat.GUI();
    this.config = {
      x: 0,
      y: 0,
      z: 0,
      prevx: 0,
      prevy: 0,
      prevz: 0,
    };
    /*this.config.autorotate = this.autorotate.bind(this);
    this.config.reset = this.reset.bind(this);
    this.gui.add(this.config, 'x').min(0).max(this.canvas.width).step(1).onChange((value) => {
        var dx = value - this.config.prevx;
        this.config.prevx = value;
        this.cube.setProperty('x', dx);
    });
    this.gui.add(this.config, 'y').min(0).max(this.canvas.height).step(1).onChange((value) => {
        var dy = value - this.config.prevy;
        this.config.prevy = value;
        this.cube.setProperty('y', dy);
    });
    this.gui.add(this.config, 'z').min(-300).max(300).step(1).onChange((value) => {
        var dz = value - this.config.prevz;
        this.config.prevz = value;
        this.cube.setProperty('z', dz);
    });
    this.gui.add(this.config, 'autorotate');
    this.gui.add(this.config, 'reset');*/
  }
}