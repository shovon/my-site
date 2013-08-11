(function ($) {
  "use strict";

  var
  none = { themeName: "" },
  services = {
    "Twitter"   : { themeName: "twitter" },
    "GitHub"    : { themeName: "github" },
    "LinkedIn"  : { themeName: "linkedin" },
    "Google+"   : { themeName: "google-plus" },
    "YouTube"   : { themeName: "youtube" },
    "SoundCloud": { themeName: "soundcloud" },
    "Email"     : { themeName: "email" }
  },
  introNav = $(".intro nav"),
  cursor = $(".intro .cursor"),
  setTheme = (function () {
    var lastTheme = "";
    return function (theme) {
      var $html = $("html");
      $html.removeClass("theme-" + lastTheme);
      $html.addClass("theme-" + theme.themeName);
      lastTheme = theme.themeName;
      // TODO: use CSS instead.
      //$(".intro li a, .intro div").attr("class", "").addClass(theme.foreground);
    };
  }()),
  moveCursor = function (position, width) {
    cursor.css({
      "opacity": "0.5",
      "left": position.left + "px",
      "width": width + "px"
    });
  };

  $(function () {
    $("html").removeClass("preload");

    introNav.mouseleave(function () {
      cursor.css("opacity", "0");
      setTheme(none);
    });

    $(".intro li").mouseenter(function () {
      var
      $this       = $(this),
      serviceName = $this.children().html(),
      serviceStyle = services[serviceName];
      
      setTheme(serviceStyle);
      moveCursor($this.position(), $this.width());
    });

    $("[data-tooltip]").tooltipster({
      delay: 0,
      theme: ".simple-black"
    });
  });
})(window.jQuery);
