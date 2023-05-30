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
      <div className="mainWrapper">
        <div className="mainConten">
          <div className="imageHolder">
            {imageURL && 
            <img 
              src={imageURL} 
              alt='Upload Preview' 
              crossOrigin='anonymous'
              ref={imageRef}
            />}
          </div>
          {results.length > 0 && 
          <div 
            className='resultsHolder'>
              {results.map((result, index) => {
              return (
                <div 
                  className='result' 
                  key={result.className}>
                    <span 
                      className='name'>
                        {result.className}
                    </span>
                    <span 
                      className='confidence'>
                        Confidence level: {(result.probability * 100).toFixed(2)}% 
                        {index === 0 && 
                        <span 
                          className='bestGuess'>
                            Best Guess
                        </span>
                        }
                    </span>
                </div>
                            )
              })}
          </div>}
        </div>
        {imageURL && 
        <button 
          className='button' 
          onClick={identify}>
            Identify Image
        </button>}
      </div>
          {history.length > 0 &&
            <div className="recentPredictions">
            <h2>Recent Images</h2>
            <div className="recentImages">
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
    </section>
  );
}

export default App;
