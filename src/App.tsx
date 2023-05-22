import { useCallback, useEffect, useState } from 'react'
const firstLine = 'qwertyuiop'.split('')
const secondLine = 'asdfhjkl'.split('')
const thirdLine = 'zxcvbnm'.split('')


type Entry = string[]
type DuplicateIndeces = number[]
type EntriesCollecton = Array<Entry>

function App() {
  const [currentEntryState, setCurrentEntryState] = useState<Entry>([])
  const [entriesCollectionState, setEntriesCollectionState] = useState<EntriesCollecton>([])
  const [enterPressed, setEnterPressed] = useState<boolean>(false)

  function setKeyboardInputToEntry(e: KeyboardEvent) {
    const key = e.key;
    /** Check if input is only from letters a-z */
    const isAlphabetical = /^[a-zA-Z]+$/.test(key)

    /** Push input letter to entry state array */
    if (e.key === 'Enter') {
      setEnterPressed(true)
    } else {
      setCurrentEntryState(state => {
        setEnterPressed(false)
        if (state.length < 5 && isAlphabetical && key.length === 1) {
          return [...state, e.key]
        } if (key === 'Backspace' && state.length > 0) {
          /* Delete the last letter in the current entry array*/
          return state.filter((_item, idx) => idx !== state.length - 1)
        } else {
          return state
        }
      })
    }

  }


  useEffect(() => {
    console.log(currentEntryState.length)
    if (enterPressed === true && currentEntryState.length === 5) {
      setEntriesCollectionState(state => [...state, currentEntryState])
      setCurrentEntryState([])
    } else if (enterPressed === true && currentEntryState.length !== 5) {
      alert('Must type five letter word')
    }
  }, [enterPressed])

  useEffect(() => {
  }, [entriesCollectionState])

  /* Listen for keyboard types within the window object. 
   *
   * Make sure to remove the event listener throught the useEffect cleanup function 
   * to avoid double entries
   * */
  useEffect(() => {
    window.addEventListener('keydown', setKeyboardInputToEntry)
    return () => {
      window.removeEventListener('keydown', setKeyboardInputToEntry)
    }
  }, [])

  return (
    <div className='w-screen h-screen bg-dark text-white'>
      <Header />
      <TextBoard currentEntry={currentEntryState} entriesCollection={entriesCollectionState} enterPressed={enterPressed} />
    </div>
  )
}

function Header() {
  return (
    <>
      <header className='w-full h-20 border-b-[1px] border-b-gray-500 text-white font-bold text-3xl flex justify-center items-center'>
        <h1>WORDLE</h1>
      </header>
    </>
  )
}

function TextBoard({ entriesCollection, currentEntry }: { entriesCollection: EntriesCollecton, currentEntry: Entry, enterPressed: boolean }) {
  const correctWord = "loser".split('')
  const arr = Array.from({ length: 6 }, () => "test")
  //const [bg, setBg] = useState({})
  const wordArr = Array.from({ length: 5 }, () => "test")

  const bgCalculator = useCallback(() => {
    const bgArray = entriesCollection.map(item => comparer(correctWord, item))
    //const bgArrObj = entriesCollection.map((item, idx1) => {
    //  const obj: any = {}
    //  item.forEach((letter, idx2) => {
    //    obj[letter] = bgArray[idx1][idx2]
    //  })
    //  return obj
    //})
    //const result: any = {};

    //bgArrObj.forEach(obj => {
    //  for (const letter in obj) {
    //    if (result.hasOwnProperty(letter)) {
    //      if (result[letter] !== obj[letter]) {
    //        result[letter] = obj[letter];
    //      }
    //    } else {
    //      result[letter] = obj[letter];
    //    }
    //  }
    //});
    //setBg(result)

    return bgArray
  }, [entriesCollection, correctWord])

  const findDuplicates = (arr: Entry) => arr.filter((item, index) => arr.indexOf(item) !== index)
  function findDuplicateIndices(letters: Entry) {
    const duplicateLetters = findDuplicates(letters)
    const obj = {}

    letters.forEach((item, idx) => {
      if (duplicateLetters.includes(item)) {
        obj[item] ? obj[item] = [...obj[item], idx] : obj[item] = [idx]
      }
    })
    return obj;
  }

  function comparer(correctArray: Entry, arrayEntry: Entry) {
    const indeces = findDuplicateIndices(arrayEntry)
    const correctWordDuplicatIndeces = findDuplicateIndices(correctArray)

    for (const key in indeces) {
      if (indeces.hasOwnProperty(key)) {
        // if the correct word does not have duplicates and the word entry has duplicate letters,
        // lets just return the first index and highlight it as yellow
        if (correctWordDuplicatIndeces[key] === undefined) {
          indeces[key] = [indeces[key][0]]

          // if the array entry has more duplicate letters than the correct word, 
          // we match the length of the duplicate indeces to have a "highlight limit"
        } else if (correctWordDuplicatIndeces[key].length < indeces[key].length) {
          const toSubtract = indeces[key].length - correctWordDuplicatIndeces[key].length
          indeces[key].splice(-1 * toSubtract)
        }
      }
    }

    return arrayEntry.map((letter, idx) => {
      if (correctArray.includes(letter)) {
        if (correctArray[idx] === letter) {
          return 'bg-green-500'
        } else {
          if (indeces[letter]) {
            if (indeces[letter].includes(idx)) {
              return 'bg-yellow-500'
            } else {
              return "bg-gray-500"
            }
          } else {
            return 'bg-yellow-500'
          }
        }
      } else {
        // non existent letter, gray
        return "bg-gray-500"
      }
    })

  }

  return (
    <>
      <div className='w-full h-[60%] flex flex-col justify-center items-center'>
        {arr.map((_item, idx) => {
          return (
            <div className='flex' key={idx}>
              {wordArr.map((_item2, idx2) => (
                <div key={idx2} className={`m-1 h-16 font-bold text-xl w-16 border-[2px] border-graynew`}>
                  {entriesCollection[idx] && entriesCollection[idx][idx2] && (
                    <span className={`h-full w-full flex justify-center items-center ${bgCalculator()[idx][idx2]}`}>
                      {entriesCollection[idx][idx2].toUpperCase()}
                    </span>
                  )}
                  {entriesCollection.length === idx && currentEntry[idx2] && (
                    <span className={`h-full w-full flex justify-center items-center`}>
                      {currentEntry[idx2].toUpperCase()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </div>
      <Keyboard  />
    </>
  )
}

function Keyboard({  }) {
  return (
    <div className='w-full flex justify-center items-center'>
      <div className='flex flex-col gap-10 items-center'>
        <div>
          {
            firstLine.map(item => {
              return (
                <span className='mx-1 cursor-pointer text-white p-4 bg-graylight rounded-lg'>{item.toUpperCase()}</span>
              )
            })
          }
        </div>
        <div>

          {
            secondLine.map(item => {
              return (
                <span className='mx-1 cursor-pointer text-white p-4 bg-graylight rounded-lg'>{item.toUpperCase()}</span>
              )
            })
          }
        </div>
        <div>
          {
            thirdLine.map(item => {
              return (
                <span className='mx-1 cursor-pointer text-white p-4 bg-graylight rounded-lg'>{item.toUpperCase()}</span>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default App
