var variables

function loadFromLocalStorage() {
    variables = loadVariablesFromLocalStorage()
    if (!variables) {
        variables = {numberOfTries : 1, numberOfLetters : 5, currentSquare : 1, correctWord : null, statistics : {correct : 0, total : 0, currentRecord : 0, bestRecord : 0},
        previousTries : [], previousColors : [], disableKeyboard : false, previousWord : null}
    }
    else {
        variables.numberOfTries = 1
        variables.currentSquare = 1
    }    
}

function saveVariablesToLocalStorage(data) {
    localStorage.setItem("variables", JSON.stringify(data))
}

function loadVariablesFromLocalStorage() {
    return JSON.parse(localStorage.getItem("variables"))
}

function getTodaysWord() {
    $.ajax({
        url : 'https://bojanmandic.com/databaseconnect.php',
        type : 'GET',
        success : (result) => {
            let data = JSON.parse(result)[0]   
            variables.correctWord = data.word

            if (variables.previousWord !== variables.correctWord) {
                variables.previousTries = []
                variables.previousColors = []
                variables.previousWord = variables.correctWord
                variables.disableKeyboard = false
            }
            $(".hint").text(data.function + ", " + data.meaning)
            keyboardInputHandler()
            virtualKeyboardHandler()
            timeUntillNewWord()
            
            if (variables.previousTries.length !== 0) {
                reloadContentOnScreen()
            }            
            exitButtonHandler()
            hintButtonHandler()
            statsButtonHandler()
            settingsButtonHandler()
            calculateTimeUntillNewWord()
        },
        error : () => {
            console.log ('error');
        }
      });
}

function keyboardInputHandler() {
    $(window).keydown(event => {
        var key = getPressedKey(event)
        key = key ? key.toLowerCase() : "$"
        handleKey(key)
    })
}

function getPressedKey(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which)
    if (keycode >= 65 && keycode <= 90) {
            return String.fromCharCode(keycode)
    }
    else if (keycode >= 219 && keycode <= 222){
        return ["š", "ž", "đ", "ć"][keycode - 219]
    }
    else if (keycode === 186) {
        return "č"
    }
    else if (keycode === 8){
        return "backspace"
    }
    else if (keycode === 13) {
        return "enter"
    }
}

function handleKey(key) {
    const validKeys = "qwertzuiopšđasdfghjklčćžyxcvbnm"
    if (!variables.disableKeyboard) {
        if (validKeys.includes(key)) {
            if (variables.currentSquare < variables.numberOfLetters + 1) {
                $(`.cell-${variables.numberOfTries}${variables.currentSquare}`).text(key.toUpperCase())
                variables.currentSquare++
            }
        }

        else if (key == "backspace") {
            if (variables.currentSquare > 1) variables.currentSquare--
            $(`.cell-${variables.numberOfTries}${variables.currentSquare}`).text("")
        }
        else if (key == "enter" && variables.numberOfTries < 7) {
            variables.disableKeyboard = true
            var userAnswer = getInputedWord()
            if (variables.currentSquare === 6) {
                variables.previousTries.push(userAnswer)
                var todaysWord = [...variables.correctWord]
                checkLetters(userAnswer, todaysWord)
            }
        }
    }
}

function checkLetters(userAnswer, correctAnswer) {
    let letterStatus = new Array(variables.numberOfLetters).fill(0)
    
    userAnswer.forEach((element, index) => {
        if (element === correctAnswer[index]) {
            letterStatus[index] = 1
            correctAnswer[index] = "-"
        }
    })
    userAnswer.forEach((element, index) => {
        if (correctAnswer.includes(element) && letterStatus[index] === 0) {
            letterStatus[index] = 2
            correctAnswer[correctAnswer.indexOf(element)] = "-"
        }
    })
    
    variables.previousColors.push(letterStatus)
    colorSquares(letterStatus, userAnswer)
}

function colorSquares(letterStatus, userAnswer) {
    let isOver = false
    let colors = ["grey", "green", "yellow"]

    letterStatus.forEach((element, index) => {
        setTimeout(() => {
            $(`.cell-${variables.numberOfTries}${index + 1}`).addClass(colors[element])
            $(`.${userAnswer[index].toLowerCase()}`).addClass(colors[element])
        }, (index + 1) * 200)
    })

    if (isCorrectAnswer(userAnswer)) {
        isOver = true
        variables.statistics.currentRecord++
        variables.statistics.correct++
        variables.statistics.total++
        if (variables.statistics.currentRecord > variables.statistics.bestRecord) variables.statistics.bestRecord = variables.statistics.currentRecord
        setTimeout(() => {
            variables.disableKeyboard = true
            saveVariablesToLocalStorage(variables)
            displayStats()
        }, variables.numberOfLetters * 210)
    }
    else if (variables.numberOfTries === 6) {
        isOver = true
        variables.statistics.currentRecord = 0
        variables.statistics.total++
        setTimeout(() => {
            displayStats()
            saveVariablesToLocalStorage(variables)
            
        }, variables.numberOfLetters * 210)
        
    }
    if (!isOver) {
        setTimeout(() => {
            variables.numberOfTries++
            variables.currentSquare = 1
            variables.disableKeyboard = false
            saveVariablesToLocalStorage(variables)
        }, variables.numberOfLetters * 210)
    }
}

