var font_col = document.querySelector('.font_col');
var font_sty = document.querySelector('.font_sty');
var font_fam = document.querySelector('.font_fam');
var scale = document.querySelector(".scale");

var wor = document.querySelector('.workarea');
font_col.onchange = function () {
  setFontColor(font_col)
}
// font_sty.onchange = function () {
//   setFontStyle(font_sty)
// }
font_fam.onchange = function () {
  setFontFamily(font_fam)
}


function setFontColor(obj) {
  document.execCommand("forecolor", false, obj.value);
}

// function setFontStyle(obj) {
//   document.execCommand(obj.value, false, null);
// }

function setFontFamily(obj) {
  document.execCommand("fontname", false, obj.value);
}
// 调整字体大小
function setFontSize() {
  var oAdd = document.getElementById("add"),
    oDel = document.getElementById("del"),
    oBox = document.getElementById("editableText"),
    size = 14;

  oAdd.onclick = function () {
    //size = size + 1;
    //size += 1;
    size++;
    if (size > 26) {
      alert("瓜皮,不能再调皮咯!");
      size = 26;
    };
    oBox.style.fontSize = size + "px";
  };
  oDel.onclick = function () {
    // size = size - 1;
    // size -= 1;
    size--;
    if (size < 10) {
      alert("瓜皮,不能再调皮咯!");
      size = 10;
    }
    oBox.style.fontSize = size + "px";
  };
}
setFontSize()

// 上传文字
addfont()
var tflag = 1;
let textList = {
  "elements": []
};

function addfont() {
  $('.fbtn').click(function () {
    if ($('#editableText').text().length !== 0) {
      if ($('font').text().length) {
        // console.log($('#editableText').css('font-size'));
        $('<div>', {
          class: 'textbox',
          id: 'textbox' + tflag,
          text: $('#editableText').text(),
          style: 'color:' + $('font')[0].color + ';' + 'font-family:' + $('font')[0].face + ';' +
            'font-size:' + $('#editableText').css('font-size') + ';'
        }).appendTo('.workarea');
        var text = $('#editableText').text();
        var fsize = $('#editableText').css('font-size');
        var fcolor = $('font')[0].color;
        var ffamily = $('font')[0].face;
        var tbox = document.querySelector('.workarea')
        var tpre = document.querySelector('#textbox' + tflag);
        movefont(tpre, tbox)
        showTextData(text, tflag, fsize, fcolor, ffamily)
      } else {
        $('<div>', {
          class: 'textbox',
          id: 'textbox' + tflag,
          text: $('#editableText').text(),
          style: 'font-size:' + $('#editableText').css('font-size') + ';'
        }).appendTo('.workarea');
        var text = $('#editableText').text();
        var fsize = $('#editableText').css('font-size');
        var fcolor = '#000';
        var ffamily = 'Microsoft Yahei'
        var tbox = document.querySelector('.workarea')
        var tpre = document.querySelector('#textbox' + tflag);
        movefont(tpre, tbox)
        showTextData(text, tflag, fsize, fcolor, ffamily)
      }
    } else {
      alert("内容不能为空")
    }
  })
}

// 上传文字数据
function showTextData(text, i, size, color, family) {
  var text_id = i;
  textList.elements.push({
    "id": text_id,
    'text': text,
    'color': color,
    'family': family,
    'text_size': size,
    "constraints": {
      "top": {
        "percentage": 0
      },
      "left": {
        "percentage": 0
      }
    }
  })
  // console.log(textList.elements)
  tflag++
}

