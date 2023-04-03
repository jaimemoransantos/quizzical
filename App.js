import React from 'react'
import {useState} from 'react'
import {useEffect} from 'react'
import QuestionBox from './QuestionBox'


export default function App(){
    const [playing, setPlaying] = useState(false)
    const [questionsData, setQuestionsData] = useState([])
    const [checking, setChecking] = useState(false)
    const [puntaje, setPuntaje] = useState([])

    function htmldecode(input) {
        const parser = new DOMParser().parseFromString(input, "text/html");
        return parser.documentElement.textContent;
    }
    
    async function getApiInfo(){
        const response = await fetch('https://opentdb.com/api.php?amount=5')
        const data = await response.json()
        const dataResults = data.results
        const questions = dataResults.map((question, index)=> {
                const incAns = question.incorrect_answers.map((incorrect)=>{
                    return htmldecode(incorrect)
                })
                return ({
                    id: index,
                    question: htmldecode(question.question),
                    options: [ htmldecode(question.correct_answer), ...incAns ]
                    .map(value => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value),
                    correct: htmldecode(question.correct_answer)
            })
        })
        setQuestionsData(questions)
    }
    
    
    function startPlaying(){
        getApiInfo()
        setPlaying(prev=>!prev)
        setPuntaje(prevPuntaje =>[])
    }

    console.log()
    return(
        <>
            <div className="menuContainer">
                {!playing && 
                        <>
                            <div className="topBlob">    
                                <img src="./images/blob2.png"/>
                            </div>
                            <div>
                                <div className="infoContainer">
                                    <h1>Quizzical</h1>
                                    <h3>Some description if needed</h3>
                                    <button 
                                        className="startButton"
                                        onClick={startPlaying}>
                                        Start quiz
                                    </button>
                                </div>
                            </div>
                            <div className="bottomBlob">
                                <img src="./images/blob1.png"/>
                            </div>
                        </>
                }
                {playing && <div className="masterContainer">
                        <div className="topBlob">    
                            <img src="./images/blob2.png"/>
                        </div>
                        <div className="questionsContainer">
                            {questionsData.map((info)=>{
                                return <QuestionBox 
                                            key={info.id}
                                            id={info.id} 
                                            question={info.question} 
                                            options={info.options}
                                            correct={info.correct}
                                            checking={checking}
                                            setPuntaje={setPuntaje}
                                        />
                            })}
                            <div className="checkButtonContainer">
                                {!checking && 
                                    <div className="checkButton" onClick={()=>setChecking(prev=>!prev)}>
                                        Check answers
                                    </div>
                                }
                                
                                {checking && 
                                    <div className="playAgainButton">
                                        You scored {puntaje.reduce(
                                                        (accumulator, currentValue) => accumulator + currentValue)}/5 correct answers
                                        <div className="checkButton" onClick={()=>{
                                            getApiInfo()
                                            setChecking(prev=>!prev)
                                            }}>
                                            Play again
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="bottomBlob">
                            <img src="./images/blob1.png"/>
                        </div>
                    </div>
                }
            
            </div>
        </>
    )
}