function isCorrectAnswer(answer) {
    return variables.correctWord === answer.join("")
}

function getInputedWord() {
    var word = []
    for (var i = 0; i < variables.numberOfLetters; i++) {
        word.push($(`.cell-${variables.numberOfTries}${i+1}`).text()) 
    }
    return word
}

function virtualKeyboardHandler() {
    $(".key").click(event => {
        var  key = event.currentTarget.classList[1]
        handleKey(key)
    })
}

function timeUntillNewWord() {
    setInterval(() => {
        calculateTimeUntillNewWord()
    }, 1000)
}

function calculateTimeUntillNewWord() {
    let now = new Date()
    let serverDate = new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000)
    let tomorrowDate = new Date(serverDate)
    tomorrowDate.setHours(0,0,0,0)
    tomorrowDate.setDate(tomorrowDate.getDate() + 1)
    displayTime(timeDifference(tomorrowDate, serverDate))
}

function displayTime(time) {
    $(".time h2").text(`${("0" + time.hours).slice(-2) + ":" + ("0" + time.minutes).slice(-2) + ":" + ("0" + time.seconds).slice(-2)}`)
}

function reloadContentOnScreen() {
    if (variables.previousTries.length !== 0) {
        let colors = ["grey", "green", "yellow"]

        variables.previousTries.forEach((guess, guessNum) => {   
            if (isCorrectAnswer(guess)) displayStats()
            guess.forEach((letter, letterNum) => {
                $(`.cell-${variables.numberOfTries}${letterNum + 1}`).addClass(colors[variables.previousColors[guessNum][letterNum]])
                $(`.cell-${variables.numberOfTries}${variables.currentSquare}`).text(letter)
                $(`.${letter.toLowerCase()}`).addClass(colors[variables.previousColors[guessNum][letterNum]])
                variables.currentSquare++
            })
            variables.numberOfTries++
            variables.currentSquare = 1
        })
        if (variables.numberOfTries === 7) displayStats()
    }
}

function timeDifference(date1,date2) {
    var difference = date1.getTime() - date2.getTime();

    var daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24

    var hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60

    var minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60

    var secondsDifference = Math.floor(difference/1000);
    return {hours : hoursDifference, minutes : minutesDifference, seconds : secondsDifference}
}

function exitButtonHandler() {
    $(".exit-button").click(() => {
        $(".stats-overlay").css("display","none")
    })
}

function hintButtonHandler() {
    $(".reveal-hint").click(() => {
        $(".hint").toggleClass("invisible")
    })
}

function displayStats() {
    $(".stats-overlay").css("display","unset")
    $(".percentage-wrapper").html(`<h2>STATISTIKA</h2><div class="precentage-data"><div class="played"><h2>${variables.statistics.total}</h2><p>Odigranih</p></div><div class="won"><h2>${(variables.statistics.total === 0) ? 0 : Math.floor((variables.statistics.correct / variables.statistics.total) * 100)}</h2><p>Pogođenih %</p></div><div class="streak"><h2>${variables.statistics.currentRecord}</h2><p>Trenutni rekord</p></div><div class="max-streak"><h2>${variables.statistics.bestRecord}</h2><p>Najbolji rekord</p></div></div>`)
}

function statsButtonHandler() {
    $(".stats-button").click(() => {
        displayStats()
    })
}

function settingsButtonHandler() {
    $(".settings-button").click(() => {
        $(".stats-overlay").css("display","unset")
        $(".percentage-wrapper").html(`<h2>STATISTIKA</h2><div class="precentage-data"><div class="played"><h2>5</h2><p>Odigranih</p></div><div class="won"><h2>60</h2><p>Pogođenih %</p></div><div class="streak"><h2>1</h2><p>Trenutni rekord</p></div><div class="max-streak"><h2>1</h2><p>Najbolji rekord</p></div></div>`)
    })
}

$(document).ready(() => {
    loadFromLocalStorage()
    getTodaysWord()
})