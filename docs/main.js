var _ = new Library();

const MODE_SELECT = {
  TITLE: 0,
  GAME: 2,
  RESULT: 3
};

const KEY_PRESS = {
  NONE: 0,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
  ENTER: 13
};

window.onload = function (e) {
  let cv = document.getElementById('canvas'),
    ctx = cv.getContext('2d'),
    fps = 30,
    run = true,
    mode = MODE_SELECT.TITLE,
    key = KEY_PRESS.NONE,
    goal = {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    },
    bars = {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    },
    accel = 0.1,
    move_property = {
      prev_key: KEY_PRESS.NONE,
      velocity: 0
    },
    timer = {
      start: new Date(),
      stop: new Date()
    },
    mouse = {
      x: 0,
      y: 0,
      click: false,
      isInnerRect: function (x, y, w, h) {
        return x < this.x && this.x < (x + w) && y < this.y && this.y < (y + h);
      }
    };

  [cv.width, cv.height] = [window.innerWidth, window.innerHeight];
  [ctx.textAlign, ctx.textBaseline] = ['center', 'alphabetic'];

  document.addEventListener('keydown', function (e) {
    key = e.keyCode;
  });
  document.addEventListener('keyup', function (e) {
    if (key === e.keyCode) {
      key = KEY_PRESS.NONE;
    }
  });
  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener('mousedown', function (e) {
    mouse.click = true;
  });
  document.addEventListener('mouseup', function (e) {
    mouse.click = false;
  });
  window.addEventListener('resize', function (e) {
    [cv.width, cv.height] = [window.innerWidth, window.innerHeight];
    ctx.textAlign = 'center';
  });

  (function () {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.beginPath();

    if (mode === MODE_SELECT.TITLE) {
      ctx.fillStyle = (new Color("hsl(120, 100, 60)")).rgb.toString();
      ctx.font = "72px sans-serif";
      ctx.fillText("FOCUS", cv.width / 2, cv.height / 2);

      if ([KEY_PRESS.SPACE, KEY_PRESS.ENTER].some(kp => kp === key)) {
        key = KEY_PRESS.NONE;
        mode = MODE_SELECT.GAME;
        [goal.x, goal.y] = [Math.random() * cv.width | 0, Math.random() * cv.height | 0];
        [goal.w, goal.h] = [Math.random() * (cv.width - goal.x) | 0, Math.random() * (cv.height - goal.y) | 0];
        [bars.w, bars.h] = [cv.width, cv.height];
        timer.start = new Date();
      }
    } else if (mode === MODE_SELECT.GAME) {
      ctx.fillStyle = (new Color("hsl(40, 100, 60)")).rgb.toString();
      ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
      ctx.strokeStyle = (new Color("hsl(120, 100, 60)")).rgb.toString();
      strokeBars(ctx, cv, bars);
      ctx.fillStyle = (new Color("hsl(60, 100, 60)")).rgb.toString();
      ctx.font = "20pt sans-serif";
      ctx.fillText(((new Date() - timer.start) / 1000).toFixed(3), cv.width / 2, 20);

      if (key === move_property.prev_key) {
        move_property.velocity += accel;
      } else {
        move_property.velocity = 0;
        move_property.prev_key = key;
      }
      if (key === KEY_PRESS.LEFT) {
        bars.w -= move_property.velocity;
      } else if (key === KEY_PRESS.UP) {
        bars.h -= move_property.velocity;
      } else if (key === KEY_PRESS.RIGHT) {
        bars.x += move_property.velocity;
        bars.w -= move_property.velocity;
      } else if (key === KEY_PRESS.DOWN) {
        bars.y += move_property.velocity;
        bars.h -= move_property.velocity;
      }
      if ([KEY_PRESS.SPACE, KEY_PRESS.ENTER].some(kp => kp === key) || isOverTheLimit(bars, goal)) {
        timer.stop = new Date();
        key = KEY_PRESS.NONE;
        mode = MODE_SELECT.RESULT;
      }
    } else if (mode === MODE_SELECT.RESULT) {
      let score = calcScore(bars, goal, cv, timer);
      ctx.font = "72px sans-serif";
      if (isOverTheLimit(bars, goal)) {
        ctx.fillStyle = (new Color("hsl(0, 100, 50)")).rgb.toString();
        ctx.fillText("限界を超えてしまった！", cv.width / 2, cv.height / 2 - 144);
        score = 0;
      } else {
        if (score >= 100) {
          ctx.fillStyle = (new Color("hsl(60, 100, 60)")).rgb.toString();
          ctx.fillText("超人になった", cv.width / 2, cv.height / 2 - 144);
        } else if (score >= 80) {
          ctx.fillStyle = (new Color("hsl(90, 100, 60)")).rgb.toString();
          ctx.fillText("君ならできる", cv.width / 2, cv.height / 2 - 144);
        } else if (score >= 50) {
          ctx.fillStyle = (new Color("hsl(120, 100, 60)")).rgb.toString();
          ctx.fillText("どうしてそこで諦めるんだ", cv.width / 2, cv.height / 2 - 144);
        } else {
          ctx.fillStyle = (new Color("hsl(150, 100, 60)")).rgb.toString();
          ctx.fillText("しっかりしろよ", cv.width / 2, cv.height / 2 - 144);
        }
      }
      ctx.fillText("TIME : " + ((timer.stop - timer.start) / 1000).toFixed(3), cv.width / 2, cv.height / 2);
      ctx.fillText("SCORE : " + score.toFixed(3), cv.width / 2, cv.height / 2 + 108);
      if (mouse.isInnerRect(0, cv.height / 2 + 152, cv.width, 72)) {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(0, cv.height / 2 + 152, cv.width, 72);
        if (mouse.click) {
          openURL("https://twitter.com/intent/tweet?text=FOCUS%0d%0aSCORE%20:%20" + score.toFixed(3) + "%0d%0a&url=http://double-oxygen.net/focus/&hashtags=traP3jam");
        }
      }
      ctx.fillStyle = "rgb(85, 172, 238)";
      ctx.fillText("TWEET", cv.width / 2, cv.height / 2 + 216);

      if ([KEY_PRESS.SPACE, KEY_PRESS.ENTER].some(kp => kp === key)) {
        key = KEY_PRESS.NONE;
        mode = MODE_SELECT.TITLE;
        bars = {
          x: 0,
          y: 0,
          w: 0,
          h: 0
        };
      }
    }

    ctx.closePath();

    if (run) {
      setTimeout(arguments.callee, 1000 / fps);
    }
  })();
};

function strokeBars(context, canvas, bars) {
  context.moveTo(bars.x, 0);
  context.lineTo(bars.x, canvas.height);
  context.moveTo(bars.x + bars.w, 0);
  context.lineTo(bars.x + bars.w, canvas.height);
  context.moveTo(0, bars.y);
  context.lineTo(canvas.width, bars.y);
  context.moveTo(0, bars.y + bars.h);
  context.lineTo(canvas.width, bars.y + bars.h);
  context.stroke();
}

function isOverTheLimit(bars, goal) {
  return bars.x > goal.x || bars.y > goal.y || (bars.x + bars.w) < (goal.x + goal.w) || (bars.y + bars.h) < (goal.y + goal.h);
}

function calcScore(bars, goal, canvas, time) {
  let passed = time.stop - time.start,
    rate = (bars.x / goal.x) * (bars.y / goal.y) * ((canvas.width - bars.w - bars.x) / (canvas.width - goal.w - goal.x)) * ((canvas.height - bars.h - bars.y) / (canvas.height - goal.h - goal.y));
  return 1600000 * rate / passed;
}

function openURL(url) {
  if (!window.open(url, "_blank")) {
    location.href = url;
  }
}
