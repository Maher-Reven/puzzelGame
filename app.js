var row = 2
var col = 2
var pieceHeight = 200
var pieceWidth = 200
var width = 400
var height = 400
var dropPices = []
topDr = 10
leftDr = 10
var zIndex = 1
var posValues = []
var filledValues = []
for (let i = 0; i < col * row; i++) {
  posValues.push(false)
  filledValues.push(false)
  dropPices[i] = document.createElement('div')
  dropPices[i].classList.add('dopable')
  document.body.appendChild(dropPices[i])
  dropPices[i].style.top = topDr + 'px'
  dropPices[i].style.left = leftDr + 'px'
  dropPices[i].style.width = pieceWidth + 'px'
  dropPices[i].style.height = pieceHeight + 'px'

  topDr += pieceHeight
  if (topDr === height + 10) {
    topDr = 10
    leftDr += pieceWidth
  }
}
var x = 0
var y = 0

var pices = []
for (let i = 0; i < col * row; i++) {
  pices[i] = document.createElement('div')
  pices[i].classList.add('draggable')
  document.body.appendChild(pices[i])
  pices[i].style.zIndex = zIndex
  pices[i].style.backgroundPosition = x + 'px ' + y + 'px'
  pices[i].style.width = pieceWidth + 'px'
  pices[i].style.height = pieceHeight + 'px'

  y -= pieceHeight
  if (y === -height) {
    y = 0
    x -= pieceWidth
  }
}
x = width + 20
y = 10
for (let i = 0; i < col * row; i++) {
  var ran = Math.floor(Math.random() * col * row)
  while (posValues[ran]) {
    ran++
    if (ran === col * row) {
      ran = 0
    }
  }
  posValues[ran] = true
  pices[ran].style.top = y + 'px'
  pices[ran].style.left = x + 'px'
  y += pieceHeight + 10
  if (y === 10 + row * (pieceHeight + 10)) {
    y = 10
    x += pieceWidth + 10
  }
}

var selectedPice
var mousePosX
var offSetX
var mousePosY
var offSetY

pices.forEach(pice =>
  pice.addEventListener('mousedown', function (e) {
    selectedPice = e.target
    mousePosX = e.offsetX
    mousePosY = e.offsetY
    offSetX = e.target.offsetLeft
    offSetY = e.target.offsetTop
    zIndex = zIndex + 1
    e.target.style.zIndex = zIndex

    if (
      e.pageX > 10 &&
      e.pageY > 10 &&
      e.pageX < width + 10 &&
      e.pageY < height + 10
    ) {
      //   find the right place for element in which cell its gonna be by calc the top/left within the droppable area
      var left = Math.floor((e.pageX - 10) / pieceWidth)
      var top = Math.floor((e.pageY - 10) / pieceHeight)
      filledValues[left * row + top] = false
    }
  })
)
document.body.addEventListener('mousemove', function moveing (e) {
  if (typeof selectedPice !== 'undefined') {
    selectedPice.style.left = e.pageX - mousePosX + 'px'
    selectedPice.style.top = e.pageY - mousePosY + 'px'
  }
})

