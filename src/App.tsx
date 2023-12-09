import { KeyboardEvent, useEffect, useState } from "react"
import { generate } from 'random-words'
import './App.css'

function App() {
  const [answer, setAnswer] = useState<string>('')
  const [visualAnswer, setVisualAnswer] = useState<string>('')

  const [isFocused, setIsFocused] = useState<boolean>(true)
  const [correct, setCorrect] = useState<number>(0)
  const [gameover, setGameover] = useState<boolean>(false)
  const [incorrect, setIncorrect] = useState<number>(0)
  const [currentWord, setCurrentWord] = useState<string>('')

  useEffect(() => {
    const generated = generate({
      exactly: 45,
      join: ' ',
    })

    setAnswer(generated)
    setVisualAnswer(generated)
  }, [])

  const handleReset = () => {
    setCorrect(0)
    setGameover(false)
    setIncorrect(0)
    setCurrentWord('')

    const generated = generate({
      exactly: 45,
      join: ' ',
    })

    setAnswer(generated)
    setVisualAnswer(generated)

    const customInput = document.querySelector('#input')
    customInput.focus() 
  }

  const checkGameover = () => {
    console.log(correct, answer.length)
    if (correct + 1 === answer.length) {
      setGameover(true)
      handleReset()
    }
  }

  const keyboardHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (gameover) {
      return
    }

    if (e.key === 'Backspace') {
      if (incorrect > 0) {
        setCurrentWord(currentWord.slice(0, currentWord.length - 1))
        setVisualAnswer(currentWord.slice(0, currentWord.length - 1) + answer.slice(correct))
        setIncorrect(incorrect - 1)
      }
    }
    
    console.log(e.key)
    
    const isCorrect = e.key.toLowerCase() === answer[correct].toLowerCase()
    if (isCorrect) { 
      setCurrentWord(currentWord + e.key.toLowerCase())
      setCorrect(correct + 1)
      setIncorrect(0)

      checkGameover()
    } else { 
      if (e.key.length > 1) {
        return
      }

      setIncorrect(incorrect + 1)
      setCurrentWord(currentWord + e.key.toLowerCase())
      
      const index = currentWord?.length
      const modifiedAnswer = visualAnswer.slice(0, index) + e.key.toLowerCase() + visualAnswer.slice(index)
      setVisualAnswer(modifiedAnswer)
    }
  }

  const handleFocus = () => {
    const input = document.querySelector('#input')
    input.focus()
    setIsFocused(true)
  }

  const handleBlur = () => {
    const customInput = document.querySelector('#customInput')
    customInput?.classList.remove('custom-input')
    // setIsFocused(false)
  }

  return (
    <div className="w-screen h-screen bg-slate-800 grid content-start">
      <div className='w-[80%] mx-auto mt-2 flex items-center h-max gap-4'>
        <img src='../public/keyboard.svg' className='w-16 h-14 opacity-50' />
        <h1 className='font-bold text-xl text-white opacity-50 pb-1 cursor-default'>TypingLearn</h1>
      </div>
      <div className='h-[80vh] grid justify-items-center'>
        <div className='w-[80%] mx-auto -translate-y-20 text-xl font-bold self-end mb-6 text-white grid items-center justify-between'>
          <div className={(currentWord.length > 0 ?'text-white' : 'text-transparent') + ' opacity-50'}>{currentWord.length}</div>
          <button className='absolute justify-self-center bg-slate-600 hover:bg-slate-500 px-4 pt-1 pb-2 h-max rounded transition transform' onClick={handleReset}>Start over</button>
          <div></div>
        </div>
        <div className={(gameover ? 'bg-red-400' : '') + ' relative w-[80%] h-[20%] mx-auto -translate-y-20'}>
          <div className={(isFocused ? '' : 'blur-sm') + " absolute text-2xl font-bold text-white opacity-50 whitespace-pre-wrap"} style={{width: "100%", height: "100%"}}
            onClick={handleFocus}
          >{visualAnswer}</div>
          <div className={(isFocused ? '' : 'blur-sm') + " absolute text-2xl font-bold text-white opacity-50 whitespace-pre-wrap"} id="customInput" style={{width: "100%", height: "100%"}}
            onClick={handleFocus}
          >{currentWord}</div>
          <input
            className="absolute text-transparent bg-transparent border-none outline-none"
            style={{width: "100%", height: "100%"}}
            type="text"
            value=""
            id="input"
            onKeyDown={keyboardHandler}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoFocus />
        </div>
      </div>
    </div>
  )
}

export default App
