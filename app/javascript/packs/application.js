// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("@rails/activestorage").start()
require("channels")

require("bootstrap")
require("awesomplete")


// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)

window.onload = function () {
  var player_value = document.getElementsByClassName("pa-value");
  var max;
  var min = 3
  var arr = [];

  for (var v_index = 0,td_length = player_value.length; v_index < td_length; v_index++)
  {
    arr[arr.length] = player_value[v_index].innerHTML;
  }

  max = Math.max.apply(null, arr);
  min = Math.min.apply(null, arr);

  for (var v_index = 0,td_length = player_value.length; v_index < td_length; v_index++)
  {
    var item_value = player_value[v_index].innerHTML
    let c = getColorByNumber(item_value,max,min)
    player_value[v_index].style.backgroundColor = c;
  }


  function rgbaToHex(color) {
      var values = color
        .replace(/rgba?\(/, '')
        .replace(/\)/, '')
        .replace(/[\s+]/g, '')
        .split(',');
      var a = parseFloat(values[3] || 1),
        r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
        g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
        b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);

      return "#" +
        ("0" + r.toString(16)).slice(-2) +
        ("0" + g.toString(16)).slice(-2) +
        ("0" + b.toString(16)).slice(-2);
  }

  function getColorByNumber(n, max, min) {

      var r = 255;
      var g = 255;
      var b = 255;

    if(n < 0) {
      var one = (-1 * n)/( -1 * min);
      r = 255;
      g = 255 - (255 * one);
      b = 255 - (255 * one);
    }

    if(n > 0) {
      var two = n/max;
      r = 255 - (255 * two);
      g = 255;
      b = 255 - (255 * two);
    }

      r = parseInt(r);// 取整
      g = parseInt(g);// 取整
      b = parseInt(b);// 取整

      return rgbaToHex("rgb(" + r + "," + g + "," + b + ")");
  }
}
