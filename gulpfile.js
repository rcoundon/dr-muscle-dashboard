require('dotenv').config();
const { series, src, dest } = require('gulp');
const rename = require('gulp-rename');
const git = require('gulp-git');
const conventionalGithubReleaser = require('conventional-github-releaser');
const fs = require('fs');
const bump = require('gulp-bump');
const color = require('gulp-color');

const devBuild =
  (process.env.NODE_ENV || 'development').trim().toLowerCase() ===
  'development';

const customer = process.env.CUSTOMER;
console.log(color(`Customer is ${customer}`, 'GREEN'));

const release =
  (process.env.RELEASE || 'deploy').trim().toLowerCase() === 'release';
console.log(
  color('Creating release', 'GREEN'),
  color(release.toString(), 'RED')
);

function setupConfig(done) {
  done();
}

function commitChanges(done) {
  if (!release) {
    console.log(color('Skipping commit step', 'BLUE'));
    done();
    return;
  }

  return src('.')
    .pipe(git.add())
    .pipe(git.commit('Auto-deploy bumped version number'));
}

function pushChanges(done) {
  if (!release) {
    console.log(color('Skipping push step', 'BLUE'));
    done();
    return;
  }
  git.push('origin', 'master', done);
}

function githubRelease(done) {
  if (!release) {
    console.log(color('Skipping release step', 'BLUE'));
    done();
    return;
  }
  const AUTH = {
    type: 'oauth',
    token: process.env.GITHUB_KEY,
    url: 'https://api.github.com'
  };
  conventionalGithubReleaser(
    AUTH,
    {
      preset: '' // Or to any other commit message convention you use.
    },
    done
  );
}

function getPackageJsonVersion() {
  // We parse the json file instead of using require because require caches
  // multiple calls so the version number won't be updated
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

function createNewTag(done) {
  if (!release) {
    console.log(color('Skipping tag step', 'BLUE'));
    done();
    return;
  }
  let version = getPackageJsonVersion();
  git.tag(version, 'Created Tag for version: ' + version, function(error) {
    if (error) {
      return done(error);
    }
    git.push(
      'origin',
      'master',
      {
        args: '--tags'
      },
      done
    );
  });
}

function bumpVersion(done) {
  if (!release) {
    console.log(color('Skipping bumpVersion step', 'BLUE'));
    done();
    return;
  }

  src('./package.json')
    .pipe(
      bump({
        type: process.env.RELEASE_TYPE ? process.env.RELEASE_TYPE : 'patch'
      })
    )
    .pipe(dest('./'));
  return Promise.resolve('version bumped');
}

exports.default = series(
  setupConfig,
  bumpVersion,
  commitChanges,
  pushChanges,
  createNewTag,
  githubRelease
);
