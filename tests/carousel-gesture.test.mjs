import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

// 1. Initialize DOM environment globally before React loads
const dom = new JSDOM("<!DOCTYPE html><html><body><div id='root'></div></body></html>", {
  url: "http://localhost:3000",
  pretendToBeVisual: true,
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.PointerEvent = dom.window.PointerEvent;
globalThis.MouseEvent = dom.window.MouseEvent;
globalThis.WheelEvent = dom.window.WheelEvent;
globalThis.Event = dom.window.Event;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

dom.window.HTMLElement.prototype.setPointerCapture = function (id) {
  this._capturedPointerId = id;
};
dom.window.HTMLElement.prototype.releasePointerCapture = function (_id) {
  this._capturedPointerId = null;
};

// RAF interception
const pendingRafs = new Map();
let nextRafId = 1;
const testRaf = (cb) => {
  const id = nextRafId++;
  pendingRafs.set(id, cb);
  return id;
};
const testCancelRaf = (id) => {
  pendingRafs.delete(id);
};

dom.window.requestAnimationFrame = testRaf;
dom.window.cancelAnimationFrame = testCancelRaf;
globalThis.requestAnimationFrame = testRaf;
globalThis.cancelAnimationFrame = testCancelRaf;

// 2. Load React and Production Component
import React, { act } from "react";
import ReactDOM from "react-dom/client";
import InstagramRoundCarouselModule from "../app/components/InstagramRoundCarousel.tsx";
const InstagramRoundCarousel =
  InstagramRoundCarouselModule.default?.default ||
  InstagramRoundCarouselModule.default ||
  InstagramRoundCarouselModule;

/**
 * Helper to mount a fresh InstagramRoundCarousel into #root
 */
async function setupCarouselHarness(options = {}) {
  const rootElement = dom.window.document.getElementById("root");
  rootElement.innerHTML = "";
  pendingRafs.clear();

  const activeNodeTimers = new Map();
  const testMoments = [
    {
      id: 1,
      title: "Card 1",
      subtitle: "@travel_withsonali • Card 1",
      image: "/card1.jpg",
      tag: "Tag 1",
      postUrl: "https://example.com/1",
    },
    {
      id: 2,
      title: "Card 2",
      subtitle: "@travel_withsonali • Card 2",
      image: "/card2.jpg",
      tag: "Tag 2",
      postUrl: "https://example.com/2",
    },
  ];

  const root = ReactDOM.createRoot(rootElement);
  await act(async () => {
    root.render(
      React.createElement(InstagramRoundCarousel, {
        data: {
          moments: testMoments,
          ...options.data,
        },
      })
    );
  });

  const container = dom.window.document.querySelector("[data-lenis-prevent-touch]");
  const track = container.querySelector(".will-change-transform");
  const section = container.closest("section");
  const cardLink = container.querySelector("a");

  const layout = {
    trackScrollWidth: 2000,
    windowWidth: 1000,
    windowHeight: 800,
    sectionHeight: 2400,
    sectionTop: 0,
  };

  Object.defineProperty(track, "scrollWidth", {
    get: () => layout.trackScrollWidth,
    configurable: true,
  });
  Object.defineProperty(dom.window, "innerWidth", {
    get: () => layout.windowWidth,
    configurable: true,
  });
  Object.defineProperty(dom.window, "innerHeight", {
    get: () => layout.windowHeight,
    configurable: true,
  });
  Object.defineProperty(section, "offsetHeight", {
    get: () => layout.sectionHeight,
    configurable: true,
  });

  section.getBoundingClientRect = () => ({
    top: layout.sectionTop,
    bottom: layout.sectionTop + layout.sectionHeight,
    left: 0,
    right: layout.windowWidth,
    width: layout.windowWidth,
    height: layout.sectionHeight,
    x: 0,
    y: layout.sectionTop,
    toJSON: () => {},
  });

  dom.window.scrollY = 0;
  dom.window.scrollTo = ({ top }) => {
    dom.window.scrollY = top;
  };

  return {
    dom,
    root,
    container,
    track,
    section,
    cardLink,
    layout,
    pendingRafs,
    flushRaf(id) {
      if (pendingRafs.has(id)) {
        const cb = pendingRafs.get(id);
        pendingRafs.delete(id);
        cb();
      }
    },
    flushAllRafs() {
      const entries = Array.from(pendingRafs.entries());
      pendingRafs.clear();
      for (const [, cb] of entries) {
        cb();
      }
    },
    async cleanup() {
      await act(async () => {
        root.unmount();
      });
      for (const timer of activeNodeTimers.values()) {
        clearTimeout(timer);
      }
      activeNodeTimers.clear();
      pendingRafs.clear();
    },
  };
}

test("1. Queue a scroll RAF, start dragging, execute that frame, end dragging, then verify subsequent scrolls still update the actual track", async () => {
  const harness = await setupCarouselHarness();
  try {
    const { dom, container, track, layout } = harness;
    harness.flushAllRafs();

    // 1. Dispatch scroll to queue a scroll RAF
    dom.window.dispatchEvent(new dom.window.Event("scroll"));
    const queuedRafIds = Array.from(harness.pendingRafs.keys());
    assert.ok(queuedRafIds.length > 0, "A scroll RAF must be queued upon scrolling");
    const scrollRafId = queuedRafIds[queuedRafIds.length - 1];

    // 2. Start dragging before the scroll RAF executes
    container.dispatchEvent(
      new dom.window.PointerEvent("pointerdown", {
        clientX: 200,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );
    // Move beyond the horizontal threshold (> 8px)
    container.dispatchEvent(
      new dom.window.PointerEvent("pointermove", {
        clientX: 170,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );

    // 3. Execute the queued scroll RAF while dragging is active
    harness.flushRaf(scrollRafId);

    // 4. End dragging
    container.dispatchEvent(
      new dom.window.PointerEvent("pointerup", {
        clientX: 170,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );

    // 5. Subsequent scroll occurs after dragging has ended
    // Total scrollable = sectionHeight (2400) - windowHeight (800) = 1600.
    // Set sectionTop to -400 -> progress = 400 / 1600 = 0.25.
    // maxTranslate = 2000 - 1000 + 80 = 1080.
    // targetX = 0.25 * -1080 = -270px.
    layout.sectionTop = -400;
    dom.window.dispatchEvent(new dom.window.Event("scroll"));

    const newRafIds = Array.from(harness.pendingRafs.keys());
    assert.ok(newRafIds.length > 0, "Subsequent scroll must queue a new RAF frame");
    harness.flushRaf(newRafIds[newRafIds.length - 1]);

    assert.equal(
      track.style.transform,
      "translate3d(-270px, 0, 0)",
      "Subsequent scroll after drag must update the actual track transform"
    );
  } finally {
    await harness.cleanup();
  }
});

test("2. The first horizontal move beyond the threshold changes the track position", async () => {
  const harness = await setupCarouselHarness();
  try {
    const { dom, container, track } = harness;
    harness.flushAllRafs();

    const initialTransform = track.style.transform;

    // Pointer down at 200
    container.dispatchEvent(
      new dom.window.PointerEvent("pointerdown", {
        clientX: 200,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );

    // First horizontal move beyond 8px threshold: 200 -> 180 (diffX = -20px)
    container.dispatchEvent(
      new dom.window.PointerEvent("pointermove", {
        clientX: 180,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );

    // The very first move beyond threshold must visibly update the track position
    assert.notEqual(
      track.style.transform,
      initialTransform,
      "The first horizontal move beyond the threshold must change the track position"
    );
    assert.notEqual(
      track.style.transform,
      "translate3d(0px, 0, 0)",
      "Track position must not remain at 0px after moving 20px horizontally"
    );
  } finally {
    await harness.cleanup();
  }
});

test("3. Left/right movement clamps to measured track bounds", async () => {
  const harness = await setupCarouselHarness();
  try {
    const { dom, container, track } = harness;
    harness.flushAllRafs();

    // 1. Swiping right from start (0) must remain clamped at 0
    container.dispatchEvent(
      new dom.window.PointerEvent("pointerdown", {
        clientX: 200,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );
    container.dispatchEvent(
      new dom.window.PointerEvent("pointermove", {
        clientX: 300,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );
    assert.equal(
      track.style.transform,
      "translate3d(0px, 0, 0)",
      "Rightward movement beyond 0 must be clamped at 0"
    );
    container.dispatchEvent(
      new dom.window.PointerEvent("pointerup", {
        clientX: 300,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );

    // 2. Swiping left past maxTranslate (-1080px) must clamp at -maxTranslate
    container.dispatchEvent(
      new dom.window.PointerEvent("pointerdown", {
        clientX: 200,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );
    container.dispatchEvent(
      new dom.window.PointerEvent("pointermove", {
        clientX: 180,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );
    // Extreme leftward drag
    container.dispatchEvent(
      new dom.window.PointerEvent("pointermove", {
        clientX: -3000,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );
    // maxTranslate = 2000 - 1000 + 80 = 1080px
    assert.equal(
      track.style.transform,
      "translate3d(-1080px, 0, 0)",
      "Leftward movement past maxTranslate must be clamped at -maxTranslate"
    );
  } finally {
    await harness.cleanup();
  }
});

test("4. pointercancel and lostpointercapture release drag state", async () => {
  const harness = await setupCarouselHarness();
  try {
    const { dom, container, track, layout } = harness;
    harness.flushAllRafs();

    // Part A: pointercancel releases drag state
    container.dispatchEvent(
      new dom.window.PointerEvent("pointerdown", {
        clientX: 200,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );
    container.dispatchEvent(
      new dom.window.PointerEvent("pointermove", {
        clientX: 170,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );
    container.dispatchEvent(
      new dom.window.PointerEvent("pointercancel", {
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );

    // Verify drag state was released: subsequent scroll must update the track
    layout.sectionTop = -400;
    dom.window.dispatchEvent(new dom.window.Event("scroll"));
    harness.flushAllRafs();
    assert.equal(
      track.style.transform,
      "translate3d(-270px, 0, 0)",
      "pointercancel must release drag state so subsequent scrolls update track"
    );

    // Part B: lostpointercapture releases drag state
    layout.sectionTop = 0;
    dom.window.dispatchEvent(new dom.window.Event("scroll"));
    harness.flushAllRafs();
    assert.equal(track.style.transform, "translate3d(0px, 0, 0)");

    // Start another drag
    container.dispatchEvent(
      new dom.window.PointerEvent("pointerdown", {
        clientX: 200,
        clientY: 200,
        pointerId: 2,
        isPrimary: true,
        bubbles: true,
      })
    );
    container.dispatchEvent(
      new dom.window.PointerEvent("pointermove", {
        clientX: 170,
        clientY: 200,
        pointerId: 2,
        isPrimary: true,
        bubbles: true,
      })
    );

    // Dispatch lostpointercapture
    container.dispatchEvent(
      new dom.window.PointerEvent("lostpointercapture", {
        pointerId: 2,
        bubbles: true,
      })
    );

    // Verify drag state was released: subsequent scroll must update track
    layout.sectionTop = -800; // progress = 800/1600 = 0.5 -> targetX = -540px
    dom.window.dispatchEvent(new dom.window.Event("scroll"));
    harness.flushAllRafs();
    assert.equal(
      track.style.transform,
      "translate3d(-540px, 0, 0)",
      "lostpointercapture must release drag state so subsequent scrolls update track"
    );
  } finally {
    await harness.cleanup();
  }
});

test("5. A drag suppresses link navigation while an ordinary tap remains usable", async () => {
  const harness = await setupCarouselHarness();
  try {
    const { dom, container, cardLink } = harness;
    harness.flushAllRafs();

    // 1. Ordinary tap: finger moves within deadband (< 8px)
    container.dispatchEvent(
      new dom.window.PointerEvent("pointerdown", {
        clientX: 200,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );
    // Sub-threshold jitter (diffX = 3px)
    container.dispatchEvent(
      new dom.window.PointerEvent("pointermove", {
        clientX: 203,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );
    container.dispatchEvent(
      new dom.window.PointerEvent("pointerup", {
        clientX: 203,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );

    const tapClickEvent = new dom.window.MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    cardLink.dispatchEvent(tapClickEvent);
    assert.equal(
      tapClickEvent.defaultPrevented,
      false,
      "Ordinary tap must not suppress card link click (defaultPrevented should be false)"
    );

    // 2. Drag: finger moves beyond deadband (diffX = 40px)
    container.dispatchEvent(
      new dom.window.PointerEvent("pointerdown", {
        clientX: 200,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );
    container.dispatchEvent(
      new dom.window.PointerEvent("pointermove", {
        clientX: 160,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );
    container.dispatchEvent(
      new dom.window.PointerEvent("pointerup", {
        clientX: 160,
        clientY: 200,
        pointerId: 1,
        isPrimary: true,
        bubbles: true,
      })
    );

    const dragClickEvent = new dom.window.MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });
    cardLink.dispatchEvent(dragClickEvent);
    assert.equal(
      dragClickEvent.defaultPrevented,
      true,
      "Drag must suppress card link click (defaultPrevented should be true)"
    );
  } finally {
    await harness.cleanup();
  }
});

test("6. Unmount cancels pending frames and timers", async () => {
  let pendingRafCount = 0;
  const originalRaf = dom.window.requestAnimationFrame;
  const originalCancelRaf = dom.window.cancelAnimationFrame;

  dom.window.requestAnimationFrame = (cb) => {
    pendingRafCount++;
    return originalRaf(cb);
  };
  dom.window.cancelAnimationFrame = (id) => {
    pendingRafCount--;
    return originalCancelRaf(id);
  };

  let pendingTimerCount = 0;
  const origSetTimeout = dom.window.setTimeout;
  const origClearTimeout = dom.window.clearTimeout;

  dom.window.setTimeout = (cb, ms) => {
    pendingTimerCount++;
    return origSetTimeout(() => {
      pendingTimerCount--;
      cb();
    }, ms);
  };
  dom.window.clearTimeout = (id) => {
    pendingTimerCount--;
    return origClearTimeout(id);
  };

  const harness = await setupCarouselHarness();
  const { dom: d, container } = harness;

  // 1. Queue a scroll RAF
  d.window.dispatchEvent(new d.window.Event("scroll"));
  assert.ok(pendingRafCount > 0, "A scroll RAF must be pending before unmount");

  // 2. Trigger a wheel event to queue wheel timeout
  const wheelEvent = new d.window.WheelEvent("wheel", {
    deltaX: 100,
    deltaY: 0,
    cancelable: true,
    bubbles: true,
  });
  container.dispatchEvent(wheelEvent);

  // 3. Unmount component
  await harness.cleanup();

  // Restore
  dom.window.requestAnimationFrame = originalRaf;
  dom.window.cancelAnimationFrame = originalCancelRaf;
  dom.window.setTimeout = origSetTimeout;
  dom.window.clearTimeout = origClearTimeout;

  assert.equal(
    pendingRafCount,
    0,
    "Unmount must cancel any pending requestAnimationFrame"
  );
  assert.equal(
    pendingTimerCount,
    0,
    "Unmount must cancel any pending timeouts"
  );
});
