

var ingredients = [];
var instructions = [];
var ingr_list = document.getElementsByClassName("ingredient-list-item");
var i;
for (i = 0; i < ingr_list.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  ingr_list[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("listdel");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var delword = (this.parentElement.innerHTML).split('<');
    var position = ingredients.indexOf(delword[0]);
    if (~ position) ingredients.splice(position,1);
    var div = this.parentElement;
    div.style.display = "none";
    
  }
}

function newIngredient() {
    var li = document.createElement("li");
    var inputValue = document.getElementById("r-ingr").value;
    ingredients.push(inputValue);
    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (inputValue === '') {
      alert("You must write something!");
    } else {
      document.getElementById("ingr-list-items").appendChild(li);
    }
    document.getElementById("r-ingr").value = " ";
    var attr = document.createAttribute("class");
    attr.value = "ingredient-list-item";
    li.setAttributeNode(attr);
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "listdel";
    span.appendChild(txt);
    li.appendChild(span);
  
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function() {
        var delword = (this.parentElement.innerHTML).split('<');
        var position = ingredients.indexOf(delword[0]);
        if (~ position) ingredients.splice(position,1);
        var div = this.parentElement;
        div.style.display = "none";
      }
    }
  }

  var method_list = document.getElementsByClassName("instruc-list-item");
var i;
for (i = 0; i < method_list.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  method_list[i].appendChild(span);
}

// Click on a close button to hide the current list item
var methoddel = document.getElementsByClassName("methoddel");
var i;
for (i = 0; i < methoddel.length; i++) {
  methoddel[i].onclick = function() {
    var delword = (this.parentElement.innerHTML).split('<');
    var position = instructions.indexOf(delword[0]);
    if (~ position) instructions.splice(position,1);
    var div = this.parentElement;
    div.style.display = "none";
  }
}

function newMethod() {
    var li = document.createElement("li");
    var inputValue = document.getElementById("r-method").value;
    instructions.push(inputValue);
    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (inputValue === '') {
      alert("You must write something!");
    } else {
      document.getElementById("method-list-items").appendChild(li);
    }
    document.getElementById("r-method").value = " ";

    var attr = document.createAttribute("class");
    attr.value = "instruc-list-item";
    li.setAttributeNode(attr);
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "methoddel";
    span.appendChild(txt);
    li.appendChild(span);
  
    for (i = 0; i < methoddel.length; i++) {
      methoddel[i].onclick = function() {
        var delword = (this.parentElement.innerHTML).split('<');
        var position = instructions.indexOf(delword[0]);
        if (~ position) instructions.splice(position,1);
        var div = this.parentElement;
        div.style.display = "none";
      }
    }
  }
var uid = "";
auth.onAuthStateChanged(function(user){
  uid = user.uid;
  console.log(uid);
  
});


document.querySelector("#addrecipeform").addEventListener('submit',(e) =>{
 e.preventDefault();
 var ingrObj = [];
 var  mealtype = $("input[name='meal']:checked").val();
 for (i=0;i<ingr_list.length;i++){
    ingrObj.push({ingr:ingr_list[i].innerHTML.split('<')[0]});
 }
 var methObj = [];
 for (i=0;i<method_list.length;i++){
    methObj.push({inst:method_list[i].innerHTML.split('<')[0]});
 }
 
 var recipename = $("#r-name").val();
  var docData = {
    name : recipename,
    serves : $("#r-serves").val(),
    duration : $("#r-time").val(),
    ingredient : {ingre:ingrObj},
    method : {instruc: methObj},
    favorite : false,
    mealtype : $("input[name='meal']:checked").val()
  };
  
      db.collection(uid).doc(recipename).set(docData).then(function(docref)
      {
        alert("Recipe added to cookbook!");
        document.querySelector("#addrecipeform").reset();
        $("#addmodalclose").trigger("click");
      }).catch(function(error){
        console.log("error in creating document");
      });
})  ;

function deleteRecipe(element){
  console.log(element);
  db.collection(uid).doc(element).delete().then(function() {
    console.log("Document successfully deleted!");
    alert("Recipe successfully deleted!");
    location.reload();

}).catch(function(error) {
    console.error("Error removing document: ", error);
   
});
}

