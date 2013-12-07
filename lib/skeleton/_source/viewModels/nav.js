var util = require('util');
var handlebars = require('handlebars');

module.exports = function(BaseViewModel) {

  function getParentPage(pages, fileName) {
    var parent = null;
    pages.forEach(function(page) {
      if (page.name === fileName) {
        parent = page;
        return false;
      }
    });
    return parent;
  }

  function NavViewModel() {
    BaseViewModel.apply(this, arguments);
    this.generatePageTree();
    this.data.nav = this.getNav(this.data.pages);
  }

  util.inherits(NavViewModel, BaseViewModel);

  NavViewModel.prototype.generatePageTree = function() {
    this.data.pages.forEach(function(page) {
      if (page.parent) {
        var parentPage = getParentPage(this.data.pages, page.parent);
        if (parentPage) {
          parentPage.children.push(page);
        }
      }
    }.bind(this));
  };

  NavViewModel.prototype.getNav = function(pages, level) {

    level = (level || 0) + 1;
    var html = [];

    html.push('<ul class="level-' + level +'">');
    pages.forEach(function(page) {
      html.push('<li>');
      html.push(handlebars.compile('<a href="{{this.url}}">{{this.title}}</a>')(page));
      if (page.children.length) html.push(this.getNav(page.children, level));
      html.push('</li>');
    }.bind(this));
    html.push('</ul>');

    return html.join('\n');
  };

  return NavViewModel;
};
