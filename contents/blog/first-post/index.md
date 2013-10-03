---
title: First Post
author: shovon
date: 2013-09-15 10:56
template: article.jade
---

This is my first post on a static website. I'm not using WordPress, nor Tumblr, or anything else. Purely a static site, so there are hardly any work done on the back-end. Whatever data you get sent to you, is merely files stored on a remote server. Where as on other sites, posts are stored as database entries.

<span class="more"></span>

For the latter types of sites, a back-end takes those entries, generates the HTML file, and sends the data to the client that requested the article.

Now, which is faster?

Depends. For WordPress-like sites, a user will request for an article via a specific route, such as `/blog/some-article`. The server will then have to parse the given route, and match it against a specific database entry that has a shortname of `some-article`.

Once the server has retrieved the article from the database, it will then embed the article in an HTML template. Once done that, the server will then send the data back to the user.

So to summarize:

- user requests for a page given a route, say at `/blog/some-article`
- the server will parse the route and try and determine what part of the route represents the unique ID for a given database entry. We'll say that it has determined `some-article` as the unique ID
- the server will then make a database query for the article that has the ID of `some-article`
- once found, the server will then take the article, and embed it onto an HTML template
- once the HTML has been generated, the server will send it to the client that requested the data

It's different for static sites.

When a user requests for an article, say at `/blog/some-article`, the server will look for a `/blog/some-article` file. If it isn't found, then it will look for a `/blog/some-article/index.html` file. If found, the server will send the contents of that file. Otherwise, it will send a different file, along with an HTTP status code of 404.

In either scenario, the speed at which the request gets processed depends entirely on the machine they are run on, and the server-software that are running it.

Is my site faster? I don't know, since I haven't benchmarked it yet.

So anyways, that's my intro.