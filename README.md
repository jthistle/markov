# Compiled Markov

A Markov generator module for JS with support for compilation.


## Installation

This package is available through `npm` as [`compiled-markov`](https://www.npmjs.com/package/compiled-markov).

Here is an example of how to use it:

```javascript
const Markov = require("compiled-markov")
const fs = require("fs")

// Read our source file
fs.readFile("./source.txt", "utf8", (error, data) => runProgram(data))

const runProgram = (source) => {
  const mark = new Markov()

  // Give the generator the source
  mark.initFromText(source)

  // Let's get some markov sentences! Make them start with 'fear'.
  console.log(mark.generateSentences(3, "fear"))

  // Give us the compiled JSON and write it to a file which we can
  // read later in our production product
  const compiled = mark.getCompiled()
  fs.writeFile("./compiled.txt", compiled, "utf8", (error) => console.log(error))
}
```

Pretty simple, huh?

In other JS environments, such as web platforms like React, you can pass a string to `initFromText`, or work out your own way of fetching and opening a text file. It can be a bit more difficult, since `fs` isn't supported in Node when it's run for browser applications. 

`wells-source.txt` is provided as an example source file, taken from [Project Gutenburg](http://www.gutenberg.org/files/36/36-h/36-h.htm). This work (_The War of the Worlds_, H.G. Wells, 1897) is public domain - in the UK, at least.

### Why 'compiled'?

You only have to feed in a source text once for this to work. All the data needed to generate sentences will then be in a compiled string that bears little resemblence to the original text. This means, you can run this locally to read from a source, and then only track and generate sentences from the compiled JSON.

This can be useful if you want to use copyrighted text to generate the Markov chain. Since it isn't the original text when written in this form, it's legal, probably. 

**DISCLAIMER: no responsibility can be accepted by any contributors to this programme for any
legal issues, including but not limited to copyright issues, that result through the use of
this programme.**

## Usage

### Initialisation

#### `initFromText(text): [no return value]`

- `text`: `string`, the source text string

The generator will generate a new markov chain from the source text provided.

#### `initFromCompiled(compiled): [no return value]`

- `compiled`: `string` or `Object`, the compiled JSON

The generator will try to generate a new markov chain from the compiled JSON passed to it.

### Compilation

#### `getCompiled(): string`

Returns the compiled JSON that can be passed back into `initFromCompiled`.

### Generation

#### `generateSentences(count, seed): string`

- `count`: `int`, the number of sentences to generate
- `seed`: `string` (optional, default: `undefined`), the word to seed the sentence from

Randomly generate `count` sentences. `seed` can be used to choose how to start off
generation - it will be the first word of the generated sentences. `seed` is case sensitive.

## Contributing

Please, fork and make a pull request. Or, just make an issue. My JS is less than elegant, and I'm always interested to learn new and improved ways of doing things.
