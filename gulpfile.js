'use strict';

require('./environment');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const coveralls = require('gulp-coveralls');
const eslint = require('gulp-eslint');
const runSequence = require('run-sequence');

const filesToLint = [
  'gulpfile.js',
  'index.js',
  './server/**/*.js',
  '!node_modules/**',
];

gulp.task('lint', () => gulp.src(filesToLint)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError()));

gulp.task('coverage', () => gulp
  .src(['!node_modules/**', '!server/routes/**', './server/**/*.js'])
  .pipe(istanbul({ includeUntested: true }))
  .pipe(istanbul.hookRequire()));

gulp.task('test:backend', () => gulp.src(['test/**/*.js'])
  .pipe(mocha({ reporter: 'spec' }))
  .once('error', err => {
    throw err;
  })
  .pipe(istanbul.writeReports({
    dir: './coverage',
    reporters: ['html', 'lcov', 'text', 'json'],
  })));

gulp.task('coveralls', () => gulp.src('coverage/lcov.info').pipe(coveralls()));

gulp.task('test', callback => {
  runSequence('lint', 'coverage', 'test:backend', callback);
});
