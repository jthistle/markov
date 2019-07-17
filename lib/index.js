const fs = require('fs')

const PUNCTUATION = [".", "!", "?", ",", ":", ";", '"']
const ENDSENTENCE = [".", "!", "?"]
const NOREMOVE = ["&", "-", "'"]
const COMPILED = "markov.compiled"

/*
  StartWord is a class that describes the behaviour of a given word. It can decide
  what word comes after it, given a set of frequencies for words that come after it (i.e.
  how many times word x appears after it in the source text)
*/
class StartWord {
  constructor(word, frequencies) {
    this.word = word
    this.total = 0

    /*
    this.freqs is formatted as:
      {
        "following word": frequency int,
        ...
      }
    */
    this.freqs = frequencies

    for (var i in frequencies) {
      this.total += frequencies[i]
    }
  }

  getNext() {
    var rand = Math.floor(Math.random() * this.total)
    
    var nextWord
    for (var i in this.freqs) {
      rand -= this.freqs[i]

      if (rand < 0) {
        nextWord = i
        break
      }
    }

    return nextWord
  }
}


class Markov {
  constructor(){
    /*
    The genMap is formatted as:
    {
      "word": StartWord object,
      ...
    }
    */
    this.genMap = {}
  }
  
  
  initFromText(text, saveCompiled = false) {
    /* 
    First seperate into tokens, these are:
    - alphanumeric words (incl. anything in NOREMOVE)
    - anything in PUNCTUATION
    - remove all other characters
    */
    
    // Put spaces before punctuation
    for (var p of PUNCTUATION) {
      text = text.replace(RegExp(`[${p}]`, "g"), " " + p)
    }
    
    // Remove unhandled characters
    // TODO: support extended ASCII alphanumeric (e.g. umlauted characters)
    var pattern = new RegExp("[^A-Za-z0-9" + NOREMOVE.join() + PUNCTUATION.join() + "\\s]", "g")
    text = text.replace(pattern, "")
  
    // Split into tokens: at any space or newline
    var source = text.split(new RegExp("[\\s\\n]", "g"))
    
    // Remove empty tokens, and make all valid tokens lowercase
    for (var i = source.length - 1; i >= 0; i--) {
      if (source[i].trim() === "") {
        source.splice(i, 1)
      } else {
        source[i] = source[i].toLowerCase()
      }
    }
    
    /*
    source is now the text seperated into tokens
    */
    var tempMap = {}
    
    // Count the frequency of words following each other
    for (var i = 0; i < source.length - 1; i++) {
      this.incFrequency(source[i], source[i + 1], tempMap)
    }

    // Compile the map that we can generate sentences from
    this.compileGenMap(tempMap)

    // Write to save file
    if (saveCompiled)
      this.writeCompiled()
  }


  initWordKey(word, key, map) {
    if (!map.hasOwnProperty(word)) {
      map[word] = {}
    }

    if (!map[word].hasOwnProperty(key)) {
      map[word][key] = 0
    }
  }


  incFrequency(start, end, map) {
    this.initWordKey(start, end, map)
    map[start][end]++
  }


  compileGenMap(map) {
    for (var word in map) {
      this.genMap[word] = new StartWord(word, map[word])
    }
  }

  
  /*
    This writes the genMap to file. This can be useful if you want to use copyrighted text to
    generate the Markov chain. Since it isn't the original text when written in this form, it's 
    legal, probably. 
    DISCLAIMER: no responsibility can be accepted by any contributors to this programme for any
    legal issues, including but not limited to copyright issues, that result through the use of
    this programme.
  */
  writeCompiled() {
    return new Promise((resolve, reject) => {
      fs.writeFile(COMPILED, JSON.stringify(this.genMap), "utf8", (error) => {
        if (error)
          return reject(error)
        resolve()
      })
    })
  }

  
  initFromCompiled() {
    return new Promise((resolve, reject) => {
      this.checkIfHasCompiled().then((success) => {
        if (!success)
          return reject("Couldn't open compiled file")

        fs.readFile(COMPILED, "utf8", (error, data) => {
          if (error)
            return reject(error)
          this.genMap = JSON.parse(data)

          // We have to put the saved format back into classes
          for (var word in this.genMap) {
            this.genMap[word] = new StartWord(word, this.genMap[word].freqs)
          }
          resolve()
        })
      })
    })
  }


  checkIfHasCompiled() {
    return new Promise((resolve, reject) => {
      fs.stat(COMPILED, (error) => {
        if (error) {
          if (error.errno === -2) {
            resolve(false)
          } else {
            reject(error)
          }
        } else {
          resolve(true)
        }
      })
    })
  }

  
  initFromFile(file, saveCompiled = false) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, "utf8", (err, data) => {
        if (err) {
          return reject(err)
        }
        this.initFromText(data, saveCompiled)
        resolve()
      })
    })
  }

  /*
    Given a source file, this will try to init from the compiled file, but if it
    fails it will read the source file provided and generate a new chain from that. 
  */
  tryInitFromCompiled(sourceFile) {
    return new Promise((resolve, reject) => {
      this.checkIfHasCompiled().then((success) => {
        if (success) {
          this.initFromCompiled().then(() => {
            resolve()
          }).catch((error) => {
            reject(error)
          })
        } else {
          this.initFromFile(sourceFile, true).then(() => {
            resolve()
          }).catch((error) => {
            reject(error)
          })
        }
      }).catch((error) => {
        reject(error)
      })
    })
  }
  
  
  /*
    Randomly generate `count` sentences. `seed` can be used to choose how to start off
    generation - NOTE: seed will _not_ be the first word of the sentence.
  */
  generateSentences(count, seed) {
    if (this.genMap.length == 0)
      return ""

    var isAllPunctuation = true
    for (var word in this.genMap) {
      if (!(word in PUNCTUATION)) {
        isAllPunctuation = false
        break
      }
    }

    if (isAllPunctuation) {
      console.error("Source is all punctuation")
      return
    }

    while (!seed || !(seed in this.genMap) || (PUNCTUATION.indexOf(seed) !== -1)) {
      var words = Object.keys(this.genMap)
      seed = words[Math.floor(Math.random() * words.length)]
    }

    var sentences = []
    var lastWord = seed
    while (count > 0) {
      var thisSentence = []

      while (true) {
        thisSentence.push(lastWord)

        // If we have reached an end sentence token, put the sentence together
        if (ENDSENTENCE.includes(lastWord)) {
          var tempSentence = ""
          for (var word of thisSentence) {
            // Put spaces before each word, unless it's punctuation
            if (PUNCTUATION.includes(word) || tempSentence === "") {
              tempSentence += word
            } else {
              tempSentence += " " + word
            }
          }
          sentences.push(tempSentence)
          break
        }

        // Get the next word in the chain
        lastWord = this.genMap[lastWord].getNext()
      }

      // Get the next word in the chain, again since we will have broken out
      lastWord = this.genMap[lastWord].getNext()
      count--
    }
    
    var endResult = ""

    // Join the sentences up
    for (var sentence of sentences) {
      endResult += sentence[0].toUpperCase() + sentence.slice(1) + " "
    }

    return endResult
  }
}

module.exports = Markov
