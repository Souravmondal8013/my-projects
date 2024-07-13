import { useState, useCallback, useEffect ,useRef} from 'react'


function App() {
  const [length, setlength] = useState(8)
  const [numberallowed, setnumberallowed] = useState(false)
  const [charallowed, setcharallowed] = useState(false)
  const [password, setpassword] = useState("")

  const passwordref = useRef(null)

  const copypasswordtoclipboard =useCallback (()=>{
    passwordref.current?.select()
window.navigator.clipboard.writeText(password)
  },[password])

  const passwordgenerator = useCallback(() => {

    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if (numberallowed) str += "1234567890"
    if (charallowed) str += "!@#$%^&*()_+"

    for (let i = 1; i <= length; i++) {
      let char = Math.random() * str.length + 1
      pass += str.charAt(char)

    }
    setpassword(pass)

  }, [length, numberallowed, charallowed, setpassword])

  useEffect(() => {
    passwordgenerator()
  }, [length, numberallowed, charallowed, passwordgenerator])
  return (
    <>

      <div className='w-full max-w-md max shadow-md rounded-md my-8 mx-8 px-4 py-3 text-orange-400 bg-gray-500 content-center'>
        <h1 className=' text-center text-white '>Password Genarator</h1>
        <div className='flex shadow-md rounded-lg overflow-hidden mb-4'>
          <input type="text" value={password} placeholder='password' className='outline-none w-full py-1 px-3' readOnly ref={passwordref}/>
          <button className='outline-none bg-blue-700 text-white px-3 py-.5 shrink-0' onClick={copypasswordtoclipboard}>copy</button>
        </div>
        <div className='flex text-sm gap-x-2'>
          <div className='flex items-center gap-x-l'>
            <input type="range" min={8} max={20} value={length} className='cursor-pointer' onChange={(e) => { setlength(e.target.value) }} />
            <label>length: {length}</label>
          </div>
          <div className='flex items-center gap-x-l'>
            <input type="checkbox" defaultChecked={numberallowed} id="numberinput" onChange={() => { setnumberallowed((prev) => !prev) }} />
            <label> Add Number</label>
          </div>
          <div className='flex items-center gap-x-l'>
            <input type="checkbox" defaultChecked={charallowed} id="characterinput" onChange={() => { setcharallowed((prev) => !prev) }} />
            <label> Add Chracters</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