document.body.addEventListener('mouseup', function stopMoving (e) {
  if (typeof selectedPice !== 'undefined') {
    // checkimg the dragged element if it in the scoupe of the dropalble area
    if (
      e.pageX > 10 &&
      e.pageY > 10 &&
      e.pageX < width + 10 &&
      e.pageY < height + 10
    ) {
      //   find the right place for element in which cell its gonna be by calc the top/left within the droppable area
      var left = Math.floor((e.pageX - 10) / pieceWidth)
      var top = Math.floor((e.pageY - 10) / pieceHeight)
      selectedPice.style.left = left * pieceWidth + 10 + 'px'
      selectedPice.style.top = top * pieceHeight + 10 + 'px'
      if (filledValues[left * row + top]) {
        selectedPice.style.left = offSetX + 'px'
        selectedPice.style.top = offSetY + 'px'
      } else {
        filledValues[left * row + top] = true
        if (filledValues.every(value => value)) {
          var rightTop = 10 - pieceHeight
          var rightLeft = 10
          var win = pices.every(pice => {
            rightTop += pieceHeight
            if (rightTop === height + 10) {
              rightTop = 10
              rightLeft += pieceWidth
            }
            return pice.offsetLeft === rightLeft && pice.offsetTop === rightTop
          })
          if (win) {
            /// ---------------------------------- winner ending -----------------------------
            var resolver = {
              resolve: function resolve (options, callback) {
                // The string to resolve
                var resolveString =
                  options.resolveString ||
                  options.element.getAttribute('data-target-resolver')
                var combinedOptions = Object.assign({}, options, {
                  resolveString: resolveString
                })

                function getRandomInteger (min, max) {
                  return Math.floor(Math.random() * (max - min + 1)) + min
                }

                function randomCharacter (characters) {
                  return characters[getRandomInteger(0, characters.length - 1)]
                }

                function doRandomiserEffect (options, callback) {
                  var characters = options.characters
                  var timeout = options.timeout
                  var element = options.element
                  var partialString = options.partialString

                  var iterations = options.iterations

                  setTimeout(function () {
                    if (iterations >= 0) {
                      var nextOptions = Object.assign({}, options, {
                        iterations: iterations - 1
                      })

                      // Ensures partialString without the random character as the final state.
                      if (iterations === 0) {
                        element.textContent = partialString
                      } else {
                        // Replaces the last character of partialString with a random character
                        element.textContent =
                          partialString.substring(0, partialString.length - 1) +
                          randomCharacter(characters)
                      }

                      doRandomiserEffect(nextOptions, callback)
                    } else if (typeof callback === 'function') {
                      callback()
                    }
                  }, options.timeout)
                }

                function doResolverEffect (options, callback) {
                  var resolveString = options.resolveString
                  var characters = options.characters
                  var offset = options.offset
                  var partialString = resolveString.substring(0, offset)
                  var combinedOptions = Object.assign({}, options, {
                    partialString: partialString
                  })

                  doRandomiserEffect(combinedOptions, function () {
                    var nextOptions = Object.assign({}, options, {
                      offset: offset + 1
                    })

                    if (offset <= resolveString.length) {
                      doResolverEffect(nextOptions, callback)
                    } else if (typeof callback === 'function') {
                      callback()
                    }
                  })
                }

                doResolverEffect(combinedOptions, callback)
              }

              /* Some GLaDOS quotes from Portal 2 chapter 9: The Part Where He Kills You
               * Source: http://theportalwiki.com/wiki/GLaDOS_voice_lines#Chapter_9:_The_Part_Where_He_Kills_You
               */
            }
            var strings = [
              'Oh thank god, you Win It Man.',
              'wtf really man',
              'ok wait my next game Ha3....',

              '......'
            ]

            var counter = 0

            var options = {
              // Initial position
              offset: 0,
              // Timeout between each random character
              timeout: 5,
              // Number of random characters to show
              iterations: 10,
              // Random characters to pick from
              characters: [
                'a',
                'b',
                'c',
                'd',
                'e',
                'f',
                'g',
                'h',
                'i',
                'j',
                'k',
                'l',
                'm',
                'n',
                'o',
                'p',
                'q',
                'r',
                's',
                't',
                'u',
                'v',
                'x',
                'y',
                'x',
                '#',
                '%',
                '&',
                '-',
                '+',
                '_',
                '?',
                '/',
                '\\',
                '='
              ],
              // String to resolve
              resolveString: strings[counter],
              // The element
              element: document.querySelector('[data-target-resolver]')

              // Callback function when resolve completes
            }
            function callback () {
              setTimeout(function () {
                counter++

                if (counter >= strings.length) {
                  counter = 0
                }

                var nextOptions = Object.assign({}, options, {
                  resolveString: strings[counter]
                })
                resolver.resolve(nextOptions, callback)
              }, 1000)
            }

            resolver.resolve(options, callback)
            /// //////////////////////////////////////////////////////-------------------------------------
          }
        }
      }
    }
    selectedPice = undefined
  }
})
var newGame = document.getElementById('new')
newGame.onclick = function () {
  document.location.reload()
}
