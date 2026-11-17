(function () {
  "use strict";

  var menuLink = document.getElementById("bakery-menu-link");
  var layoutMarker = document.querySelector('meta[name="bakery-layout"]');
  var isBakerSubdirectory =
    window.location.pathname.indexOf("/Baker/") !== -1;
  var isNestedPagesDeployment =
    isBakerSubdirectory && layoutMarker && layoutMarker.content === "pages";

  var homeLink = document.getElementById("bakery-home-link");
  if (homeLink) {
    homeLink.href = isBakerSubdirectory
      ? "index.html?home=1"
      : "Baker/index.html?home=1";
  }

  if (menuLink) {
    menuLink.href = isBakerSubdirectory
      ? isNestedPagesDeployment
        ? "../menu/"
        : "../index.html"
      : "menu/";
  }

  var canvas = document.getElementById("bakery-3d-canvas");
  var loaderMessage = document.getElementById("bakery-3d-loader");
  var assetRoot =
    "https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room10/a58985d7d47b6e294f1e7c54c654b0b0636df69c/dist/";

  if (!canvas || !window.THREE) {
    loaderMessage.textContent = "Enable JavaScript to explore the bakehouse.";
    return;
  }

  var isMobile = window.innerWidth <= 600;
  var scene = new THREE.Scene();
  var bakeryGroup = new THREE.Group();
  var modelGroup = new THREE.Group();
  bakeryGroup.add(modelGroup);
  scene.add(bakeryGroup);
  scene.add(new THREE.HemisphereLight(0xfff4df, 0x65432d, 1.4));
  var dessertLight = new THREE.DirectionalLight(0xffffff, 1.8);
  dessertLight.position.set(4, 10, 6);
  scene.add(dessertLight);
  var camera = new THREE.PerspectiveCamera(
    isMobile ? 40 : 32,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
  camera.position.set(isMobile ? 14 : 12, isMobile ? 6 : 5, isMobile ? 14 : 12);
  scene.add(camera);

  var controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.minDistance = 5;
  controls.maxDistance = 100;
  controls.minPolarAngle = Math.PI / 5;
  controls.maxPolarAngle = Math.PI * 0.95;

  var treats = [];
  var treatsEnabled = true;
  var cookieEdgeMaterial = new THREE.MeshPhongMaterial({
    color: 0x713019,
    shininess: 12,
  });
  var cookieMaterial = new THREE.MeshPhongMaterial({
    color: 0xc77b35,
    shininess: 18,
  });
  var chocolateMaterial = new THREE.MeshPhongMaterial({
    color: 0x32150f,
    shininess: 35,
  });
  var cakeMaterial = new THREE.MeshPhongMaterial({
    color: 0x4a2117,
    shininess: 18,
  });
  var ganacheMaterial = new THREE.MeshPhongMaterial({
    color: 0x2b120d,
    shininess: 42,
  });
  var frostingMaterial = new THREE.MeshPhongMaterial({
    color: 0xf5e2c0,
    shininess: 24,
  });
  var plateMaterial = new THREE.MeshPhongMaterial({
    color: 0xe7e1d6,
    shininess: 40,
  });
  var berryMaterial = new THREE.MeshPhongMaterial({
    color: 0xc51d3d,
    shininess: 55,
  });
  var stemMaterial = new THREE.MeshPhongMaterial({
    color: 0x3d2417,
    shininess: 10,
  });

  function addCookie(position, scale, phase, isFloating) {
    var cookie = new THREE.Group();
    var cookieEdge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 0.16, 32),
      cookieEdgeMaterial,
    );
    var cookieTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 0.14, 32),
      cookieMaterial,
    );
    cookieTop.position.y = 0.1;
    cookie.add(cookieEdge, cookieTop);
    cookie.position.set(position[0], position[1], position[2]);
    cookie.scale.setScalar(scale);
    cookie.rotation.z = -0.12;
    cookie.userData =
      isFloating === false
        ? {}
        : { baseY: position[1], phase: phase, speed: 0.7 };
    bakeryGroup.add(cookie);
    treats.push(cookie);

    if (isFloating === false) return;

    var chipPositions = [
      [-0.35, 0.2],
      [-0.08, 0.32],
      [0.28, 0.2],
      [-0.25, -0.18],
      [0.12, -0.28],
      [0.35, -0.05],
    ];
    chipPositions.forEach(function (chipPosition) {
      var chip = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 10, 10),
        chocolateMaterial,
      );
      chip.position.set(chipPosition[0], 0.2, chipPosition[1]);
      cookie.add(chip);
    });
  }

  function addCake(position, scale, phase) {
    var cake = new THREE.Group();
    var plate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.86, 0.08, 40),
      plateMaterial,
    );
    plate.position.y = -0.38;
    var lowerLayer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.72, 0.38, 32),
      cakeMaterial,
    );
    lowerLayer.position.y = -0.08;
    var upperLayer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.7, 0.4, 32),
      cakeMaterial,
    );
    upperLayer.position.y = 0.32;
    var ganacheTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.73, 0.7, 0.14, 32),
      ganacheMaterial,
    );
    ganacheTop.position.y = 0.56;
    cake.add(plate, lowerLayer, upperLayer, ganacheTop);

    [-0.42, 0, 0.42].forEach(function (creamPosition) {
      var cream = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.28, 16),
        frostingMaterial,
      );
      cream.position.set(creamPosition, 0.76, creamPosition ? 0.16 : -0.1);
      cake.add(cream);
    });

    [-0.52, 0, 0.52].forEach(function (berryPosition, berryIndex) {
      var berry = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 14, 14),
        berryMaterial,
      );
      berry.position.set(berryPosition, 0.96, berryIndex === 1 ? -0.08 : 0.16);
      var stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.2, 8),
        stemMaterial,
      );
      stem.position.set(berryPosition, 1.1, berryIndex === 1 ? -0.08 : 0.16);
      stem.rotation.z = berryIndex === 1 ? -0.15 : 0.15;
      cake.add(berry, stem);
    });

    cake.position.set(position[0], position[1], position[2]);
    cake.scale.setScalar(scale);
    cake.rotation.y = 0.25;
    cake.userData = { baseY: position[1], phase: phase, speed: 0.45 };
    bakeryGroup.add(cake);
    treats.push(cake);
  }

  addCookie([3.5, 2.5, 1], 0.8, 0);
  addCookie([5.5, 1.5, 0], 0.55, 1.5);
  addCookie([-5, 2.7, -2], 0.65, 2.4);
  addCookie([1.5, 3.2, -1], 0.5, 3.2);
  addCookie([-5, 1.3, 0], 0.45, 4.1);
  addCake([-3.5, 2.1, 1], 0.9, 1.2);
  addCake([4.5, 2.2, -1], 0.7, 2.8);
  addCookie([1.45, -0.73, 1.6], 0.42, 0, false);
  addCookie([1.46, -0.73, -0.62], 0.42, 0, false);
  addCookie([-1.62, -0.73, -1.53], 0.38, 0, false);

  var motionButton = document.getElementById("bakery-motion-toggle");
  var motionStatus = document.getElementById("bakery-motion-status");
  var motionEnabled = false;
  var motionBaseline = null;
  var orientationDataReceived = false;
  var motionWatchdog;
  var motionTarget = { x: 0, y: 0 };

  function announceMotion(message, showVisually) {
    motionStatus.textContent = message;
    if (showVisually) {
      motionStatus.classList.remove("visually-hidden");
      motionStatus.classList.add("bakery-motion-notice");
      return;
    }

    motionStatus.classList.add("visually-hidden");
    motionStatus.classList.remove("bakery-motion-notice");
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function wrapAngle(value) {
    return ((value + 180) % 360 + 360) % 360 - 180;
  }

  function handleDeviceOrientation(event) {
    if (event.beta === null || event.gamma === null) return;
    orientationDataReceived = true;
    if (!motionBaseline) {
      motionBaseline = { beta: event.beta, gamma: event.gamma };
      return;
    }

    var beta = wrapAngle(event.beta - motionBaseline.beta);
    var gamma = wrapAngle(event.gamma - motionBaseline.gamma);
    var screenAngle = window.screen.orientation
      ? window.screen.orientation.angle
      : window.orientation || 0;
    var horizontal = gamma;
    var vertical = beta;

    if (screenAngle === 90) {
      horizontal = -beta;
      vertical = gamma;
    } else if (screenAngle === 180) {
      horizontal = -gamma;
      vertical = -beta;
    } else if (screenAngle === 270 || screenAngle === -90) {
      horizontal = beta;
      vertical = -gamma;
    }

    motionTarget.x = clamp(vertical * 0.008, -0.45, 0.45);
    motionTarget.y = clamp(horizontal * 0.008, -0.55, 0.55);
  }

  function setMotionEnabled(enabled) {
    if (enabled === motionEnabled) return;
    motionEnabled = enabled;
    motionBaseline = null;
    orientationDataReceived = false;
    window.clearTimeout(motionWatchdog);
    if (enabled) {
      window.addEventListener("deviceorientation", handleDeviceOrientation, {
        passive: true,
      });
      motionButton.setAttribute("aria-pressed", "true");
      motionButton.setAttribute("aria-label", "Disable phone tilt control");
      motionButton.title = "Disable phone tilt control";
      announceMotion("Tilt control enabled. Tilt your phone to rotate the bakery.", false);
      motionWatchdog = window.setTimeout(function () {
        if (motionEnabled && !orientationDataReceived) {
          announceMotion(
            "No phone motion data received. Check sensor permissions or open this page over HTTPS.",
            true,
          );
        }
      }, 2500);
      return;
    }

    window.removeEventListener("deviceorientation", handleDeviceOrientation);
    motionTarget.x = 0;
    motionTarget.y = 0;
    motionButton.setAttribute("aria-pressed", "false");
    motionButton.setAttribute("aria-label", "Enable phone tilt control");
    motionButton.title = "Enable phone tilt control";
    announceMotion("Phone tilt control disabled.", false);
  }

  function toggleMotion() {
    if (motionEnabled) {
      setMotionEnabled(false);
      return;
    }

    if (!window.isSecureContext) {
      return;
    }

    var orientationApi = window.DeviceOrientationEvent;
    if (!orientationApi) {
      announceMotion("Phone tilt control is not available on this device.", true);
      return;
    }

    if (typeof orientationApi.requestPermission !== "function") {
      setMotionEnabled(true);
      return;
    }

    orientationApi
      .requestPermission()
      .then(function (permission) {
        if (permission === "granted") {
          setMotionEnabled(true);
        } else {
          announceMotion("Phone motion permission was not granted.", true);
        }
      })
      .catch(function () {
        announceMotion("Phone motion permission could not be requested.", true);
      });
  }

  var isTouchDevice =
    navigator.maxTouchPoints > 0 || "ontouchstart" in window;
  if (isTouchDevice && window.isSecureContext) {
    motionButton.hidden = false;
    motionButton.addEventListener("click", toggleMotion);
    if (typeof window.DeviceOrientationEvent === "undefined") {
      announceMotion("Phone tilt control is not available on this device.", true);
    } else if (
      typeof window.DeviceOrientationEvent.requestPermission !== "function"
    ) {
      setMotionEnabled(true);
    }
  }

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
  } catch (error) {
    loaderMessage.textContent = "The 3D preview is not supported on this device.";
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  var textureLoader = new THREE.TextureLoader();
  var material = new THREE.MeshBasicMaterial({ color: 0xe4c49c });
  var material2 = new THREE.MeshBasicMaterial({ color: 0xe4c49c });
  var loadedModels = 0;
  var settledModels = 0;
  var hasFramed = false;
  var loaderTimeout;
  modelGroup.visible = false;

  function hideLoader() {
    window.clearTimeout(loaderTimeout);
    loaderMessage.classList.add("is-hidden");
  }

  function frameScene() {
    bakeryGroup.position.set(0, 0, 0);
    var bounds = new THREE.Box3().setFromObject(modelGroup);
    if (bounds.isEmpty()) return;

    var center = bounds.getCenter(new THREE.Vector3());
    bakeryGroup.position.copy(center).negate();
    bounds.setFromObject(modelGroup);
    var framingCenter = bounds.getCenter(new THREE.Vector3());

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = window.innerWidth <= 600 ? 40 : 32;
    camera.updateProjectionMatrix();
    var verticalFov = THREE.Math.degToRad(camera.fov);
    var horizontalFov =
      2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
    var direction = new THREE.Vector3(1, 0.28, 1).normalize();
    var right = new THREE.Vector3().crossVectors(
      new THREE.Vector3(0, 1, 0),
      direction,
    ).normalize();
    var cameraUp = new THREE.Vector3().crossVectors(direction, right).normalize();
    var halfWidth = 0;
    var halfHeight = 0;
    var halfDepth = 0;
    for (var x = 0; x <= 1; x += 1) {
      for (var y = 0; y <= 1; y += 1) {
        for (var z = 0; z <= 1; z += 1) {
          var corner = new THREE.Vector3(
            x ? bounds.max.x : bounds.min.x,
            y ? bounds.max.y : bounds.min.y,
            z ? bounds.max.z : bounds.min.z,
          ).sub(framingCenter);
          halfWidth = Math.max(halfWidth, Math.abs(corner.dot(right)));
          halfHeight = Math.max(halfHeight, Math.abs(corner.dot(cameraUp)));
          halfDepth = Math.max(halfDepth, Math.abs(corner.dot(direction)));
        }
      }
    }

    var distance =
      halfDepth +
      Math.max(
        halfWidth / Math.tan(horizontalFov / 2),
        halfHeight / Math.tan(verticalFov / 2),
      ) *
        1.08;

    controls.target.set(0, 0, 0);
    camera.position.copy(direction.multiplyScalar(distance));
    controls.minDistance = Math.max(distance * 0.45, 0.1);
    controls.maxDistance = distance * 2.5;
    controls.update();
    hasFramed = true;
  }

  function tryRevealModel(reframe) {
    if (loadedModels > 0) {
      modelGroup.visible = true;
      if (reframe || !hasFramed) frameScene();
    }
    if (settledModels === 2) {
      if (loadedModels === 2) {
        hideLoader();
      } else {
        loaderMessage.textContent = "Some bakehouse details could not load.";
        window.setTimeout(hideLoader, 4000);
      }
    }
  }

  function settleModel(succeeded) {
    settledModels += 1;
    if (succeeded) loadedModels += 1;
    tryRevealModel(succeeded);
  }

  function settleTexture(texture, modelMaterial) {
    if (texture) {
      texture.flipY = false;
      texture.encoding = THREE.sRGBEncoding;
      modelMaterial.map = texture;
      modelMaterial.color.setHex(0xffffff);
    } else {
      modelMaterial.color.setHex(0xe4c49c);
      loaderMessage.textContent =
        "Some bakehouse details could not load.";
    }
    modelMaterial.needsUpdate = true;
    tryRevealModel(false);
  }

  textureLoader.load(
    assetRoot + "baked-01.jpg",
    function (texture) { settleTexture(texture, material); },
    undefined,
    function () { settleTexture(null, material); },
  );
  textureLoader.load(
    assetRoot + "baked-02.jpg",
    function (texture) { settleTexture(texture, material2); },
    undefined,
    function () { settleTexture(null, material2); },
  );

  function loadModel(fileName, modelMaterial) {
    new THREE.GLTFLoader().load(
      assetRoot + fileName,
      function (gltf) {
        gltf.scene.traverse(function (child) {
          if (child.isMesh) child.material = modelMaterial;
        });
        modelGroup.add(gltf.scene);
        settleModel(true);
      },
      undefined,
      function () {
        loaderMessage.textContent =
          "The bakehouse preview is unavailable right now.";
        settleModel(false);
      },
    );
  }

  loadModel("model-01.glb", material);
  loadModel("model-02.glb", material2);
  loaderTimeout = window.setTimeout(hideLoader, 12000);

  var wasPortrait = window.innerHeight > window.innerWidth;
  function resize() {
    isMobile = window.innerWidth <= 600;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = isMobile ? 40 : 32;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    var isPortrait = window.innerHeight > window.innerWidth;
    if (hasFramed && isPortrait !== wasPortrait) frameScene();
    wasPortrait = isPortrait;
  }

  function render() {
    var elapsed = performance.now() * 0.001;
    controls.update();
    bakeryGroup.rotation.x += (motionTarget.x - bakeryGroup.rotation.x) * 0.08;
    bakeryGroup.rotation.y += (motionTarget.y - bakeryGroup.rotation.y) * 0.08;
    treats.forEach(function (treat) {
      if (!treat.userData.baseY) return;
      treat.position.y =
        treat.userData.baseY +
        Math.sin(elapsed * treat.userData.speed + treat.userData.phase) *
          0.18;
      treat.rotation.y += 0.004;
    });
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
  }

  resize();
  window.addEventListener("resize", resize);
  render();
})();
