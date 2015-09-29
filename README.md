[Skycons](http://skyglobal.github.io/skycons/) 
========================

> A collection of brand approved icons for use across Sky.com.  [Demo Page](http://skyglobal.github.io/skycons/)

## Quick-Start

Include the Share assets in your project either as **Static Resources** 

with default colours:
```html
<link rel="stylesheet" href="http://web-toolkit.global.sky.com/components/skycons/0.3.6/styles/skycons.min.css" />
```

without default colours:
```html
<link rel="stylesheet" href="http://web-toolkit.global.sky.com/components/skycons/0.3.6/styles/skycons-core.min.css" />
```

or alternatively, **Via Bower**

 * Run: `bower install --save-dev bskyb-skycons`
 * Sass: `@import 'bower_components/bskyb-skycons/src/styles/skycons';`


#### Developer Notes

  * Ensure `aria-hidden` is used on your `skycon` tags.
  * To give the icon colour, add the class `skycon--active` (only in skycons.min.css).
  * To give the icon have a colour on hover, add the class `skycon--hover` to it's parent (only in skycons.min.css).


## Contribution

Components depends on collaboration between developers. Contributions of any size are actively encouraged.

To see how to build this component locally, read the [contribution guidelines](CONTRIBUTING.md).

## Browser Support

 * IE8 +
 * Safari 5 +
 * Latest Firefox
 * Latest Chrome
 * Latest Mobile Safari
 * Latest Mobile Chrome