// 拖拽文字
function movefont(box, fa, scale) {
  // box是装文字的容器,fa是文字移动缩放的范围,scale是控制缩放的小图标
  // 图片移动效果
  box.onmousedown = function (ev) {
    var oEvent = ev;
    // 浏览器有一些图片的默认事件,这里要阻止
    oEvent.preventDefault();
    var disX = oEvent.clientX - box.offsetLeft;
    var disY = oEvent.clientY - box.offsetTop;
    box.onmousemove = function (ev) {
      oEvent = ev;
      oEvent.preventDefault();
      var x = oEvent.clientX - disX;
      var y = oEvent.clientY - disY;

      box_width = parseFloat(window.getComputedStyle(box).width);
      box_height = parseFloat(window.getComputedStyle(box).height);

      // 图形移动的边界判断
      x = x <= 0 ? 0 : x;
      x = x >= fa.clientWidth - box_width - 2 ? fa.offsetWidth - box_width - 2 : x;
      y = y <= 0 ? 0 : y;
      y = y >= fa.clientHeight - box_height - 2 ? fa.offsetHeight - box_height - 2 : y;
      box.style.left = x + 'px';
      box.style.top = y + 'px';
    }
    // 图形移出父盒子取消移动事件,防止移动过快触发鼠标移出事件,导致鼠标弹起事件失效
    box.onmouseleave = function () {
      box.onmousemove = null;
      box.onmouseup = null;
    }
    // 鼠标弹起后停止移动
    $('.textbox').each((i, e) => {
      e.onmouseup = function () {
        var top_spacing = $(e).position().top;
        var left_spacing = $(e).position().left;


        var nowfileData_constraints = textList.elements[i].constraints;
        nowfileData_constraints.top.percentage = top_spacing;
        nowfileData_constraints.left.percentage = left_spacing;

        // console.log(textList.elements);
        e.onmousemove = null;
        e.onmouseup = null;
      }
    })
  }
}


//上传文件
var flag = 0;
var pre_width = '';
var pre_height = '';
let fileList = {
  "elements": []
};
$('#uploadfile').off().change(function () {
  $('<div>', {
    class: 'prebox',
    id: 'prebox' + (flag + 1)
  }).appendTo('.workarea');
  $('<img>', {
    class: 'preview',
    id: 'preview' + (flag + 1),
    src: ''
  }).appendTo('#prebox' + (flag + 1));
  $('<div>', {
    class: 'scale',
    id: 'scale' + (flag + 1),
  }).appendTo('#prebox' + (flag + 1));

  var file = this.files[0];
  // 第一次上传文件数据
  showFileData(file, flag);

  var reader = new FileReader(); //获取一个FileReader类
  //获取用户选择的文件
  reader.onload = function (e) {
    newimg = $($("img")[$("img").length - 1]);
    newimg.attr("src", reader.result);
    var box = document.querySelector('#prebox' + flag)
    var pre = document.querySelector('#preview' + flag);
    var scale = document.querySelector("#scale" + flag);
    var image = new Image();
    image.onload = function () {
      pre_width = image.width;
      pre_height = image.height;
      dragimg(wor, box, pre, scale, file);
    }
    image.src = reader.result;
    fileList.elements[flag - 1].filesrc = image.src;
    // fileList.elements[flag - 1].constraints.height = $(box).height();
    // console.log(fileList.elements)
  }

  reader.readAsDataURL(file);

})

function showFileData(file, i) {

  var file_id = i,
    file_type = file.type,
    file_name = file.name,
    percentage_t = 0,
    file_height = 333,
    percentage_r = 187.5,
    percentage_l = 0;
  fileList.elements.push({
    "id": file_id,
    "type": file_type,
    "imageName": file_name,
    "filesrc": '1',

    "constraints": {
      "top": {
        "percentage": percentage_t
      },
      "height": {
        "percentage": file_height
      },
      "width": {
        "percentage": 187.5
      },
      "right": {
        "percentage": percentage_r
      },
      "left": {
        "percentage": percentage_l
      }
    }
  })
  console.log(fileList.elements[0].constraints.height)
  console.log(fileList.elements)
  flag++;
}



