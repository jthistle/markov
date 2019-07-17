# Markov

A Markov generator module for JS with support for compilation.


## Installation

This package is available through `npm` as [`compiled-markov`](https://www.npmjs.com/package/compiled-markov).

Here is an example of how to use it:

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

### Why 'compiled'?

You only have to feed in a source text once for this to work. All the data needed to generate sentences will then be in a compiled file that bears little resemblence to the original text. This means, you can run this locally to read from a source file, and then only track the compiled `markov.compiled` file.

This can be useful if you want to use copyrighted text to generate the Markov chain. Since it isn't the original text when written in this form, it's legal, probably. 

**DISCLAIMER: no responsibility can be accepted by any contributors to this programme for any
legal issues, including but not limited to copyright issues, that result through the use of
this programme.**

## Usage

### Initialisation

#### `tryInitFromCompiled(file): Promise`

- `file`: `string`, the location of the file that you want to use as a source text

The generator will try to open the compiled file at `markov.compiled`. If it fails, it will generate a new markov chain from the source text provided, which it will then save as a compiled file.

#### `initFromFile(file, saveCompiled): Promise`

- `file`: `string`, the location of the file that you want to use as a source text
- `saveCompiled`: `bool` (optional, default: `false`), whether or not to save the compiled chain in `markov.compiled`.

The generator will generate a new markov chain from the text read from the `file` provided, and save the compiled chain if told to.

#### `initFromText(text, saveCompiled): Promise`

- `text`: `string`, the source text string
- `saveCompiled`: `bool` (optional, default: `false`), whether or not to save the compiled chain in `markov.compiled`.

The generator will generate a new markov chain from the source text provided, and save the compiled chain if told to.

#### `initFromCompiled(): Promise`

The generator will try to generate a new markov chain from the compiled file saved at `markov.compiled`.

### Generation

#### `generateSentences(count, seed): string`

- `count`: `int`, the number of sentences to generate
- `seed`: `string` (optional, default: `undefined`), the word to seed the sentence from

Randomly generate `count` sentences. `seed` can be used to choose how to start off
generation - it will be the first word of the generated sentences. `seed` is case sensitive.

## Contributing

Please do. My JS is less than elegant, and I'm always interested to learn new and improved ways of doing things.
