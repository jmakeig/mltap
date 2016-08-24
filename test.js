
function test(name, runtime) {
  runtime(new Assert());
}

function Assert() {}
Assert.prototype.end = function(msg) { xdmp.log(msg); }


module.exports = test;