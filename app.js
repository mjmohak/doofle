var uObj;
var ustr = "";
var str = "";
var oReq;
var index = 0,
  index2 = 0;
var answer = [];
var questionIds = [];
var questions = [];
var keywords = [];
var keySearch = "";
var qids = "";
var cat = "";
var inp = document.getElementById("qw");
inp.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    document.getElementById("mu").click();
    cat = "" + document.getElementById("category").value;
    console.log(cat);
    var parent = document.getElementById("content");
    while (parent.hasChildNodes()) {
      parent.removeChild(parent.firstChild);
    }
    parent.setAttribute("style", "display: none");
    document.getElementById("alpha").setAttribute("style", "display: none");
    parent = document.getElementById("video");
    while (parent.hasChildNodes()) {
      parent.removeChild(parent.firstChild);
    }
    parent.setAttribute("style", "display: none");
    ustr = "";
    str = "";
    (index = 0), (index2 = 0);
    answer = [];
    questionIds = [];
    questions = [];
    keywords = [];
    keySearch = "";
    qids = "";
    document.getElementById("but").click();
  }
});
function search() {
  str = document.getElementById("qw").value;
  console.log(str);
  console.log(cat);
  if (cat == "first") {
    console.log("aa");
    oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open(
      "POST",
      `https://apis.paralleldots.com/v3/keywords?api_key=YOUR-API-KEY&text=${str}`
    );
    oReq.send();
  } else {
    let s = str.replace(/ /g, "+");
    oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener4);
    oReq.open(
      "GET",
      `https://api.edamam.com/search?q=${s}&app_id=07ebeb3d&app_key=YOUR-API-KEY`
    );
    oReq.send();
    var str1 = "how+to+cook+" + s;
    var uoReq = new XMLHttpRequest();
    uoReq.open(
      "GET",
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${str1}&maxResults=10&type=video&videoCaption=closedCaption&key=YOUR-API-KEY`
    );
    console.log(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${str1}&maxResults=10&type=video&videoCaption=closedCaption&key=YOUR-API-KEY`
    );
    // uoReq.open(
    //   "GET",
    //   `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${str1}&maxResults=10&type=video&key=YOUR-API-KEY`
    // );
    var z = uoReq.addEventListener("load", ureqListener);
    uoReq.send();
  }
}
function reqListener() {
  var obj = JSON.parse(this.responseText);
  console.log(obj);
  let i;
  for (i in obj.keywords) {
    keywords[i] = obj.keywords[i].keyword;
    keySearch = "[" + keywords[i].replace(/ /g, "-") + "];";
    // ustr = ustr + keywords[i].replace(/ /g, "+") + "+";
  }
  ustr = str.replace(/ /g, "+");
  // ustr = ustr.substring(0, ustr.length - 1);
  var uoReq = new XMLHttpRequest();
  uoReq.open(
    "GET",
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${ustr}&maxResults=10&type=video&videoCaption=closedCaption&key=YOUR-API-KEY`
  );
  var z = uoReq.addEventListener("load", ureqListener);
  uoReq.send();

  oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener1);
  oReq.open(
    "GET",
    `https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=relevance&q=${str}&site=stackoverflow`
  );
  oReq.send();
}
function reqListener1() {
  var obj = JSON.parse(this.responseText);
  console.log(obj);
  let i;
  for (i in obj.items) {
    if (index2 >= 5) break;
    if (obj.items[i].is_answered === true) {
      questionIds[index2] = obj.items[i].question_id;
      questions[index2] = obj.items[i].title;
      console.log(questions[index2]);
      index2++;
    }
  }
  oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener2);
  oReq.open(
    "GET",
    `https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=relevance&q=${keySearch}&site=stackoverflow`
  );
  oReq.send();
}
function reqListener2() {
  var obj = JSON.parse(this.responseText);
  console.log(obj);
  let i;
  for (i in obj.items) {
    if (index2 >= 10) break;
    let check = -1;
    for (let j = 0; j < index2; j++) {
      if (questionIds[j] == obj.items[i].question_id) {
        check = 1;
        break;
      }
    }
    if (obj.items[i].is_answered === true && check == -1) {
      questionIds[index2] = obj.items[i].question_id;
      questions[index2] = obj.items[i].title;
      console.log(questions[index2]);
      index2++;
    }
  }
  for (i = 0; i < index2; i++) {
    qids = qids + questionIds[i] + ";";
  }
  qids = qids.substring(0, qids.length - 1);
  console.log(qids);
  var oReq1 = new XMLHttpRequest();
  oReq1.addEventListener("load", reqListener3);
  oReq1.open(
    "GET",
    `https://api.stackexchange.com/2.2/questions/${qids}?order=desc&sort=votes&site=stackoverflow&filter=!-y(KwOdKR5Ga7mmruVArx2SJykc-M)3jKiDQBk1fq`
  );
  oReq1.send();
}
function reqListener3() {
  var obj = JSON.parse(this.responseText);
  console.log(obj);
  let i;
  for (i in obj.items) {
    let quid = obj.items[i].question_id;
    let j;
    for (j = 0; j < index2; j++) {
      if (quid == questionIds[j]) {
        answer[j] = obj.items[i].answers[0].body;
        break;
      }
    }
  }
  var parent = document.getElementById("content");
  parent.setAttribute("style", "display:block");
  for (i = 0; i < index2 - 1; i++) {
    var newDiv = document.createElement("div");
    var newSpan1 = document.createElement("div");
    newSpan1.setAttribute("class", "quesTitle");
    var newSpan2 = document.createElement("div");
    newSpan2.setAttribute("class", "ansBody");
    newSpan1.innerHTML = "Ques. : " + questions[i];
    newSpan2.innerHTML = "Answer :\n" + answer[i];
    newDiv.appendChild(newSpan1);
    newDiv.appendChild(document.createElement("br"));
    newDiv.appendChild(newSpan2);
    parent.appendChild(newDiv);
    parent.appendChild(document.createElement("br"));
    parent.appendChild(document.createElement("hr"));
    parent.appendChild(document.createElement("br"));
  }
  var newDiv = document.createElement("div");
  var newSpan1 = document.createElement("div");
  newSpan1.setAttribute("class", "quesTitle");
  var newSpan2 = document.createElement("div");
  newSpan2.setAttribute("class", "ansBody");
  newSpan1.innerHTML = "Ques. : " + questions[i];
  newSpan2.innerHTML = "Answer :\n" + answer[i];
  newDiv.appendChild(newSpan1);
  newDiv.appendChild(document.createElement("br"));
  newDiv.appendChild(newSpan2);
  parent.appendChild(newDiv);
  let beta = document.getElementById("alpha");
  beta.setAttribute("style", "display:block");
  let b = document.getElementById("video");
  b.setAttribute("style", "display:block");
  for (i = 0; i < 10; i++) {
    let x = uObj.items[i].id.videoId;
    //console.log(Obj.items[0].id.videoId)
    let d = document.createElement("div");
    d.setAttribute("class", "vidcon");
    let h = document.createElement("h5");
    h.setAttribute("class", "videotitle");
    h.innerHTML = uObj.items[i].snippet.title;
    let a = document.createElement("iframe");
    //a.setAttribute("width","560")
    //a.setAttribute("height","315")
    a.setAttribute("class", "embedvideo");
    a.setAttribute("src", `https://www.youtube.com/embed/${x}`);
    a.setAttribute("frameborder", "0");
    a.setAttribute("allow", "autoplay;encrypted-media");
    a.setAttribute("allowfullscreen", "true");
    d.append(h);
    d.append(a);
    b.append(d);
    b.append(document.createElement("br"));
  }
  document.getElementById("md").click();
}
function reqListener4() {
  var obj = JSON.parse(this.responseText);
  //console.log(obj);
  var parent = document.getElementById("content");
  parent.setAttribute("style", "display:block");
  var newDiv = document.createElement("div");
  let i;
  for (i in obj.hits) {
    if (i >= 10) break;
    var head = document.createElement("h3");
    var div1 = document.createElement("div");
    div1.setAttribute("class", "recipe");
    var url = document.createElement("a");
    url.setAttribute("href", "" + obj.hits[i].recipe.url);
    url.setAttribute("target", "_blank");
    url.setAttribute("class", "toview");
    url.setAttribute("style", "color:blue");
    url.innerText = "View Recipe";
    var div2 = document.createElement("div");
    div2.setAttribute("class", "image");
    var img = document.createElement("img");
    img.setAttribute("class", "pic");
    img.setAttribute("src", "" + obj.hits[i].recipe.image);
    //console.log(img);
    var ul = document.createElement("ul");
    head.innerHTML = obj.hits[i].recipe.label;
    head.setAttribute("class", "quesTitle");
    let j;
    for (j in obj.hits[i].recipe.ingredients) {
      var li = document.createElement("li");
      li.innerHTML = obj.hits[i].recipe.ingredients[j].text;
      //console.log(li);
      ul.appendChild(li);
    }
    var combinedDiv = document.createElement("div");

    div2.appendChild(img);
    //div1.appendChild(head);
    div1.appendChild(ul);
    div1.appendChild(url);
    combinedDiv.appendChild(div1);
    combinedDiv.appendChild(div2);
    combinedDiv.setAttribute("class", "ansBody");
    console.log(combinedDiv);
    newDiv.appendChild(head);
    newDiv.appendChild(combinedDiv);
    parent.appendChild(newDiv);
    // parent.appendChild(document.createElement("hr"));
    // parent.appendChild(document.createElement("br"));
  }
  let beta = document.getElementById("alpha");
  beta.setAttribute("style", "display:block");
  let b = document.getElementById("video");
  b.setAttribute("style", "display:block");
  for (i = 0; i < 10; i++) {
    let x = uObj.items[i].id.videoId;
    //console.log(Obj.items[0].id.videoId)
    let d = document.createElement("div");
    d.setAttribute("class", "vidcon");
    let h = document.createElement("h5");
    h.setAttribute("class", "videotitle");
    h.innerHTML = uObj.items[i].snippet.title;
    let a = document.createElement("iframe");
    //a.setAttribute("width","560")
    //a.setAttribute("height","315")
    a.setAttribute("class", "embedvideo");
    a.setAttribute("src", `https://www.youtube.com/embed/${x}`);
    a.setAttribute("frameborder", "0");
    a.setAttribute("allow", "autoplay;encrypted-media");
    a.setAttribute("allowfullscreen", "true");
    d.append(h);
    d.append(a);
    b.append(d);
    b.append(document.createElement("br"));
  }
  document.getElementById("md").click();
}

//
//

function ureqListener() {
  //console.log('herev also')
  //console.log(this.responseText);
  uObj = JSON.parse(this.responseText);
}
