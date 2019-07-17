# Markov

A Markov generator module for JS (ES6).


## Installation

`yarn` can be used to run as a standalone script.

- `yarn install`

- `yarn start`


Otherwise, here is an example of how to use it:

```javascript
    const Markov = require('compiled-markov')

    const mark = new Markov()

    mark.tryInitFromCompiled("./source.txt").then(() => {
      console.log(mark.generateSentences(3))
    }).catch((error) => {
      console.error(error)
    })
```

Pretty simple, huh?

`wells-source.txt` is provided as an example source file, taken from [Project Gutenburg](http://www.gutenberg.org/files/36/36-h/36-h.htm). This work (_The War of the Worlds_, H.G. Wells, 1897) is public domain - in the UK, at least.


## Contributing

Please do. My JS is less than elegant, and I'm always interested to learn new and improved ways of doing things.
