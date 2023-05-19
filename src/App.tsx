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
    setCurrentEntryState(state => {
      setEnterPressed(false)
      if (state.length < 6 && isAlphabetical && key.length === 1) {
        return [...state, e.key]
      } else {
        return state
      }
    })

    if (e.key === 'Enter') {
      setEnterPressed(true)
    }
  }


  useEffect(() => {
    if (enterPressed === true) {
      setEntriesCollectionState(state => [...state, currentEntryState])
      setCurrentEntryState([])
    }
  }, [enterPressed])

  /* Listen for keyboard types within the window object. 
   *
   * Make sure to remove the event listener throught the useEffect cleanup function 
   * to avoid double entries
   *
   * */
  useEffect(() => {
    window.addEventListener('keydown', setKeyboardInputToEntry)
    return () => {
      window.removeEventListener('keydown', setKeyboardInputToEntry)
    }
  }, [])

  return (
    <div>
      {entriesCollectionState.map((arr, idx) => {
        return (
          <>
            <div key={idx}>
              {
                arr.map(str => {
                  return str
                })}
            </div>
          </>
        )
      })}
      <div>
        {currentEntryState}
      </div>
    </div>
  )
}

export default App
