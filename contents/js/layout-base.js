(function ($) {
  'use strict';

  $(function () {
    var $footer = $('body > footer');
    var $footerSocial = $footer.find('.social-footer li');
    $footerSocial.tooltipster({
      delay: 0,
      theme: '.tooltip-simple-black-small'
    });

    setFooter();

    $(window).resize(function () {
      setFooter();
    });

    function setFooter() {
      var footerHeight =
        ($footer.hasClass('push-down') && $footer.height()) || 0;

      if (($('body').height() + footerHeight) < $(window).height()) {
        $footer.addClass('push-down');
      } else {
        $footer.removeClass('push-down');
      }
    }
  });

})(window.jQuery);