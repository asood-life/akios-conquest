// reset the environment when user clicks the PLAY AGAIN button

const navigationButton = document.getElementById('play-again')

navigationButton.onclick = () => {
    localStorage.setItem('first-level-completed', 'false')
    localStorage.setItem('second-level-completed', 'false')
    localStorage.setItem('third-level-completed', 'false')
    window.location.href = '../index.html'
}