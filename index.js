(function() {
  // object assign polyfill
  polyfill();

  var colorMap = {
    0: "#FFF",
    1: "#27BBEE",
    2: "#88B14B",
    3: "#F5A623",
    4: "#FF7A7A",
    '-1': "#CCC"
  };

  var cities = [
    {id:"ears",lv:0,},
    {id:"face",lv:0,},
    {id:"nose",lv:0,},
    {id:"chin",lv:0,},
    {id:"neck",lv:0,},
    {id:"chest",lv:0,},
    {id:"hands",lv:0,},
    {id:"back",lv:0,},
    {id:"side",lv:0,},
    {id:"stomach",lv:0,},
    {id:"butt",lv:0,},
    {id:"legs",lv:0,},
    {id:"tail",lv:0,},
    {id:"front-paws",lv:0,},
    {id:"rear-paws",lv:0,}
  ];

  var translate = {
    "ears": "耳朵",
    "face": "脸",
    "nose": "鼻子",
    "chin": "下巴",
    "neck": "脖子",
    "chest": "胸",
    "hands": "手手",
    "back": "背",
    "side": "侧腹",
    "stomach": "肚肚",
    "butt": "屁屁",
    "legs": "jiojio",
    "tail": "尾巴",
    "front-paws": "前肉球",
    "rear-paws": "后肉球"
  };

  var contextMenu = document.querySelector("#contextMenu");
  var menuTitle = document.querySelector('#menuTitle');
  var currentId = '';
  var total = 0;

  // city name text
  var cityTexts = [].map.call(document.querySelectorAll('text.city'), function (ele) { return ele; });
  cityTexts.map(function (cityText) {
    cityText.style.cursor = 'pointer';
    cityText.addEventListener('click', bindContextMenu);
  });

  // city area
  cities.map(function (city) {
    var doms = [].map.call(document.querySelectorAll('[id^=' + city.id + ']'), function (ele) { return ele; });
    doms.map(function (dom) {
      dom.style.fill = '#fff';
      dom.style.cursor = 'pointer';
      dom.addEventListener('click', bindContextMenu);
    });
  });

  // hide context menu
  document.addEventListener('mouseup', closeWhenClickOutside);
  document.addEventListener('touchend', closeWhenClickOutside);

  function closeWhenClickOutside (e) {
    if (!contextMenu === e.target || !contextMenu.contains(e.target)) {
      contextMenu.style.display = 'none';
    }
  }

  // set level
  var levels = [].map.call(document.querySelectorAll("div[id^='lv']"), function (ele) { return ele; });
  levels.map(function (level) {
    level.addEventListener('click', function (e) {
      var lv = parseInt(e.currentTarget.id.replace('lv', ''), 10);
      cities = cities.map(function (city) {
        if (city.id === currentId) {
          return Object.assign({}, city, { lv: lv });
        }
        return city;
      });
      contextMenu.style.display = 'none';
      changeCityColor(lv);
      calcTotal();
    });
  });

  // set name
  var catName = document.querySelector('#cat-name');
  catName.addEventListener('click', function (e) {
    var name = prompt('Name?');
    if (name) {
      document.querySelector('#cat-name > tspan').textContent = name;
      gtag('event', 'set-name', {
        'event_category': 'cat',
        'event_label': name
      });
    }
  });

  // save as png
  document.querySelector('#saveAs').addEventListener('click', function () {
    var svgString = new XMLSerializer().serializeToString(document.querySelector('#map'));
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");

    canvas.width = 1280;
    canvas.height = 720;
    canvg(canvas, svgString);

    var dataUri = canvas.toDataURL("image/png");
    var imageArea = document.querySelector('#image-area');
    switchImageArea();
    imageArea.innerHTML = '<h1>点图存储</h1>';
    imageArea.innerHTML += '<a href="' + dataUri + '" download="cat.png"><img src="' + dataUri + '"></img></a>';
  });

  function switchImageArea() {
    var saveAs = document.querySelector('#saveAs');
    var viewArea = document.querySelector('#view-area');
    var imageArea = document.querySelector('#image-area');

    if ('none' === viewArea.style.display) {
      saveAs.innerText = '生成图片';
      viewArea.style.display = 'block';
      imageArea.style.display = 'none';
    } else {
      saveAs.innerText = '返回编辑';
      viewArea.style.display = 'none';
      imageArea.style.display = 'block';
      cities.map(function (city) {
        gtag('event', 'cat-level', {'body-part': city.id, 'body-part-level': city.lv});
      });
    }
  }

  function bindContextMenu (e) {
    // 180: context menu width, 20: buffer
    // 165: context menu height, 30: buffer
    const widthOffset = window.innerWidth - e.pageX - 180 - 20;
    const heightOffset = window.innerHeight - e.pageY - 165 - 30;
    const x = widthOffset > 0 ? e.pageX : e.pageX + widthOffset;
    const y = heightOffset > 0 ? e.pageY : e.pageY + heightOffset;
    contextMenu.style.top = y + 'px';
    contextMenu.style.left= x + 'px';
    contextMenu.style.display = 'block';
    currentId = (e.target.id || e.target.textContent).replace(/\d*/g, '');
    menuTitle.textContent = translate[currentId];
  }

  function calcTotal () {
    total = 0;
    cities.map(function (city) {
      total += city.lv;
    });
    document.querySelector('#total').textContent= total;
  }

  function changeCityColor (lv) {
    var doms = [].map.call(document.querySelectorAll('[id^=' + currentId + ']'), function (ele) { return ele; });
    doms.map(function (dom) {
      dom.style.fill = colorMap[lv];
    });
  }

  /**
   ** Object assign polyfill
   ** https://github.com/rubennorte/es6-object-assign
   **/

  function assign(target, firstSource) {
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert first argument to object');
    }

    var to = Object(target);
    for (var i = 1; i < arguments.length; i++) {
      var nextSource = arguments[i];
      if (nextSource === undefined || nextSource === null) {
        continue;
      }

      var keysArray = Object.keys(Object(nextSource));
      for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
        var nextKey = keysArray[nextIndex];
        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== undefined && desc.enumerable) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
    return to;
  }

  function polyfill() {
    if (!Object.assign) {
      Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: assign
      });
    }
  }
})();
