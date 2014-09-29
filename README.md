# rtc.io FAQ

Ask a question in 140 characters or less, and we'll do our best to answer it with
a runnable code sample.


[![NPM](https://nodei.co/npm/rtc-faq.png)](https://nodei.co/npm/rtc-faq/)



## Usage

Install:

```
npm i -g rtc-faq
```

Run one of the examples:

```
rtc-faq replace-captured-media
```

Using the `rtc-faq` command runs two chrome instances, the second of which is
launched with the `--use-fake-device-for-media-stream` option which displays
a test pattern rather than a webcam image.  Each of the browser instances is
also launched with the `--use-fake-ui-for-media-stream` option which
suppresses the media permission dialog so you can experience how the code will
behave in a `HTTPS` environment.

Look at the code which makes it go:

```
cat examples/replace-captured-media.js
```

You'll be able to edit the code and refresh the browser windows that have been
launched by the `rtc-faq` and see the changes immediately, thanks to
[beefy](https://github.com/chrisdickinson/beefy) and
[browserify](https://github.com/substack/node-browserify) which are used by the
FAQ loader.

## License(s)

### MIT

Copyright (c) 2014 Damon Oehlman <damon.oehlman@nicta.com.au>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
