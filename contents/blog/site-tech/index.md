---
title: Under the Hood
author: shovon
date: 2013-10-01 12:00
template: article.jade
---

In my last post, I didn't really cover much as to how this site works. I only went over how sites work in general. So I thought I'd go over more about my site, in particular.

<span class="more"></span>

Like I said in my last post, this site is entirely static, and hence, even this blog post is merely an HTML file on a remote server. Absolutely, no databases involved.

However, each page isn't hand-built from scratch. Instead, they "extend" from a template. I only fill out the content, and the page's layout is handled automatically. This is thanks, entirely to a tool called a "static site generator."

To be exact, I use Wintersmith. So far, I'm liking it a lot more than Jekyll, which is also a static site generator. It's very minimalistic. It doesn't make any distinction between what a post is, what a page is, or what type of file it's dealing with; they're all the same no matter what. Unless, you tell otherwise.

Not only does Wintersmith take files and output almost the same thing, you can extend the site generator, using plugins. You write them in the same manner you would if you were to write any other Node.js module.

## Conclusion

I am a huge fan of Wintersmith. Of course, I'm not going to say it's the best. Not because it's bad; on the contrary, it's actually a very robust tool. However, it might not cater to everyone's needs. You can't simply switch between themese using Wintersmith, since custom templates, along with plugins, are an integral part of the whole system.