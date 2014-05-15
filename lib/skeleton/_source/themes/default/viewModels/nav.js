var util = require('util');
var handlebars = require('handlebars');
var _ = require('lodash');

/*
 *Pre-compile the list templates.
 */
var listTemplate = handlebars.compile([
  '<ul class="button-group level-{{level}}">',
  '{{{items}}}',
  '</ul>'
].join('\n'));

var listItemTemplate = handlebars.compile([
  '<li>',
  '<a href="/{{this.url}}" class="button">{{this.title}}</a>',
  '{{{this.children}}}',
  '</li>'
].join('\n'));

/**
 * ** Recursively ** render a navigation tree in HTML.
 * @param  {Array}    pages   The array of pages to render.
 * @param  {Integer}  level   The recursion level.
 * @return {Strng}            The full navigation tree in HTML.
 */
function renderNavTree(pages, level) {

  level = (level || 0) + 1;

  var items = pages.map(function(page) {
    return listItemTemplate(_.extend(page, {
      children: renderNavTree(page.children, level)
    }));
  });

  return (items.length) ? listTemplate({
    level: level,
    items: items.join('')
  }) : '';
}

/**
 * ** Recursively ** get all children pages for the specified parent page.
 * @param  {Object} parentPage  The parent page model.
 * @param  {Array} pages        The array of page models.
 * @return {Array}              The children pages array.
 */
function getChildrenPages(parentPage, pages) {
  return pages.filter(function(page) {
    return (page.parent === parentPage.name);
  }).map(function(page) {
    page.children = getChildrenPages(page, pages);
    return page;
  });
}

/**
 * Build a tree of pages. This function accepts a single dimensional array of pages,
 * and converts it into a tree via the page.parent >> parentPage.name relationship.
 * @param  {Array} pages The array of page models.
 * @return {Array}       The page tree array.
 */
function getPageTree(pages) {
  return pages.filter(function(page) {
    if (page.parent) return false;
    return (page.children = getChildrenPages(page, pages));
  });
}

module.exports = function(BaseViewModel) {
  /**
   * The Nav ViewModel
   */
  function NavViewModel() {
    BaseViewModel.apply(this, arguments);

    /* Generate the navigation tree HTML. */
    var pageTree = getPageTree(this.data.pages);
    var navTree = renderNavTree(pageTree);
    this.setData('nav', navTree);
  }

  util.inherits(NavViewModel, BaseViewModel);
  return NavViewModel;
};
