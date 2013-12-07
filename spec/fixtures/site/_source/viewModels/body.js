var util = require('util');

module.exports = function(BaseViewModel) {
  function BodyViewModel() {
    BaseViewModel.apply(this, arguments);
    this.data.content = 'BODY';
  }
  util.inherits(BodyViewModel, BaseViewModel);
  return BodyViewModel;
};
