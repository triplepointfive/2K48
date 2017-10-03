activate :external_pipeline,
         name: :webpack,
         command: build? ?  "yarn run build" : "yarn run start",
         source: ".tmp/dist",
         latency: 1

set :css_dir, 'assets/stylesheets'
set :js_dir, 'assets/javascript'

configure :development do
  activate :livereload
end

configure :build do
  activate :relative_assets

  activate :external_pipeline,
    name: :webpack,
    command: build? ?
    './node_modules/webpack/bin/webpack.js --bail -p' :
    './node_modules/webpack/bin/webpack.js --watch -d --progress --color',
    source: '.tmp/dist',
    latency: 1
end