function addToFavorites(element){
  if($("#fav-img").attr('src') === '../images/emptyfavicon@2x.png'){
  db.collection(uid).doc(element).update({favorite:true}).then(function(doc){
    console.log("Document updated successful");
    $("#fav-img").attr("src","../images/favicon@2x.png");
  }).catch(function(error){
    console.log("Error updating document")
  });} else {
    db.collection(uid).doc(element).update({favorite:false}).then(function(doc){
      console.log("Document updated successful");
      $("#fav-img").attr("src","../images/emptyfavicon@2x.png");
    }).catch(function(error){
      console.log("Error updating document")
    });
  }
}

function displayFavorites(){
  var recipelist = [];
  var reciperef = db.collection(uid);
  var query = reciperef.where("favorite","==",true);
  query.get()
  .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          recipelist.push({name:doc.id});
      });
      if (recipelist.length == 0)
      {
          $("#content-right").html("<h5 class=' bluetext fontopensans'>Looks like it's empty. Add more recipes!</h5>");  
          $("#content-ingredients").html("");
          $("#content-method").html("");
      }else{
          $("#content-right").html("<h5 class=' bluetext fontopensans'>Click on a Recipe name to view it</h5>");  
          $("#content-ingredients").html("");
          $("#content-method").html("");
      }
      var source = $("#recipe-list-template").html();
      var template = Handlebars.compile(source);
      var html = template({recipe:recipelist});
      $("#content-left").html(html);  
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  });
}
function singleRecipe(id){
  db.collection(uid).doc(id).get().then(function(docSnapshot){
      var data = docSnapshot.data();
      var ingObj = data.ingredient;
      var methObj = data.method.instruc;
      ingObj = (ingObj.ingre);
      var favimage = data.favorite ? "../images/favicon@2x.png" : "../images/emptyfavicon@2x.png";
      var dataObj = {
          name: data.name,
          serves: data.serves,
          duration: data.duration,
          src: favimage,
          mealtype: data.mealtype
      }
      var source = $("#recipe-detail-template").html();
      var template = Handlebars.compile(source);
      var html = template(dataObj);
      $("#content-right").html(html);
      source = $("#ingredient-template").html();
      template = Handlebars.compile(source);
      html = template({ingObj:ingObj});
      $("#content-ingredients").html(html);
      source = $("#method-template").html();
      template = Handlebars.compile(source);
      html = template({methObj:methObj});
      $("#content-method").html(html);
  });
}

var e_ingredients = [];
var e_instructions = [];
var e_ingr_list = document.getElementsByClassName("e-ingredient-list-item");
var i;
for (i = 0; i < e_ingr_list.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  e_ingr_list[i].appendChild(span);
}

// Click on a close button to hide the current list item
var e_close = document.getElementsByClassName("e-listdel");
var i;
for (i = 0; i < e_close.length; i++) {
  e_close[i].onclick = function() {
    var delword = (this.parentElement.innerHTML).split('<');
        var position = e_ingredients.indexOf(delword[0]);
        if (~ position) e_ingredients.splice(position,1);
        var div = this.parentElement;
        div.remove();
  }
}

function e_fillIngredient(data) {
    var li = document.createElement("li");
    e_ingredients.push(data);
    var t = document.createTextNode(data);
    li.appendChild(t);
      document.getElementById("e-ingr-list-items").appendChild(li);
      var attr = document.createAttribute("class");
    attr.value = "e-ingredient-list-item";
    li.setAttributeNode(attr);
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "e-listdel";
    span.appendChild(txt);
    li.appendChild(span);
    for (i = 0; i < e_close.length; i++) {
      e_close[i].onclick = function() {
        var delword = (this.parentElement.innerHTML).split('<');
        var position = e_ingredients.indexOf(delword[0]);
        if (~ position) e_ingredients.splice(position,1);
        var div = this.parentElement;
        div.remove();
      }
    }
   
  }
var e_method_list = document.getElementsByClassName("e-instruc-list-item");
var i;
for (i = 0; i < e_method_list.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  e_method_list[i].appendChild(span);
}

// Click on a close button to hide the current list item
var e_methoddel = document.getElementsByClassName("e-methoddel");
var i;
for (i = 0; i < e_methoddel.length; i++) {
  e_methoddel[i].onclick = function() {
    var delword = (this.parentElement.innerHTML).split('<');
    var position = e_instructions.indexOf(delword[0]);
    if (~ position) e_instructions.splice(position,1);
    var div = this.parentElement;
    div.remove();
  }
}

