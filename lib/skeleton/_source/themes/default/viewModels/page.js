var util = require('util');

module.exports = function(BaseViewModel) {

  function PageViewModel() {
    BaseViewModel.apply(this, arguments);
  }

  util.inherits(PageViewModel, BaseViewModel);

  PageViewModel.prototype.render = function(done) {
    this.data.page.compileContent(function(err) {
      if (err) throw err;
      BaseViewModel.prototype.render.call(this, done);
    }.bind(this));
  };

  return PageViewModel;
};
