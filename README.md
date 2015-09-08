# img2braille
**Img2braille** converts a picture using [utf-8 braille symbols](http://www.fileformat.info/info/unicode/block/braille_patterns/utf8test.htm).

All points on the generated pictures drawn with 2x4 braille symbols, like `⠣`, `⠩`, or `⡺`.
All source files are on the [gh-pages branch](https://github.com/roipoussiere/img2braille/tree/gh-pages).

Try the [demo](http://roipoussiere.github.io/img2braille/)!

### Options

**Input file**: The file to convert.

**Mode**: The dithering algorithm used for the b&w conversion (see on [Wikipedia](https://en.wikipedia.org/wiki/Dither#Digital_photography_and_image_processing)), among :
- No dithering;
- Bayer;
- Floyd Steinberg;
- Atkinson.

**Max width**: When checked, the generated picture size is optimised.

**Width**: The drawing width, if the last option is not checked. In this way you can put images in any chat or whatever you want.

**Threshold**: Pixels below this value (from 0 to 255) are considered as `white`, and the others as `black`. It make sense only for `No dithering` and `Bayer` modes.
