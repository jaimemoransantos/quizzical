import React from 'react'
import {useState} from 'react'
import {useEffect} from 'react'

export default function QuestionBox(props){
    const [selected, setSelected]=useState(-1)
    const [checked, setChecked]=useState(false)
    const [correct, setCorrect]=useState(false)
    let puntaje = 0
    const answer = props.correct
    
    function handleClick(index){
        setSelected(index)
        props.options.map((option, index)=>{
            if(option === answer){
                setCorrect(index)
                return index
            }
        })
    }
    
    useEffect(()=>{
        setChecked(selected===correct)
    }, [selected])
    
    useEffect(()=>{
        if(!props.checking){
            props.setPuntaje(prevPuntaje => [])
            setSelected(-1)
            setSelected(false)
            setCorrect(false)
        }
        props.setPuntaje(prevPuntaje => [...prevPuntaje, puntaje])
        
    }, [props.checking])
    
    
    const options = props.options.map((option, index)=>{
                    let selectedClass = "option"
                    let checkColor = "option"
                    if (selected === index) {
                        selectedClass += " selected"
                    }
                    
                    if((index === correct)&&(selected===index)&&props.checking){
                        checkColor = 'correct'
                        puntaje =1
                    }else if((index !== correct)&&(selected===index)&&props.checking){
                        checkColor = 'error'
                    }else if((index === correct)&&(selected!==index)&&props.checking){
                        checkColor = 'correct'
                    }
                        
                    return <div 
                            key={index}
                            id={index} 
                            className={!props.checking? selectedClass:checkColor} 
                            onClick={()=>handleClick(index)}
                            >
                                {option}
                            </div>
                    })
    
    return(
        <div>
            <p className="question">{props.question}</p>
            <div className="optionsContainer">
                {options}
            </div>
        </div>
    )
}
