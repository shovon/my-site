# This is a plugin that injects a list of articles to pages.

module.exports = (env, callback) ->
  defaults =
    articles: 'blog'

  # TODO: find a better config to store the location of all blog posts.
  options = env.config.home or {}
  for key, value of defaults
    if defaults.hasOwnProperty key
      options[key] ?= defaults[key]

  env.getContents (err, contents) ->
    articles = contents[options.articles]._.directories.map (item) ->
      item.index

    articles.sort (a, b) -> b.date - a.date

    env.locals.articles = articles.slice 0, options.articlesPerPage

    callback()