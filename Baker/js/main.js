(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Load the shared footer on every page.
  fetch("footer.html")
    .then(function (response) {
      return response.text();
    })
    .then(function (footerMarkup) {
      $(".footer, .copyright, .cafe-footer").remove();
      $(".back-to-top").before(footerMarkup);

      var footerBreakpoint = window.matchMedia("(max-width: 767.98px)");
      var mobileFooter = footerBreakpoint.matches;
      var footerDisclosures = document.querySelectorAll(
        ".cafe-footer-disclosure[data-footer-disclosure]",
      );

      function setFooterDisclosureState(isMobile) {
        for (var i = 0; i < footerDisclosures.length; i += 1) {
          footerDisclosures[i].open = !isMobile;
        }
      }

      setFooterDisclosureState(mobileFooter);
      window.addEventListener("resize", function () {
        var nextMobileFooter = footerBreakpoint.matches;
        if (nextMobileFooter === mobileFooter) return;
        mobileFooter = nextMobileFooter;
        setFooterDisclosureState(mobileFooter);
      });
    });

  // Initiate the wowjs
  new WOW().init();

  // Fixed Navbar
  $(".fixed-top").css("top", $(".top-bar").height());
  $(window).scroll(function () {
    if ($(this).scrollTop()) {
      $(".fixed-top").addClass("bg-dark").css("top", 0);
    } else {
      $(".fixed-top").removeClass("bg-dark").css("top", $(".top-bar").height());
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Header carousel
  $(".header-carousel").owlCarousel({
    autoplay: false,
    smartSpeed: 1500,
    loop: true,
    nav: true,
    dots: false,
    items: 1,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
  });

  // Facts counter
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000,
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: false,
    smartSpeed: 1000,
    margin: 25,
    loop: true,
    center: true,
    dots: false,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });

  // Interactive 3D bakery room
  var bakeryCanvas = document.getElementById("bakery-3d-canvas");
  var bakeryLoader = document.getElementById("bakery-3d-loader");

  if (bakeryCanvas && window.THREE) {
    var bakeryViewer = bakeryCanvas.parentElement;
    var bakeryScene = new THREE.Scene();
    var bakeryCamera = new THREE.PerspectiveCamera(10, 1, 0.1, 100);
    bakeryCamera.position.set(28, 6, 25);
    bakeryScene.add(bakeryCamera);

    var bakeryControls = new THREE.OrbitControls(bakeryCamera, bakeryCanvas);
    bakeryControls.enableDamping = true;
    bakeryControls.enableZoom = true;
    bakeryControls.enablePan = true;
    bakeryControls.minDistance = 30;
    bakeryControls.maxDistance = 80;
    bakeryControls.minPolarAngle = Math.PI / 5;
    bakeryControls.maxPolarAngle = Math.PI / 2;

    var bakeryRenderer = new THREE.WebGLRenderer({
      canvas: bakeryCanvas,
      antialias: true,
      alpha: true,
    });
    bakeryRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    bakeryRenderer.outputEncoding = THREE.sRGBEncoding;

    var bakeryTextureLoader = new THREE.TextureLoader();
    var bakeryTextureUrl =
      "https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room10/a58985d7d47b6e294f1e7c54c654b0b0636df69c/dist/";
    var bakeryTexture = bakeryTextureLoader.load(
      bakeryTextureUrl + "baked-01.jpg",
    );
    bakeryTexture.flipY = false;
    bakeryTexture.encoding = THREE.sRGBEncoding;
    var bakeryTexture2 = bakeryTextureLoader.load(
      bakeryTextureUrl + "baked-02.jpg",
    );
    bakeryTexture2.flipY = false;
    bakeryTexture2.encoding = THREE.sRGBEncoding;
    var bakeryMaterial = new THREE.MeshBasicMaterial({ map: bakeryTexture });
    var bakeryMaterial2 = new THREE.MeshBasicMaterial({ map: bakeryTexture2 });
    var bakeryModelsLoaded = 0;

    function loadBakeryModel(fileName, material) {
      new THREE.GLTFLoader().load(
        bakeryTextureUrl + fileName,
        function (gltf) {
          gltf.scene.traverse(function (child) {
            if (child.isMesh) child.material = material;
          });
          bakeryScene.add(gltf.scene);
          bakeryModelsLoaded += 1;
          if (bakeryModelsLoaded === 2) bakeryLoader.classList.add("is-hidden");
        },
        undefined,
        function () {
          bakeryLoader.textContent =
            "The bakehouse preview is unavailable right now.";
        },
      );
    }

    loadBakeryModel("model-01.glb", bakeryMaterial);
    loadBakeryModel("model-02.glb", bakeryMaterial2);

    function resizeBakeryViewer() {
      var width = bakeryViewer.clientWidth;
      var height = bakeryCanvas.clientHeight;
      bakeryCamera.aspect = width / height;
      bakeryCamera.updateProjectionMatrix();
      bakeryRenderer.setSize(width, height, false);
    }

    resizeBakeryViewer();
    window.addEventListener("resize", resizeBakeryViewer);

    function renderBakery() {
      bakeryControls.update();
      bakeryControls.target.clamp(
        new THREE.Vector3(-2, -0.5, -2),
        new THREE.Vector3(2, 0.5, 2),
      );
      bakeryRenderer.render(bakeryScene, bakeryCamera);
      window.requestAnimationFrame(renderBakery);
    }

    renderBakery();
  } else if (bakeryLoader) {
    bakeryLoader.textContent = "Enable JavaScript to explore the bakehouse.";
  }
})(jQuery);
