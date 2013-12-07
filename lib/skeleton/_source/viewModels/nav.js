var util = require('util');

module.exports = function(BaseViewModel) {

  function NavViewModel() {
    BaseViewModel.apply(this, arguments);
  }

  util.inherits(NavViewModel, BaseViewModel);

  NavViewModel.prototype.renderSync = function(done) {
    return BaseViewModel.prototype.renderSync.call(this, done);
  };

  return NavViewModel;
};