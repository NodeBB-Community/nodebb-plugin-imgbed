/* global env:false */
'use strict';

const winston = require.main.require('winston');
const CacheLRU = require('cache-lru');
const Settings = require.main.require('./src/settings');
const Cache = require.main.require('./src/posts/cache');
const SocketAdmin = require.main.require('./src/socket.io/admin');
const CACHE_SIZE = 3;

const Imgbed = module.exports;

const constants = Object.freeze({
  name: 'Imgbed',
  admin: {
    route: '/plugins/imgbed',
    icon: 'fa-th-large',
    name: 'Imgbed'
  },
  namespace: 'nodebb-plugin-imgbed'
})

var defaultSettings = {
  booleans: {
    hasMarkdown: true
  },
  strings: {
    extensions: 'jpg,jpeg,gif,gifv,png,svg',
    parseMode: 'markdown'
  }
}

let regex
let preString
let embedSyntax
let localCache
let settings

Imgbed.init = function () {
  settings = new Settings('imgbed', '0.2.0', defaultSettings, function () {
    winston.debug('Settings loaded.')
  })
  const userExt = settings.get('strings.extensions')
  const parseMode = settings.get('strings.parseMode')
  winston.debug(`User defined extensions are ${userExt}`)
  winston.debug(`Parse mode is ${parseMode}`)

  let extensionsArr = (userExt && userExt.length > 0)
    ? userExt.split(',')
    : defaultSettings.strings.extensions.split(',')

  extensionsArr = extensionsArr.map(str => str.trim())

  const regexStr = '(?<url>https?:\\/\\/[^\\s]+\\/(?<filename>[\\w_0-9\\-\\.]+\\.(' + extensionsArr.join('|') + '))([^\\s]*)?)'

  switch (parseMode) {
    case 'html':
      preString = 'src\\s*\\=\\s*\\"'
      embedSyntax = '<img src="$<url>" alt="$<filename>" title="$<filename>">'  // eslint-disable-line
      break
    case 'bbcode':
      preString = '\\[img[^\\]]*\\]'
      embedSyntax = '[img alt="$<filename>" title="$<filename>"]$<url>[/img]' // eslint-disable-line
      break
    default: // markdown
      preString = '\\('
      embedSyntax = '![$<filename>]($<url>)'  // eslint-disable-line
      break
  }

  // declare regex as global and case-insensitive
  regex = new RegExp('(?<!' + preString + '\\s*)' + regexStr, 'gi')
  winston.info(`Regex recompiled: ${regexStr}`)
  localCache = new CacheLRU()
  localCache.limit(CACHE_SIZE)
  winston.info(`Cache initialized to size ${CACHE_SIZE}`)
}

Imgbed.parseRaw = async function (content) {
  if (!content) {
    return content;
  }
  let parsedContent = localCache.get(content)
  if (!parsedContent) {
    parsedContent = content.replace(regex, embedSyntax)
    localCache.set(content, parsedContent)
  }

  return parsedContent;
}

Imgbed.parse = async function (data) {
  if (!data || !data.postData) {
    return data;
  }

  data.postData.content = await Imgbed.parseRaw(data.postData.content);
  return data;
}

Imgbed.onLoad = async function (params) {
  const { router } = params;
  const routeHelpers = require.main.require('./src/routes/helpers');

  routeHelpers.setupAdminPageRoute(router, '/admin/plugins/imgbed', function (req, res) {
    res.render('admin/plugins/imgbed', {
      title: 'Imgbed',
    });
  });

  Imgbed.init()
}

SocketAdmin.settings.syncImgbed = function (data) {
  winston.debug('Syncing settings...')
  settings.sync(Imgbed.init)
}

SocketAdmin.settings.clearPostCache = function (data) {
  winston.debug('Clearing all posts from cache')
  Cache.reset()
  // SocketAdmin.emit('admin.settings.postCacheCleared', {});
}

Imgbed.admin = {
  menu: function (customHeader) {
    customHeader.plugins.push({
      route: constants.admin.route,
      icon: constants.admin.icon,
      name: constants.admin.name
    })
    return customHeader;
  }
}

