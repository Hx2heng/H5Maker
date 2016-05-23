var gulp = require('gulp'),
    autoprefixer = require("gulp-autoprefixer"),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify');

gulp.task('css',function(){
  gulp.src('./dev/css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minifycss())
    .pipe(gulp.dest('./css'))
    .pipe(notify('Style task complete'))
})

gulp.task('js',function(){
  gulp.src('./dev/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./js'))
    .pipe(notify('Scripts task complete'))
})

gulp.task('default',['watch'],function(){
  gulp.start('watch');
})

gulp.task('watch',function(){
  gulp.watch('./dev/css/*.css',['css']);
  gulp.watch('./dev/js/*.js',['js']);
})

