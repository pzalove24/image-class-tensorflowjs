import { useState, useEffect , useRef} from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Loader } from './components';


function App() {
  const [isModelLoading, setisModelLoading] = useState(false);
  const [model, setModel] = useState([]);
  const [imageURL, setImageURL] = useState(null)
  const [results, setResults] = useState([])
  const [history, setHistory] = useState([])
  

  const imageRef = useRef();
  const textInputRef = useRef();
  const fileInputRef = useRef();

  const loadModel = async() => {
    setisModelLoading(true)
    try {
      const model = await mobilenet.load();
      setModel(model);
      setisModelLoading(false);
    } catch (error) {
      console.log(error);
      setisModelLoading(false);
    }
  }

  const uploadImage = (e) => {
    const {files} = e.target
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0])
      setImageURL(url)
    }else {
      setImageURL(null)
    }
  }

  const identify = async () => {
    textInputRef.current.value = ''
    const results = await model.classify(imageRef.current)
    setResults(results);
  }

  const handleOnChange = (e) => {
    setImageURL(e.target.value);
    setResults([]);
  }

  const triggerUpload = () => {
    fileInputRef.current.click();
  }

  useEffect(() => {
    loadModel()

  }, [])

  useEffect(() => {
    if(imageURL) {
      setHistory([imageURL, ...history])
    }
  }, [imageURL])
  
  if (isModelLoading) {
    return <div 
    className='flex justify-center items-center'>
      Model Loading...
      <div className='flex justify-center items-center'>
        <Loader />
      </div>
    </div>
  }

  console.log(results)

  return (
    <section className="max-w-7xl mx-auto">
      <div>
      <h1 className='font-extrabold text-[#263caa] text-[32px]'>
        Image Identification by Peeratchai
      </h1>
      </div>
      <div 
        className='inputHolder'>
        <input 
          type='file' 
          accept='image/*' 
          capture='camera' 
          className='uploadInput'
          onChange={uploadImage}
          ref={fileInputRef}
        />
        <button 
          className='uploadImage' 
          onClick={triggerUpload}> 
          Upload Image 
        </button>
        <div className='mt-5'>
        <input 
          type='text' 
          placeholder='Paster image URL' 
          ref={textInputRef}
          onChange={handleOnChange}
          className=' bg-gray-50 border border-gray-300 text-gray-900
          text-sm rounded-lg focus:ring-[#4649ff] focus:border-[#4649ff]
          outline-none block w-full p-3'
        />
        </div>
      </div>
      <div className="mt-5">
        <div className="mt-5">
          <div className="mt-5 flex h-screen w-full rounded-md 
          justify-center items-center bg-gray-100">
            {imageURL && 
            <img 
              src={imageURL} 
              alt='Upload Preview' 
              crossOrigin='anonymous'
              ref={imageRef}
              className='width="1308"'
            />}
          </div>
          <ul className='flex justify-center items-center mt-10
          bg-gray-100 py-1 sm:py-5 rounded-md'>
          {results.length > 0 && 
          <div 
            className='resultsHolder'>
              {results.map((result, index) => {
              return (
                <li 
                  className='result' 
                  key={result.className}>
                  <svg class="h-6 w-6 flex-none fill-sky-100 
                  stroke-sky-500 stroke-2" stroke-linecap="round" 
                  stroke-linejoin="round">
                  <circle cx="12" cy="12" r="11" />
                  <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                  </svg>
                    <p 
                      className='ml-4'>
                        {result.className}
                        Confidence level: {(result.probability * 100).toFixed(2)}% 
                        {index === 0 && 
                        <p 
                          className='font-extrabold text-[#263caa]'>
                            Best Guess
                        </p>
                        }
                    </p>
                </li>
                )
              })}
          </div>}
          </ul>
          {imageURL && 
        <button 
          type='button' 
          onClick={identify}
          className='text-white bg-green-700 font-medium
          rounded-md text-sm w-full px-5 py-2.5 text-center 
          flex justify-center items-center mt-10'>
            Identify Image
        </button>}
        </div>
      </div>
      <div className='mt-10 font-extrabold text-[#263caa] text-[32px]'>
          {history.length > 0 &&
            <div className="recentPredictions">
            <h2>Recent Images</h2>
            <div className="grid lg:grid-cols-4 sm:grid-cols-3
            xs:grid-cols-2 grid-cols-1 gap-3 justify-center items-center">
              {history.map((image, index) => {
                return (
                  <div className='recentPrediction' key={`${image}${index}`}>
                    <img src={image} alt='Recent Prediction'
                    />
                  </div>
                )
              })}
            </div>
          </div>}
        </div>
    </section>
  );
}

export default App;
