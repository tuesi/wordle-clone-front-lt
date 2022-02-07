import React, { useState } from "react";
import './Game.css';

const boxes = ['', '', '', '', '', ''];
const initialRows = [boxes,boxes,boxes,boxes,boxes,boxes];
const initialLetters = [['E', ''], ['Ę', ''], ['Ė', ''], ['R', ''], ['T', ''], ['Y', ''], ['U', ''], ['Ų', ''], ['Ū', ''], ['I', ''], ['Į', ''], ['O', ''], ['P', ''], ['A', ''], ['Ą', ''], ['S', ''], ['Š', ''], ['D', ''], ['F', ''], ['G', ''], ['H', ''], ['J', ''], ['K', ''], ['L', ''], ['Z', ''], ['Ž', ''], ['C', ''], ['Č', ''], ['V', ''], ['B', ''], ['N', ''], ['M', '']];
const letterPositions = ['E', 'Ę', 'Ė', 'R', 'T', 'Y', 'U', 'Ų', 'Ū', 'I', 'Į', 'O', 'P', 'A', 'Ą', 'S', 'Š', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'Ž', 'C', 'Č', 'V', 'B', 'N', 'M'];
const box = "box";

function Game() {

  const [rows, setRows] = useState(initialRows);
  const [boxIndex, setBoxIndex] = useState(0);
  const [rowIndex, setRowIndex] = useState(0);
  const [letters, setLetters] = useState(initialLetters);

  var addLetter = (letter) => {
    if(boxIndex < boxes.length){
      let newRows = [...rows];
      let newBoxes = [...rows[rowIndex]];
      newBoxes[boxIndex] = letter;
      newRows[rowIndex] = newBoxes;
      setRows(newRows);
      setBoxIndex(boxIndex + 1);
    }
  }

  var removeLetter = () => {
    var newRows = [...rows];
    var newBoxes = [...rows[rowIndex]];
    newBoxes[boxIndex-1] = '';
    newRows[rowIndex] = newBoxes;
    setRows(newRows);
    if(boxIndex > 0){
      setBoxIndex(boxIndex - 1);
    }
  }

  var checkWord = () => {
    if(!rows[rowIndex].includes('')){
      var count = 0;
      var newRows = [...rows];
      var newBoxes = [...rows[rowIndex]];
      var newLetters = [...letters];
      var response;
      fetch('http://localhost:8000/checkWord?word='+rows[rowIndex].join(""))
      .then(res => res.json())
      .then(result => {
        response = result;
        if(response !== "fail"){
          for(var i = 0; i < 6; i++){
            var currentLetter = rows[rowIndex][i];
            var letter = currentLetter[0];
            if(response[i] === "correct"){
              count++;
              newLetters[letterPositions.indexOf(letter)] = [letter, "correct"];
              newBoxes[i] = [newRows[rowIndex][i], "correct"];
              newRows[rowIndex] = newBoxes;
            }
            else if (response[i] === "contains"){
              if(newLetters[letterPositions.indexOf(letter)][1] !== "correct") {
                newLetters[letterPositions.indexOf(letter)] = [letter, "contains"];
              }
              newBoxes[i] = [newRows[rowIndex][i], "contains"];
              newRows[rowIndex] = newBoxes;
            }
            else {
              if(newLetters[letterPositions.indexOf(letter)][1] !== "correct" && newLetters[letterPositions.indexOf(letter)][1] !== "contains") {
                newLetters[letterPositions.indexOf(letter)] = [letter, "grey"];
              }
              newBoxes[i] = [newRows[rowIndex][i], "none"];
              newRows[rowIndex] = newBoxes;
            }
          }
          setRows(newRows);
          setLetters(newLetters);
          if(count > 5){
            console.log("CORRECT!");
          }
          if(rowIndex < rows.length){
            setRowIndex(rowIndex + 1);
            setBoxIndex(0);
          }
        }
      });
    }
  }
  
  return (
    <div className="Game">
      <div className="game-box">
        {rows.map((item, index)=>{
          return <div className="row" key={index}>
                    {item.map((item,index)=>{
                      return <div className={box +" "+ item[1]} key={index}>{item[0]}</div>
                    })}
                </div>
        })}
        <div className="keyboard">
          {
            letters.map((item,index) => {
              return <button className={"keyboard-button" + " "+item[1]} onClick={() => addLetter(item[0])} key={index}>{item[0]}</button>
            })
          }
          <button onClick={checkWord}>ENTER</button>
          <button onClick={removeLetter}>delete</button>
        </div>
      </div>
    </div>
  );
}

export default Game;
