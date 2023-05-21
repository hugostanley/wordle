import { useEffect, useState } from 'react'

type Entry = string[]
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
        if (state.length < 6 && isAlphabetical && key.length === 1) {
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
    if (enterPressed === true && currentEntryState.length === 5) {
      setEntriesCollectionState(state => [...state, currentEntryState])
      setCurrentEntryState([])
    } else if(enterPressed && currentEntryState.length !== 5) {
      alert('Must type five letter word')
    }
  }, [enterPressed])

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
      <Keyboard />
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

function TextBoard({ entriesCollection, currentEntry, enterPressed }: { entriesCollection: EntriesCollecton, currentEntry: Entry, enterPressed: boolean }) {
  const correctWord = "loser".split('')
  const arr = Array.from({ length: 6 }, () => "test")
  const wordArr = Array.from({ length: 5 }, () => "test")

  const findDuplicates = (arr: Entry) => arr.filter((item, index) => arr.indexOf(item) !== index)

  function bgCalculator(str: string, idx: number) {
    if (correctWord.includes(str) && correctWord.indexOf(str) === idx) {
      return 'bg-green-500'
    }

    if (correctWord.includes(str) && correctWord.indexOf(str) !== idx) {
      return 'bg-yellow-500'
    }

    if (!correctWord.includes(str)) {
      return 'bg-gray-500'
    }
  }

  return (
    <div className='w-full h-[60%] flex flex-col justify-center items-center'>
      {arr.map((_item, idx) => {
        return (
          <div className='flex' key={idx}>
            {wordArr.map((_item2, idx2) => (
              <div key={idx2} className={`m-1 h-16 font-bold text-xl w-16 border-[2px] border-gray-500`}>
                {entriesCollection[idx] && entriesCollection[idx][idx2] && (
                  <span className={`h-full w-full flex justify-center items-center ${bgCalculator(entriesCollection[idx][idx2], idx2)}`}>
                    {entriesCollection[idx][idx2].toUpperCase()}
                  </span>
                )}
                {entriesCollection.length === idx && currentEntry[idx2] && (
                  <span className={`h-full w-full flex justify-center items-center ${enterPressed && currentEntry.length > 0 && entriesCollection.lengt > 0 && bgCalculator(currentEntry[idx2], idx2)}`}>
                    {currentEntry[idx2].toUpperCase()}
                  </span>
                )}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

function Keyboard() {
  const firstLine = 'qwertyuiop'.split('')
  return (
    <div className='w-full'>
      {
        firstLine.map(item => {
          return (
            <span className='text-white'>{item}</span>
          )
        })
      }
    </div>
  )
}

export default App
