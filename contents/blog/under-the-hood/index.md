---
title: Under the Hood
author: shovon
date: 2013-10-01 12:00
template: article.jade
---

In my [last post](http://shovon.github.io/blog/first-post/), I didn't cover much about how this site works. I only went over how sites work *in general*. So I thought I'd go over more about *my* site.

<span class="more"></span>

## Everything is Just Files

Everything on this site, including this blog post, is merely files sitting on a hard drive, on a file server, somewhere.

Of course, it will be a pain in the butt to deal with managing the layout for each page. So to make my life easier, I use [Wintersmith](http://wintersmith.io/).

Whenever I write--say--an HTML file, I won't write out the meta tags and the overal design, for each page. Instead, for simple pages--such as this blog post--I only write the content, but specify *which* layout I want to use, and Wintersmith outputs the correct HTML, with all the headers, footers, and other bells and whistle. Saves me time.

As a bonus point, it runs on Node.js, which is a tool that I'm very familiar with.

## Write Fewer Code for Styles, With LESS

I'm using [LESS](http://lesscss.org/) for the styles.

With it, I can easily load only the styles I need for a given page, on a single HTTP request. Unlike traditional CSS, an `@import` statement *actually* embeds the dependency onto the dependent source code.

Hence, I get CSS that has the content of one or more additional LESS files.

## Concatenated and Minified JavaScript

Just like the stylesheets, every page only loads one `.js` file. I use Devon Govett's [importer](https://github.com/devongovett/importer/) module to manage that. With it, I use C++ style `#include`s to load dependencies. In my code, it pretty much looks like:

```javascript
//import 'some-script.js'
```

No really, it's a JavaScript comment. But hey, it does wonders.

## Conclusion

So it's a static site, but I went the extra mile to make things easier for me to maintain. I also went ahead and ensured that clients don't issue any unnecessary HTTP requests.

Although, my set-up might work for me, but it might be very different for you. You are always welcomed to look at the original site's [source code](https://github.com/shovon/my-site), if you are curious about how everything works.