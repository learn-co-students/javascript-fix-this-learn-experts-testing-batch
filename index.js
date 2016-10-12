var cake = {
  name: "German Chocolate Cake",
  ingredients: ["eggs", "flour", "oil", "chocolate", "sugar", "butter"],
  topping: "coconut frosting",
  bakeTemp: "425 degrees",
  bakeTime: "45 minutes",
  customer: "Tommy",
  decorate: function(updateFunction) { //using an arrow function here will break
    //because the arrow function will scope 'this' to the window instead of the
    //obj.
    var status = "Decorating with " + this.topping + ". Ready to eat soon!"
    updateFunction(status)
    setTimeout(() => {
      //note how you must use brackets around the parameters you want to send
      //in with 'apply'.  If we had used 'call', we could skip this, however
      //spy is looking at apply so we're stuck with this bracket notation.
      updateFunction(serve.apply(this, ["Happy Eating!", this.customer]))
    }, 2000)
  }
}
  // here's the code with the bind() function instead of arrow functions
  // decorate: function(updateFunction) {
  //   var status = "Decorating with " + this.topping + ". Ready to eat soon!"
  //   updateFunction(status)
  //   setTimeout(function() {
  //     updateFunction(serve.apply(this, "Happy Eating!", this.customer))
  //   }.bind(this), 2000)
  // }


var pie = {
  name: "Apple Pie",
  ingredients: ["apples", "flour", "eggs", "butter", "sugar"],
  topping: "streusel",
  bakeTemp: "350 degrees",
  bakeTime: "75 minutes",
  customer: "Tammy"
}


function makeCake() {
  //need to make sure that the updateStatus grabs the correct DOM element
  //called "status" - in this case, need to grab the cake status
  var updateCakeStatus = updateStatus.bind(this);
  updateCakeStatus("Prep"); //now call the bound function.
  cake.decorate; //decorate is a function from inside the cake constructor
  mix.call(cake, updateCakeStatus) //call the mix function (which does not
  //belong to either cake or pie) and pass the updateFunction
}

function makePie() {
  var updatePieStatus = updateStatus.bind(this);
  updatePieStatus("Prep");
  pie.decorate = cake.decorate.bind(pie); //borrow 'decorate' from cake obj.
  mix.call(pie, updatePieStatus)
}

function updateStatus(statusText) {
  this.getElementsByClassName("status")[0].innerText = statusText
}

function bake(updateFunction) { //updateFunction is the updateStatus function being called from the 'call' function calls (could be apply, too)
  var status = "Baking at " + this.bakeTemp + " for " + this.bakeTime
  setTimeout(function() {
    cool.call(this, updateFunction)
    // cool(updateFunction)
  }.bind(this), 2000) //because this is a nested function, we need to bind `this` from the parent.
  updateFunction(status);
}

function mix(updateFunction) {
  var status = "Mixing " + this.ingredients.join(", ")
  setTimeout(function() {
    bake.call(this, updateFunction)
    // bake(updateFunction)
  }.bind(this), 2000)
  updateFunction(status)
}

function cool(updateFunction) {
  var status = "It has to cool! Hands off!"
  setTimeout(function() {
    this.decorate(updateFunction)
  }.bind(this), 2000)
  updateFunction(status);
}

function makeDessert() {
  var node = this.parentNode;
  //depending on which dessert the user wants to make, we need to scope the
  //actions to the correct node - don't want to update cake status instead of
  //pie status!
  (node.id == "cake") ? makeCake.call(node) : makePie.call(node);
}

function serve(message, customer) {
  //you shouldn't need to alter this function
  return(customer + ", your " + this.name + " is ready to eat! " + message)
}

document.addEventListener("DOMContentLoaded", function(event) {
  //you shouldn't need to alter this function
  var cookLinks = document.getElementsByClassName("js-make")
  for(var i=0; i<cookLinks.length; i++) {
    cookLinks[i].addEventListener("click", makeDessert)
  }
});
