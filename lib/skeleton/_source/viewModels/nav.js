var util = require('util');
var handlebars = require('handlebars');
var _ = require('lodash');

var listTemplate = handlebars.compile([
  '<ul class="level-{{level}}">',
  '{{{items}}}',
  '</ul>'
].join('\n'));

var listItemTemplate = handlebars.compile([
  '<li>',
  '<a href="/{{this.url}}">{{this.title}}</a>',
  '{{{this.children}}}',
  '</li>'
].join('\n'));

function getParentPage(pages, fileName) {
  return _.find(pages, function(page) {
    if (page.name === fileName) {
      return true;
    }
    if (page.children) {
      return getParentPage(page.children, fileName);
    }
    return false;
  });
}

function getNavTree(pages, level) {

  var items = pages.map(function(page) {
    page.children = (page.children.length) ? getNavTree(page.children, level) : '';
    return listItemTemplate(page);
  }.bind(this)).join('');

  return (items) ? listTemplate({
    level: (level || 0) + 1,
    items: items
  }) : '';
}

function getPageTree(pages) {
  var pageTree = [];
  var parentPage;
  pages.forEach(function(page) {
    if (!page.parent) {
      pageTree.push(page);
    } else {
      if (parentPage = getParentPage(pageTree, page.parent)) {
        parentPage.children.push(page);
      }
    }
  });
  return pageTree;
}

module.exports = function(BaseViewModel) {

  function NavViewModel() {
    BaseViewModel.apply(this, arguments);
    this.setData('nav', getNavTree(getPageTree(this.data.pages)));
  }

  util.inherits(NavViewModel, BaseViewModel);

  return NavViewModel;
};
