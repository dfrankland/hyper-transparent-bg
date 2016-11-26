# Hyper.app Transparent Background Plugin

> An emulated transparent background for [Hyper.app](https://hyper.is/)!

## WAT HOW DOES IT WORK

![alt wat][1]

It's an HTML5 `<video />` of the entire screen that's moved when the window
moves. CSS is used to make it transparent and add other effects.

**If you don't want a blur or other effects added to your background, but you
still want it to be transparent, just use an `rgba` color as your
`config.backgroundColor` (ex `config.backgroundColor: 'rgba(0, 0, 0, 0.3)'`).
The alpha transparency must be greater than `0` for this to work.**.

### Demo

![alt demo][2]

### Configuration

#### Usage with themes

Yes, it works with themes! All that is needed is to add this package anywhere
after the theme package and it will automatically apply the effects from the
`config.transparentBg` property below to the background from the theme.

For example using the [`hyperterm-material`][3] theme:

```javascript
module.exports = {
  plugins: [
    'hyperterm-material',
    'hyper-transparent-bg',
  ],
};
```

##### Properties

Add these properties to your `~/.hyper.js` file to configure
`hyper-transparent-bg`.

###### `config.backgroundColor`

*   Type: string (`hex` or `rgba` color)
*   Default: `'#000'`

The normal background property for Hyper.app.

###### `config.transparentBg`

*   Type: object
*   Default: `{ WebkitFilter: 'blur(5px)', opacity: '0.3' }`

This object can be any [CSSStyleDeclaration][4] allowed.
Essentially pass an inline style object [the same way you would with React][5].

By default there is blur and opacity applied.
A value of `opacity: 1` will have no background color applied to it.
A value of `opacity: 0` for opacity will have no "transparency" and only have
color.

### Development / Debugging / More WAT

Setting the `DEBUG` environmental variable to a [truthy value][6] will make the
plugin `console.log` the commands that are being sent to the window.

[1]: http://i.giphy.com/12mPcp41D9a1i0.gif
[2]: http://i.giphy.com/3o6ZsYOu9C7RhSWFBS.gif
[3]: https://github.com/dperrera/hyperterm-material
[4]: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/cssText
[5]: https://facebook.github.io/react/tips/inline-styles.html
[6]: https://developer.mozilla.org/en-US/docs/Glossary/Truthy
