import Handlebars from "handlebars";

Handlebars.registerHelper({
  _isEqualTo: function(v1, v2) {
    return v1 === v2;
  }
});

export default Handlebars;
