const gulp = require('gulp')
const babel = require('gulp-babel')
const rename = require('gulp-rename')
const ava = require('gulp-ava')
const standard = require('gulp-standard')
const del = require('del')

const BABEL_BACKEND_PRESET = {
  presets: [
    ['env', {
      node: 'current'
    }]
  ],

  plugins: ['transform-runtime']
}

gulp.task('clean', () => 
  del('dist/**/*')
)

gulp.task('standard', () =>
  gulp.src('src/**/*.js')
    .pipe(standard())
    .pipe(standard.reporter('default', {}))
)

gulp.task('build', ['clean'], () => 
  gulp.src('src/**/*.js')
    .pipe(babel(BABEL_BACKEND_PRESET))
    .pipe(gulp.dest('dist'))
)

gulp.task('default', ['build'])