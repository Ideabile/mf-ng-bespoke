var pkg = require('./package.json'),
    fs = require('fs'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    rimraf = require('gulp-rimraf'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    through = require('through'),
    opn = require('opn'),
    ghpages = require('gh-pages'),
    isDist = process.argv.indexOf('serve') === -1,
    path = require('path'),
    origin = '',
    dest = 'dist'
    checkIsFile = function(path){
      try{
        return fs.statSync(path).isFile();
      }catch(e){
        return false;
      }
    };

// Process arguments to check presentation name
for(var k in process.argv){
  if(process.argv[k].indexOf('--src') > -1){
    origin = process.argv[k].replace('--src=', '');
  }else if( process.argv[k].indexOf('--dest') > -1 ){
    dest = process.argv[k].replace('--dest=', '');
  }
}

var config = {
  slides: origin+'src/slides/**/*',
  js: {
    src: __dirname+'/src/scripts/main.js',
    paths: [ __dirname+'/node_modules', __dirname+'/bower_components' ]
  },
  css: {
    src: __dirname+'/src/styles/main.styl',
    paths: [ __dirname+'/node_modules', __dirname+'/bower_components' ]
  },
  images: [__dirname+'/src/images/**/*', origin+'src/images/**/*']
};

gulp.task('js', ['clean:js'], function() {
  return gulp.src(config.js.src)
    .pipe(isDist ? through() : plumber())
    .pipe(browserify({ transform: ['debowerify'], paths: config.js.paths, debug: !isDist }))
    .pipe(isDist ? uglify() : through())
    .pipe(rename('build.js'))
    .pipe(gulp.dest(dest+'/build'))
    .pipe(connect.reload());
});

gulp.task('html', ['clean:html'], function() {
  return gulp.src(config.slides)
    .pipe(isDist ? through() : plumber())
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
});

gulp.task('css', ['clean:css'], function() {
  return gulp.src(config.css.src)
    .pipe(isDist ? through() : plumber())
    .pipe(stylus({
      // Allow CSS to be imported from node_modules and bower_components
      'include css': true,
      'paths': config.css.paths
    }))
    .pipe(autoprefixer('last 2 versions', { map: false }))
    .pipe(isDist ? csso() : through())
    .pipe(rename('build.css'))
    .pipe(gulp.dest(dest+'/build'))
    .pipe(connect.reload());
});

gulp.task('images', ['clean:images'], function() {
  return gulp.src(config.images)
    .pipe(gulp.dest(dest+'/images'))
    .pipe(connect.reload());
});

gulp.task('clean', function() {
  return gulp.src(dest)
    .pipe(rimraf());
});

gulp.task('clean:html', function() {
  return gulp.src(dest+'/**/*.html')
    .pipe(rimraf());
});

gulp.task('clean:js', function() {
  return gulp.src(dest+'/build/build.js')
    .pipe(rimraf());
});

gulp.task('clean:css', function() {
  return gulp.src(dest+'/build/build.css')
    .pipe(rimraf());
});

gulp.task('clean:images', function() {
  return gulp.src(dest+'/images')
    .pipe(rimraf());
});

gulp.task('connect', ['build'], function(done) {
  connect.server({
    root: dest,
    livereload: true,
    port: '8002'
  });

  opn('http://localhost:8001', done);
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*.jade'], ['html']);
  gulp.watch(['src/styles/**/*.styl', __dirname+'/src/styles/**/*.css', __dirname+'/src/styles/**/*.styl', 'node_modules/bespoke-*/**/*.css', __dirname+'/node_modules/bespoke-*/**/*.css'], ['css']);
  gulp.watch(['src/images/**/*'], ['images']);
  gulp.watch([
    __dirname+'/src/scripts/**/*.js',
    'src/scripts/**/*.js',
    'node_modules/bespoke-*/**/*.js',
    __dirname+'/node_modules/bespoke-*/**/*.js',
    '!node_modules/bespoke-*/node_modules',
    '!'+__dirname+'/node_modules/bespoke-*/node_modules',
    'bespoke-theme-*/dist/*.js' // Allow themes to be developed in parallel
  ], ['js']);
});

gulp.task('deploy', ['build'], function(done) {
  ghpages.publish(path.join(__dirname, origin+''), { logger: gutil.log }, done);
});

gulp.task('build', ['js', 'html', 'css', 'images']);
gulp.task('serve', ['connect', 'watch']);
gulp.task('default', ['build']);
