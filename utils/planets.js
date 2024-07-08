// retreive values from local storage and unlock planets 

isFirstLevelCompleted = localStorage.getItem('first-level-completed')
isSecondLevelCompleted = localStorage.getItem('second-level-completed')
isThirdLevelCompleted = localStorage.getItem('third-level-completed')

if (isFirstLevelCompleted == 'true') {
    planetTwo = document.getElementById('planet-two');
    planetTwo.src = "../images/planet-two.png";

    planetTwoDiv = document.getElementById('second-planet-div');
    planetTwoDiv.style.pointerEvents = 'all';
}

if (isSecondLevelCompleted == 'true') {
    planetThree = document.getElementById('planet-three');
    planetThree.src = "../images/planet-three.png";

    planetThreeDiv = document.getElementById('third-planet-div');
    planetThreeDiv.style.pointerEvents = 'all';
}

if (isThirdLevelCompleted == 'true') {
    planetFour = document.getElementById('planet-four');
    planetFour.src = "../images/planet-four.png";

    planetFourDiv = document.getElementById('fourth-planet-div');
    planetFourDiv.style.pointerEvents = 'all';
}