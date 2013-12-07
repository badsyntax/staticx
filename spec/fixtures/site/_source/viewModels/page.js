var util = require('util');

module.exports = function(BaseViewModel) {
  function PageViewModel() {
    BaseViewModel.apply(this, arguments);
  }
  util.inherits(PageViewModel, BaseViewModel);
  return PageViewModel;
};
