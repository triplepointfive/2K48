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
  activate :asset_hash
end
