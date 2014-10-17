# Contributing

Like most open source projects, we ask that you fork the project and issue a [pull request](#pull-requests) with your changes.

We encourage small change pull requests, the smaller the change the quicker and easier it is merged.

## Dependencies

To build the toolkit locally, you'll need to install:
 * [ruby](https://www.ruby-lang.org/) (version 0.0.4 or later),
 * [node.js](http://nodejs.org),
 * [Gulp](http://gulpjs.com),
 * [Grunt](http://gruntjs.com/),
 * [Jekyll](http://jekyllrb.com/)


## Workflow

1. Fork the project
2. Clone down your fork
`git clone git://github.com/<username>/skycons.git`
3. Setup your 'upstream'
`git remote add upstream https://github.com/skyglobal/skycons.git`
4. Create a topic branch to contain your change
`git checkout -b feature-my-feature`
5. Place any new icons into [src/svg](/src/svg)
6. Make sure [CHANGELOG.md](./CHANGELOG.md) includes a summary of your changes in a new version number heading
7. Make sure you are still up to date with master
`git pull upstream master`
8. If necessary, rebase your commits into logical chunks, without errors.
9. Push the branch up 
`git push origin my-awesome-feature`
10. Create a pull request and describe what your change does and the why you think it should be merged.

If you would like the feature to go live sooner, mention this in the comments/commit. We will provide a temporary live url that will allow you to carry on without getting blocked.

## Running Locally
 * `grunt serve` :  Run Jekyll on port 3456
 
## Releasing (admin only)

 * Update [package.json](package.json) version number appropriately
 * `grunt release:gh-pages` : push the latest version to gh-pages
 * `grunt release:bower` : release the code to bower
 * `grunt release:cdn` : push the latest version to gh-pages