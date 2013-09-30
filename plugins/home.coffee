module.exports = (env, callback) ->

  defaults =
    template: 'home.jade'
    articles: 'blog'
    filename: 'index.html'
    blogPage: '/blog'
    articlesPerPage: 3

  # TODO: use env.utils.extend
  options = env.config.home or {}
  for key, value of defaults
    if defaults.hasOwnProperty key
      options[key] ?= defaults[key]

  options.socials ?= []

  # TODO: move the article retrieval code somewhere else.
  getArticles = (contents) ->
    articles = contents[options.articles]._.directories.map((item) ->
      item.index
    )
    articles.sort (a, b) -> b.date - a.date
    return articles

  class HomePage extends env.plugins.Page

    constructor: (@articles) ->

    getFilename: -> 'index.html'

    getView: -> (env, locals, contents, templates, callback) ->
      template = templates[options.template]
      if not template?
        return callback new Error "unknown template '#{ options.template }'"

      ctx =
        env: env
        contents: contents
        articles: @articles.slice 0, options.articlesPerPage

        # TODO: This should be reviewed.
        articlesPerPage: options.articlesPerPage
        totalArticles: @articles.length

        blogPage: options.blogPage
        socials: options.socials

      env.utils.extend ctx, locals

      template.render ctx, callback

  env.registerGenerator 'home', (contents, callback) ->
    callback null, 'index.page': new HomePage getArticles contents

  callback()