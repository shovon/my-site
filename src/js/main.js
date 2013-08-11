(function ($) {
  "use strict";

  var
  none = { themeName: "" },
  services = {
    //"Twitter"   : { background: "#0096ff", foreground: "white" },
    "Twitter"   : { themeName: "twitter" },
    //"GitHub"    : { background: "#242424", foreground: "white" },
    "GitHub"    : { themeName: "github" },
    //"LinkedIn"  : { background: "#367da6", foreground: "white" },
    "LinkedIn"  : { themeName: "linkedin" },
    //"Google+"   : { background: "#00bc66", foreground: "white" },
    "Google+"   : { themeName: "google-plus" },
    //"YouTube"   : { background: "#942424", foreground: "white" },
    "YouTube"   : { themeName: "youtube" },
    //"SoundCloud": { background: "#ff6600", foreground: "white" },
    "SoundCloud": { themeName: "soundcloud" },
    //"Email"     : { background: "#778b93", foreground: "white" }
    "Email"     : { themeName: "email" }
  },
  introNav = $(".intro nav"),
  cursor = $(".intro div"),
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