function dragimg(fa, box, ele, scale, file) {
  // box是装图片的容器,fa是图片移动缩放的范围,scale是控制缩放的小图标
  // 图片移动效果
  box.onmousedown = function (ev) {
    var oEvent = ev;
    // 浏览器有一些图片的默认事件,这里要阻止
    oEvent.preventDefault();
    var disX = oEvent.clientX - box.offsetLeft;
    var disY = oEvent.clientY - box.offsetTop;
    box.onmousemove = function (ev) {
      oEvent = ev;
      oEvent.preventDefault();
      var x = oEvent.clientX - disX;
      var y = oEvent.clientY - disY;

      box_width = parseFloat(window.getComputedStyle(box).width);
      box_height = parseFloat(window.getComputedStyle(box).height);

      // 图形移动的边界判断
      x = x <= 0 ? 0 : x;
      x = x >= fa.clientWidth - box_width - 2 ? fa.offsetWidth - box_width - 2 : x;
      y = y <= 0 ? 0 : y;
      y = y >= fa.clientHeight - box_height - 3 ? fa.offsetHeight - box_height - 3 : y;
      box.style.left = x + 'px';
      box.style.top = y + 'px';
    }
    // 图形移出父盒子取消移动事件,防止移动过快触发鼠标移出事件,导致鼠标弹起事件失效
    box.onmouseleave = function () {
      box.onmousemove = null;
      box.onmouseup = null;
    }
    // 鼠标弹起后停止移动
    $('.prebox').each((i, e) => {
      e.onmouseup = function () {
        // console.log(e);
        // console.log(i);
        var top_spacing = $(e).position().top;
        var left_spacing = $(e).position().left;
        var right_spacing = fa.clientWidth - left_spacing - $(e).width();

        var nowfileData_constraints = fileList.elements[i].constraints;
        nowfileData_constraints.top.percentage = top_spacing;
        nowfileData_constraints.left.percentage = left_spacing;
        nowfileData_constraints.right.percentage = right_spacing;
        nowfileData_constraints.height.percentage = $(e).height();
        nowfileData_constraints.width.percentage = $(e).width();

        // console.log(fileList.elements);
        // console.log(nowfileData_constraints);
        e.onmousemove = null;
        e.onmouseup = null;
      }
    })
  }
  // 图片缩放效果
  $('.scale').each((idx, ele) => {
    ele.onmousedown = function (e) {
      // 阻止冒泡,避免缩放时触发移动事件
      e.stopPropagation();
      e.preventDefault();

      var pos = {
        'w': $(ele).parent().width(),
        'h': $(ele).parent().height(),
        'x': e.clientX,
        'y': e.clientY
      };
      fa.onmousemove = function (ev) {
        ev.preventDefault();
        // 设置图片的最小缩放为30*30
        var w = Math.max(30, ev.clientX - pos.x + pos.w)
        var h = Math.max(30, ev.clientY - pos.y + pos.h)

        // 设置图片的最大宽高
        w = w >= 375 ? 375 : w
        h = h >= 667 ? 667 : h
        $(ele).parent().width(w)
        $(ele).parent().height(h)
        // console.log(box.offsetWidth,box.offsetHeight)
      }
      fa.onmouseleave = function () {
        fa.onmousemove = null;
        fa.onmouseup = null;
      }
      fa.onmouseup = function () {
        var nowfileData_constraints = fileList.elements[idx].constraints;
        nowfileData_constraints.height.percentage = $(ele).parent().height();
        nowfileData_constraints.width.percentage = $(ele).parent().width();
        fa.onmousemove = null;
        fa.onmouseup = null;
        console.log($(ele).parent().height())
        // console.log(nowfileData_constraints.height);
        // console.log(fileList.elements);
      }
    }
  })
}

// 提交操作后的数据
let Datastore = {
  "DataList": []
};

function commitData() {
  $('.com_btn').click(() => {
    Datastore.DataList.push(fileList, textList)
    // console.log(Datastore.DataList)
    // console.log(fileList.elements[0].constraints.height);
    sessionStorage.setItem("allJson", JSON.stringify(Datastore)); //将获取到的json字符串，保存到键为allJson中。
    window.location.href = 'view.html'
  })
}

// 提交数据
commitData()