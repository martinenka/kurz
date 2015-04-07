var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require('browser-sync'),
    combiner = require('stream-combiner2'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    minifyHTML = require('gulp-minify-html'),
    del = require('del');


gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: ['dist']
        }
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});


gulp.task('less', function () {
  var combined = combiner.obj([
    gulp.src('./src/style.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload({stream:true}))
  ]);
  combined.on('error', console.error.bind(console));
  return combined;
});
gulp.task('html', function() {
   gulp.src('src/**/*.html')
   .pipe(gulp.dest('./dist/'));
});
gulp.task('scripts', function() {
   gulp.src('src/js/**/*.js')
   .pipe(gulp.dest('./dist/js/'));
});
gulp.task('fonts', function() {
   gulp.src('src/fonts/**/*')
   .pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('optim', function(cb) {
  gulp.src('src/**/*.{png,jpg,jpeg,ico,svg}')
  .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
  }))
  .pipe(gulp.dest('./dist/'));
});

//build
gulp.task('html:build', function() {
   gulp.src('src/**/*.html')
   .pipe(minifyHTML())
   .pipe(gulp.dest('./dist/'));
});
gulp.task('less:build', function () {
  var combined = combiner.obj([
    gulp.src('./src/style.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.reload({stream:true}))
  ]);
  combined.on('error', console.error.bind(console));
  return combined;
});
gulp.task('scripts:build', function() {
   gulp.src('src/js/**/*.js')
   .pipe(uglify())
   .pipe(gulp.dest('./dist/js/'));
});

gulp.task('build', ['clean', 'assets','less:build', 'scripts:build', 'html:build', 'fonts']);
gulp.task('default', ['browser-sync', 'less', 'html',  'scripts', 'fonts'], function () {
  gulp.watch('src/**/*.less', ['less']);
  gulp.watch('src/**/*.html', ['html', 'bs-reload']);
  gulp.watch('src/**/*.js', ['scripts', 'bs-reload']);
});
















