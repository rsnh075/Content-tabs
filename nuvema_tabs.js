
Drupal.behaviors.nuvema_tabs = function(context) {
  var self = Drupal.behaviors.nuvema_tabs;
  if(!self.myTabs){
    self.myTabs = [];
  }

  for (var anchor in Drupal.settings.nuvema_tabs) {
    // find a default tab to start in
    var match = RegExp('[?&]' + anchor.toString() + '-tab=([^&]*)').exec(window.location.search);
    var teh_first = match && decodeURIComponent(match[1].replace(/\+/g, ' '));

    // var exists = self.myTabs[anchor.toString()];
    if (!self.myTabs[anchor.toString()]) {
      self.myTabs[anchor.toString()] = true;
      var newtab = new Drupal.nuvema_tabs(context, Drupal.settings.nuvema_tabs[anchor], teh_first);
    }
  }
};


Drupal.nuvema_tabs = function(context, tab, teh_first) {
  this.tab_selector = tab.tab_selector;
  this.div_selector = tab.div_selector;
  this.items = tab.items;
  this.teh_first = teh_first ? teh_first : null;
  this.is_scrollable = false;

  // is scrollable?
  this.checkScrollable();

  var self = this;
  $(this.tab_selector, context).parents('.nuvema-tabs-inner-wrapper').scroll(function(e){self.handleScroll(e, this)});

  // add click behavior to tabs
  for (var item_key in this.items) {
    if (this.teh_first == null) {
      this.teh_first = item_key;
    }
    var item = this.items[item_key];
    //alert(item.tab);
    this.addClick(context, item_key);

  }
  // and click the first
  if (this.teh_first != null) {
    $(this.items[this.teh_first].tab, context).triggerHandler('click');
  }

  setTimeout(this.checkScrollable.bind(this), 1000);

  $(window).resize(function(e){
    self.checkScrollable();
  });
};

Drupal.nuvema_tabs.prototype.checkScrollable = function() {
    var $nuvema_tabs = $(this.tab_selector);
    if ($nuvema_tabs.parents('.nuvema-tabs-outer-wrapper').length) {
      this.is_scrollable = true;
      this.tabswidth = $nuvema_tabs.width();
      this.tabswidth = $nuvema_tabs.parents('.nuvema-tabs-outer-wrapper').width();
      var offset = $nuvema_tabs.parents('.nuvema-tabs-inner-wrapper').offset();
      this.tabsbase = offset.left;
      // max scroll?
      var old_scroll = $(this.tab_selector).parents('.nuvema-tabs-inner-wrapper').scrollLeft();
      $(this.tab_selector).parents('.nuvema-tabs-inner-wrapper').scrollLeft(1000);
      this.max_scroll = $(this.tab_selector).parents('.nuvema-tabs-inner-wrapper').scrollLeft();
      $(this.tab_selector).parents('.nuvema-tabs-inner-wrapper').scrollLeft(old_scroll);
      this.is_scrollable = (this.max_scroll > 4);
    }
  };

Drupal.nuvema_tabs.prototype.addClick = function(context, item_key) {
  var self = this;
  $(this.items[item_key].div, context).hide();
  $(this.items[item_key].tab, context).click(function(e){self.handleClick(e, this, item_key)});
};

Drupal.nuvema_tabs.prototype.handleClick = function(e, element, item_key) {
  $(this.div_selector + ' > div').hide();
  $(this.items[item_key].div).show();
  $(this.tab_selector + " .active").removeClass("active");
  $(element).parent().addClass("active");
  e.preventDefault();
  // if scrollable try to center the current active
  if (this.is_scrollable) {
    var position = $(element).parent().position();
    var offset = $(element).parent().offset();
    var wit = $(element).parent().width();
    var senter = (this.tabswidth / 2) - (wit / 2);
    var ul_position = $(element).parent().parent().position();

    var the_left = (position.left - ul_position.left);

    $(this.tab_selector).parents('.nuvema-tabs-inner-wrapper').animate({scrollLeft: (the_left - senter)}, 300);
  }
};

Drupal.nuvema_tabs.prototype.handleScroll = function(e, element) {
  if (this.is_scrollable) {
    var $element = $(element);
    var $parent = $element.parent();
    $parent.removeClass('ul-is-links ul-in-midden ul-is-rechts');
    var left = $element.scrollLeft();
    if (left < 4) {
      $parent.addClass('ul-is-links');
    }
    else if (left > (this.max_scroll - 4)) {
      $parent.addClass('ul-is-rechts');
    }
    else {
      $parent.addClass('ul-in-midden');
    }

  }
}