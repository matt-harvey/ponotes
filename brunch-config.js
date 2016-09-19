exports.config = {
  // See http://brunch.io/#documentation for docs.
  npm: {
    styles: {
      'normalize.css': ['normalize.css'],
      'primeui': ['primeui-ng-all.css', 'themes/blitzer/theme.css'],
      'font-awesome': ['css/font-awesome.css']
    }
  },
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^node_modules/,
        'main.js': /^app/
      },
      order: {
        after: [/\.html$/, /\.css$/]
      }
    },
    stylesheets: {
      joinTo: {
        'app.css': /^app/,
        'vendor.css': /^node_modules/
      }
    },
    templates: {
      joinTo: 'main.js'
    }
  },
  plugins: {
    copycat: {
      fonts: ['node_modules/font-awesome/fonts'],
      verbose: true,
      onlyChanged: true
    },
    inlineCss: {
      html: true,
      passthrough: [/^node_modules/, 'app/global.css']
    }
  }
};
