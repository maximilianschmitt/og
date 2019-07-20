# og

Hosted at https://og.maximilianschmitt.me

## Usage

In JavaScript:

```js
const encodedText = encodeURIComponent(ogImageText);
const ogImageURL = `https://og.maximilianschmitt.me/${encodedText}.png`;
```

In HTML:

```html
<meta
  property="og:image"
  content="https://og.maximilianschmitt.me/Hello%20world.png"
/>
<meta name="twitter:title" content="Hello world" />
<meta
  name="twitter:image"
  content="https://og.maximilianschmitt.me/Hello%20world.png"
/>
<meta name="twitter:card" content="summary_large_image" />
```

![](https://og.maximilianschmitt.me/Hello%20world.png)
