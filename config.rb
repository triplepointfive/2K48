configure :development do
  activate :livereload
end

configure :build do
  activate :relative_assets
  activate :minify_css
  # activate :minify_javascript
end
