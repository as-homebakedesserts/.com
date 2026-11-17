(function () {
  "use strict";

  var frame = document.querySelector(".bakery-order-frame");
  var historyLink = document.querySelector(".order-page-hero-history");
  if (historyLink) {
    var config = window.CAFE_ORDER;
    var appsScriptUrl = String((config && config.appsScriptUrl) || "").trim();
    if (/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(appsScriptUrl)) {
      historyLink.href = appsScriptUrl + "?action=history";
      historyLink.removeAttribute("aria-disabled");
    } else {
      historyLink.removeAttribute("href");
      historyLink.setAttribute("tabindex", "-1");
      var historyStatus = document.getElementById("order-history-status");
      if (historyStatus) {
        historyStatus.hidden = false;
        historyStatus.textContent = "Order history is unavailable right now. Please contact A&S.";
      }
    }
  }
  if (!frame) return;

  var frameWindow;
  var resizeObserver;
  var mutationObserver;

  function fitFrameToMenu() {
    var childDocument = frame.contentDocument;
    if (!childDocument || !childDocument.documentElement) return;

    var height = childDocument.body
      ? Math.ceil(childDocument.body.scrollHeight) + 2
      : 0;
    if (height > 0 && Math.abs(frame.getBoundingClientRect().height - height) > 1) {
      frame.style.height = height + "px";
    }
  }

  function observeMenu() {
    if (resizeObserver) resizeObserver.disconnect();
    if (mutationObserver) mutationObserver.disconnect();
    if (frameWindow) frameWindow.removeEventListener("resize", fitFrameToMenu);

    var childDocument = frame.contentDocument;
    if (!childDocument || !childDocument.documentElement) return;

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(fitFrameToMenu);
      [childDocument.documentElement, childDocument.body].forEach(function (element) {
        if (element) resizeObserver.observe(element);
      });
    }

    if ("MutationObserver" in window && childDocument.body) {
      mutationObserver = new MutationObserver(fitFrameToMenu);
      mutationObserver.observe(childDocument.body, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      });
    }

    frameWindow = childDocument.defaultView;
    frameWindow.addEventListener("resize", fitFrameToMenu);
    fitFrameToMenu();
  }

  frame.addEventListener("load", observeMenu);
})();
