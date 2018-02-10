'use strict';

// База
var gulp = require('gulp');
var rename = require('gulp-rename');
var del = require('del');
var run = require('run-sequence');
var pump = require('pump');

// Post-css и его плагины
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

// Post-html и его плагины
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');

// Оптимизация кода
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var htmlmin = require('gulp-htmlmin');
var minify = require('gulp-csso');
var uglify = require('gulp-uglify');
var svgstore = require('gulp-svgstore');
var cheerio = require('gulp-cheerio');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');

// Оптимизация изображений
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');

// Сервер
var server = require('browser-sync').create();

// Копирует все нужные файлы в билд кроме css и html (этим занимаются отдельные таски)
gulp.task('copy', function () {
  return gulp.src([
    'source/fonts/**.{woff,woff2}',
    'source/img/**/*',
    'source/js/**'
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'));
});

// Сборка и минификация стилей для продакшена
gulp.task('style', function() {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    // .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

// Минификация html для продакшена
gulp.task('html', function () {
  return gulp.src('source/*.html')
    .pipe(posthtml([
      include()
    ]))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'))
    .pipe(server.stream());
});

// Минификация и конкатенация js для продакшена
gulp.task('jsOptimization', function (cd) {
  pump([gulp.src('source/js/*.js'),
      sourcemaps.init(),
      uglify(),
      concat('all.js'),
      sourcemaps.write(),
      gulp.dest('build/js')],
    server.stream(), cd);
});

// Создание и оптимизация изображений webp
gulp.task('webp', function () {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest('build/img'));
});

// Готовим svg-спрайт (без атрибутов)
gulp.task('spriteSvg', function () {
  return gulp.src('source/img/icon-*.svg')
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style').remove();
      },
      parserOptions: {xmlMode: true}
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
});

// Очистка папки билд
gulp.task('clean', function () {
  return del('build');
});

// Запус сервера продакшена
gulp.task('serve', function() {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.{scss,sass}', ['style']);
  gulp.watch('source/*.html', ['html']);
  gulp.watch('source/js/**/*.js', ['jsOptimization']);
});

// Создание папки билд
gulp.task('build', function (done) {
  run(
    'clean',
    'style',
    'jsOptimization',
    'spriteSvg',
    'webp',
    'html',
    'copy',
    done
  );
});

// Эти таски запускать вручную

// // Оптимизация и минификация изображений (png, jpg, svg)
gulp.task('images', function () {
  return gulp.src('build/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('build/img'));
});