function e_fillMethod( data) {
    var li = document.createElement("li");
    e_instructions.push(data);
    var t = document.createTextNode(data);
    li.appendChild(t);
    document.getElementById("e-method-list-items").appendChild(li);  
    var attr = document.createAttribute("class");
    attr.value = "e-instruc-list-item";
    li.setAttributeNode(attr);
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "e-methoddel";
    span.appendChild(txt);
    li.appendChild(span);
  
    for (i = 0; i < e_methoddel.length; i++) {
      e_methoddel[i].onclick = function() {
        var delword = (this.parentElement.innerHTML).split('<');
        var position = e_instructions.indexOf(delword[0]);
        if (~ position) e_instructions.splice(position,1);
        var div = this.parentElement;
        div.remove();
      }
    }
  }
  var fav;
  function editRecipeFn(doc){
    db.collection(uid).doc(doc).get().then(function(docSnapshot){
      var data = docSnapshot.data();
      var ingObj = data.ingredient;
      var methObj = data.method.instruc;
      ingObj = (ingObj.ingre);
      fav = data.favorite;
      var favimage = data.favorite ? "../images/favicon@2x.png" : "../images/emptyfavicon@2x.png";
      var dataObj = {
          name: data.name,
          serves: data.serves,
          duration: data.duration,
          favourite: favimage,
          mealtype: data.mealtype,
          method: methObj,
          ingred: ingObj
      }
      $('#e-name').html(dataObj.name);
      $('#e-serves').val(dataObj.serves);
      $('#e-time').val(dataObj.duration);
      $("input[name='e-meal'][value='"+ dataObj.mealtype + "']").prop('checked', true);
      for (j = 0 ;j < dataObj.ingred.length; j++){
        
          e_fillIngredient(dataObj.ingred[j].ingr);
      }
      for (j = 0 ;j < dataObj.method.length; j++){
        
        e_fillMethod(dataObj.method[j].inst);
    }
     
   
  })}
  document.querySelector("#editrecipeform").addEventListener('submit',(e)=>{
    e.preventDefault();
    var e_ingrObj = [];
    for (i=0;i< e_ingredients.length;i++){
      e_ingrObj.push({ingr: e_ingr_list[i].innerHTML.split('<')[0]});
   }
   console.log(e_ingrObj);
   var e_methObj = [];
   for (i=0;i< e_method_list.length;i++){
     e_methObj.push({inst: e_method_list[i].innerHTML.split('<')[0]});
  }
  var doc = $("#e-name").html()
  var docData = {
    name : doc,
    serves : $("#e-serves").val(),
    duration : $("#e-time").val(),
    ingredient : {ingre:e_ingrObj},
    method : {instruc: e_methObj},
    favorite : fav,
    mealtype : $("input[name='e-meal']:checked").val()
  };
  
      db.collection(uid).doc(doc).set(docData).then(function(docref)
      {
        
        alert("Recipe updated in cookbook!");
        document.querySelector("#editrecipeform").reset();
        $("#editmodalclose").trigger("click");
        singleRecipe(doc);
      }).catch(function(error){
        console.log("error in creating document");
      });
  })

  $("#editmodalclose").click(function(){
    var delitems = document.getElementsByClassName("e-ingredient-list-item");
    var deln = delitems.length
    for (k=0 ;k < deln ;k++)
    {
      delitems[0].remove()
      }
    var delinst = document.getElementsByClassName("e-instruc-list-item");
    var delm = delinst.length
    for (k=0 ;k < delm ;k++)
    {
      delinst[0].remove()
      }
      e_ingredients = [];
      e_instructions = [];
    }
   

  )

$("#a-new-ingr").click(function(){
  var data = $("#e-ingr").val();
  if(data === ' ')
  {
    alert("You must enter something!")
  } else{
    e_fillIngredient(data);
  } 
  document.getElementById("e-ingr").value = " ";

})
$("#a-new-method").click(function(){
  var data = $("#e-method").val();
  if(data === ' ')
  {
    alert("You must enter something!")
  } else{
    e_fillMethod(data);
  } 
  document.getElementById("e-method").value = " ";

})
$("#addmodalclose").click(function(){
  var delitems = document.getElementsByClassName("ingredient-list-item");
    var deln = delitems.length
    for (k=0 ;k < deln ;k++)
    {
      delitems[0].remove()
      }
    var delinst = document.getElementsByClassName("instruc-list-item");
    var delm = delinst.length
    for (k=0 ;k < delm ;k++)
    {
      delinst[0].remove()
      }
  document.querySelector("#addrecipeform").reset()
})