const board = document.getElementById('container');
const startBtn = document.getElementById('start-btn');
const resultBoxWin = document.querySelector('#result-win-div');
const startBox = document.getElementById('start-box');

startBtn.onclick = () => {
    board.style.display = 'block';
    startBox.style.display = 'none';
};

window.onload = function () {

    const w = window.innerWidth;
    const h = window.innerHeight;
    const tsw = (w > h) ? h : w;
    const sw = (tsw - 16) / 175;

    const container = document.getElementById('container');
    container.innerHTML = '';

    for (let n = 0; n < 64; n++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.classList.add('s' + n);
        square.style.height = sw + 'rem';
        square.style.width = sw + 'rem';
        square.style.top = 4 + (h - tsw) / 28 + sw * (Math.floor(n / 8)) + 'rem';
        square.style.left = 4 + (w - tsw) / 28 + sw * (Math.floor(n % 8)) + 'rem';
        square.style.fontSize = sw * 3 / 4 + 'rem';
        container.appendChild(square);
    }

    const fonts = {
        k: '&#9818;',
        q: '&#9819;',
        r: '&#9820',
        b: '&#9821',
        n: '&#9822',
        p: '&#9823',
        l: '&#9812;',
        w: '&#9813;',
        t: '&#9814',
        v: '&#9815',
        m: '&#9816',
        o: '&#9817'

    };

    let values = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 't', 'm', 'v', 'w', 'l', 'v', 'm', 't'];
    let ck = false;
    let cr1 = false;
    let cr2 = false;
    let cl;

    const sqs = document.getElementsByClassName('square');

    for (let n = 0; n < 64; n++) {
        if (values[n] !== 0) {
            sqs[n].innerHTML = fonts[values[n]];
        }
        sqs[n].addEventListener('click', check);
    }

    function updateSquarecolor() {
        for (let n = 0; n < 64; n++) {
            if (Math.floor(n / 8) % 2 === 0) {
                if (n % 2 === 0) {
                    sqs[n].style.background = '#FFFFE0';
                } else {
                    sqs[n].style.background = '#C4A484';
                }
            } else {
                if (n % 2 === 1) {
                    sqs[n].style.background = '#FFFFE0';
                } else {
                    sqs[n].style.background = '#C4A484  ';
                }
            }
        }
    }

    updateSquarecolor();

    let moveable = false;
    let moveTarget = '';
    let moveScopes = [];

    function checkBlack(n, values) {
        const target = values[n];
        const scopes = [];
        let x = n;

        if (target === 'o') {
            x -= 8;
            if ('prnbkq'.indexOf(values[x - 1]) >= 0 && x % 8 != 0) {
                scopes.push(x - 1);
            }
            if ('prnbkq'.indexOf(values[x + 1]) >= 0 && x % 8 != 7) {
                scopes.push(x + 1);
            }
            if (x >= 0 && values[x] === 0) {
                scopes.push(x);
                if (x >= 40) {
                    if (x - 8 >= 0 && values[x - 8] === 0) {
                        scopes.push(x - 8);
                    }
                }
            }
        } else if (target === 't') {
            x = n;
            x -= 8;
            while (x >= 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x -= 8;
            }
            x = n;
            x += 8;
            while (x < 64) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x += 8;
            }
            x = n;
            x++;
            while (x % 8 != 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x++;
            }
            x = n;
            x--;
            while (x % 8 != 7) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x--;
            }
        } else if (target === 'm') {
            x = n;
            if (x % 8 > 1 && x % 8 < 6) {
                x -= 17;
                if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x -= 15;
                if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }

                x = n;
                x -= 10;
                if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x -= 6;
                if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 6;
                if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 10;
                if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 15;
                if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 17;
                if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
            } else {
                x = n;
                if (x % 8 <= 1) {
                    x = n;
                    x -= 15;
                    if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x -= 6;
                    if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x += 10;
                    if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x += 17;
                    if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                }
                x = n;
                if (x % 8 === 1) {
                    x -= 17;
                    if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x += 15;
                    if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                }
                if (x % 8 >= 6) {
                    x = n;
                    x -= 17;
                    if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x -= 10;
                    if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x += 6;
                    if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x += 15;
                    if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                }
                x = n;
                if (x % 8 === 6) {
                    x = n;
                    x -= 15;
                    if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x += 17;
                    if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                }
            }
        } else if (target === 'v') {
            x = n;
            x -= 9;
            while (x >= 0 && x % 8 !== 7) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x -= 9;
            }
            x = n;
            x += 7;
            while (x < 64 && x % 8 !== 7) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x += 7;
            }
            x = n;
            x += 9;
            while (x % 8 !== 0 && x % 8 !== 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x += 9;
            }
            x = n;
            x -= 7;
            while (x % 8 !== 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x -= 7;
            }
        } else if (target === 'w') {
            x = n;
            x -= 8;
            while (x >= 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x -= 8;
            }
            x = n;
            x += 8;
            while (x < 64) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x += 8;
            }
            x = n;
            x++;
            while (x % 8 !== 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x++;
            }
            x = n;
            x--;
            while (x % 8 != 7) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x--;
            }
            x = n;
            x -= 9;
            while (x >= 0 && x % 8 !== 7) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x -= 9;
            }
            x = n;
            x += 7;
            while (x < 64 && x % 8 !== 7) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x += 7;
            }
            x = n;
            x += 9;
            while (x % 8 !== 0 && x % 8 !== 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x += 9;
            }
            x = n;
            x -= 7;
            while (x % 8 !== 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('prnbqk'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x -= 7;
            }
        } else if (target === 'l') {
            x = n;
            x += 8;
            if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x -= 8;
            if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            if (x % 8 > 0) {
                x = n;
                x -= 1;
                if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x -= 9;
                if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }

                x = n;
                x += 7;
                if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
            }
            x = n;
            if (x % 8 < 7) {
                x = n;
                x += 1;
                if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 9;
                if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x -= 7;
                if (('prnbqk'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
            }
            x = n;
            if (!ck) {
                cl = false;
                if (!cr2) {
                    //    cl = false;
                    if (values[n + 1] === 0 && values[n + 2] === 0 && values[n + 3] === 't') {
                        scopes.push(x + 2);
                        cl = true;
                    }
                }
                if (!cr1) {
                    //    cl = false;
                    if (values[n - 1] === 0 && values[n - 2] === 0 && values[n - 3] === 0 && values[n - 4] === 't') {
                        scopes.push(x - 2);
                        cl = true;
                    }
                }
            }
        }
        if (scopes.length) return scopes;
    }

    function checkWhite(n, values) {
        const target = values[n];
        const scopes = [];
        let x = n;
        if (target === 'p') {
            x += 8;
            if ('otmvlw'.indexOf(values[x - 1]) >= 0 && x % 8 != 0) {
                scopes.push(x - 1);
            }
            if ('otmvlw'.indexOf(values[x + 1]) >= 0 && x % 8 != 7) {
                scopes.push(x + 1);
            }
            if (x < 64 && values[x] === 0) {
                scopes.push(x);
                if (x <= 23) {
                    if (x + 8 >= 0 && values[x + 8] === 0) {
                        scopes.push(x + 8);
                    }
                }
            }
        } else if (target === 'r') {
            x = n;
            x -= 8;
            while (x >= 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x -= 8;
            }
            x = n;
            x += 8;
            while (x < 64) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x += 8;
            }
            x = n;
            x++;
            while (x % 8 !== 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x++;
            }
            x = n;
            x--;
            while (x % 8 !== 7) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x--;
            }
        } else if (target === 'n') {
            x = n;
            if (x % 8 > 1 && x % 8 < 6) {
                x -= 17;
                if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x -= 15;
                if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }

                x = n;
                x -= 10;
                if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x -= 6;
                if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 6;
                if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 10;
                if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 15;
                if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 17;
                if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
            } else {
                x = n;
                if (x % 8 <= 1) {
                    x = n;
                    x -= 15;
                    if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x -= 6;
                    if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x += 10;
                    if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x += 17;
                    if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                }
                x = n;
                if (x % 8 === 1) {
                    x -= 17;
                    if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x += 15;
                    if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                }
                if (x % 8 >= 6) {
                    x = n;
                    x -= 17;
                    if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x -= 10;
                    if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x += 6;
                    if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x += 15;
                    if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                }
                x = n;
                if (x % 8 === 6) {
                    x = n;
                    x -= 15;
                    if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                    x = n;
                    x += 17;
                    if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                        scopes.push(x);
                    }
                }
            }
        } else if (target === 'b') {
            x = n;
            x -= 9;
            while (x >= 0 && x % 8 !== 7) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x -= 9;
            }
            x = n;
            x += 7;
            while (x < 64 && x % 8 !== 7) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x += 7;
            }
            x = n;
            x += 9;
            while (x % 8 !== 0 && x % 8 !== 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x += 9;
            }
            x = n;
            x -= 7;
            while (x % 8 !== 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x -= 7;
            }
        } else if (target === 'q') {
            x = n;
            x -= 8;
            while (x >= 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x -= 8;
            }
            x = n;
            x += 8;
            while (x < 64) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x += 8;
            }
            x = n;
            x++;
            while (x % 8 !== 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x++;
            }
            x = n;
            x--;
            while (x % 8 !== 7) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x--;
            }
            x = n;
            x -= 9;
            while (x >= 0 && x % 8 !== 7) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x -= 9;
            }
            x = n;
            x += 7;
            while (x < 64 && x % 8 !== 7) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x += 7;
            }
            x = n;
            x += 9;
            while (x % 8 != 0 && x % 8 !== 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x += 9;
            }
            x = n;
            x -= 7;
            while (x % 8 != 0) {
                if (values[x] === 0) {
                    scopes.push(x);
                } else if ('otmvlw'.indexOf(values[x]) >= 0) {
                    scopes.push(x);
                    break;
                } else {
                    break;
                }
                x -= 7;
            }
        } else if (target === 'k') {
            x = n;
            x += 8;
            if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            x -= 8;
            if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                scopes.push(x);
            }
            x = n;
            if (x % 8 > 0) {
                x = n;
                x -= 1;
                if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x -= 9;
                if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }

                x = n;
                x += 7;
                if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
            }
            x = n;
            if (x % 8 < 7) {
                x = n;
                x += 1;
                if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x += 9;
                if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
                x = n;
                x -= 7;
                if (('otmvlw'.indexOf(values[x]) >= 0 || values[x] === 0) && x < 64 && x >= 0) {
                    scopes.push(x);
                }
            }
        }
        if (scopes.length) return scopes;
    }

    let myTurn = true;

    function check() {
        if (myTurn) {
            const n = Number(this.classList[1].slice(1));

            let scopes = checkBlack(n, values) || [];

            const x = n;

            if (!moveable) {
                if (scopes.length > 0) {
                    moveable = true;
                    moveTarget = n;
                    moveScopes = scopes.join(',').split(',');
                }
            } else {
                if (moveScopes.indexOf(String(n)) >= 0) {
                    const checkArr = [];
                    let saveKing = false;
                    for (let z = 0; z < 64; z++) {
                        checkArr[z] = values[z];
                    }

                    checkArr[n] = checkArr[moveTarget];
                    checkArr[moveTarget] = 0;

                    for (let y = 0; y < 64; y++) {
                        if ('prnbkq'.indexOf(checkArr[y]) >= 0) {
                            const checkScp = checkWhite(y, checkArr) || [];
                            for (let z = 0; z < checkScp.length; z++) {
                                if (checkArr[checkScp[z]] === 'l') {
                                    if (!saveKing) {
                                        alert('Its a CHECK');
                                        saveKing = true;
                                    }
                                }
                            }
                        }
                    }

                    if (!saveKing) {
                        values[n] = values[moveTarget];
                        values[moveTarget] = 0;
                        if (cl) {
                            if (n === 62 && moveTarget === 60) {
                                values[63] = 0;
                                values[61] = 't';
                            } else if (n === 58 && moveTarget === 60) {
                                values[59] = 't';
                                values[56] = 0;
                            }
                        }
                        if (moveTarget === 60) {
                            ck = true;
                        } else if (moveTarget === 63) {
                            cr2 = true;
                        } else if (moveTarget === 56) {
                            cr1 = true;
                        }
                        if (values[n] === 'o' && n < 8) {
                            values[n] = 'w';
                        }
                        moveable = false;
                        scopes = [];
                        myTurn = false;
                        setTimeout(chooseTurn, 1000);
                    }
                } else {
                    moveScopes = [];
                    moveable = false;
                }
            }

            updateSquarecolor();

            for (let x = 0; x < 64; x++) {
                sqs[x].innerHTML = fonts[values[x]];
                if (values[x] === 0) {
                    sqs[x].innerHTML = '';
                }
            }

            for (let x = 0; x < scopes.length; x++) {
                sqs[scopes[x]].style.background = '#f45';// .classList.add("scope");
                //    alert(scopes)
            }
        }
    }

    function chooseTurn() {
        const approved = [];
        const actions = [];
        const effects = [];

        for (let n = 0; n < 64; n++) {
            if ('prnbqk'.indexOf(values[n]) >= 0) {
                const scopes = checkWhite(n, values) || [];
                for (let x = 0; x < scopes.length; x++) {
                    const tmp = [];
                    for (let xx = 0; xx < 64; xx++) {
                        tmp[xx] = values[xx];
                    }
                    let effect = 0;
                    let action = Math.random() * 3;
                    // Action value
                    const actionValue = tmp[scopes[x]];
                    if (actionValue === 'l') {
                        action = 100 + Math.random() * 3;
                    } else if (actionValue === 'w') {
                        action = 50 + Math.random() * 3;
                    } else if (actionValue === 'v') {
                        action = 30 + Math.random() * 3;
                    } else if (actionValue === 'm') {
                        action = 30 + Math.random() * 3;
                    } else if (actionValue === 't') {
                        action = 30 + Math.random() * 3;
                    } else if (actionValue === 'o') {
                        action = 15 + Math.random() * 3;
                    }
                    // Effect value
                    tmp[scopes[x]] = tmp[n];
                    tmp[n] = 0;
                    for (let y = 0; y < 64; y++) {
                        if ('otmvlw'.indexOf(values[y]) >= 0) {
                            const tmpScp = checkBlack(y, tmp) || [];
                            for (let z = 0; z < tmpScp.length; z++) {
                                const effectValue = tmp[tmpScp[z]];
                                if (effectValue == 'k') {
                                    if (effect < 100) {
                                        effect = 100;
                                    }
                                } else if (effectValue == 'q') {
                                    if (effect < 50) {
                                        effect = 50;
                                    }
                                } else if (effectValue == 'b') {
                                    if (effect < 30) {
                                        effect = 30;
                                    }
                                } else if (effectValue == 'n') {
                                    if (effect < 30) {
                                        effect = 30;
                                    }
                                } else if (effectValue == 'r') {
                                    if (effect < 30) {
                                        effect = 30;
                                    }
                                } else if (effectValue == 'p') {
                                    if (effect < 15) {
                                        effect = 15;
                                    }
                                }
                            }
                        }
                    }

                    actions.push(action);
                    effects.push(effect);
                    approved.push(n + '-' + scopes[x]);
                }
            }
        }

        const bestEffect = Math.min.apply(null, effects);
        if (bestEffect >= 100) {
            alert('You Win');
            container.style.display = 'none';
            localStorage.setItem('fourth-level-completed', 'true');
            window.location.href = '../win-page.html';
            setTimeout(() => {
                resultBoxWin.classList.add('show');
            }, 800);
            setTimeout(function () {
                values = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 't', 'm', 'v', 'w', 'l', 'v', 'm', 't'];
            }, 100);
        }

        const tmpA = [];
        const tmpB = [];
        const tmpC = [];
        let bestMove = '';

        for (let n = 0; n < effects.length; n++) {
            if (effects[n] === bestEffect) {
                tmpA.push(actions[n]);
                tmpB.push(approved[n]);
                tmpC.push(effects[n]);
            }
        }
        bestMove = tmpB[tmpA.indexOf(Math.max.apply(null, tmpA))];
        //    alert(effects)
        // alert(bestMove);

        if (bestMove) {
            values[Number(bestMove.split('-')[1])] = values[Number(bestMove.split('-')[0])];
            values[Number(bestMove.split('-')[0])] = 0;
            if (values[Number(bestMove.split('-')[1])] === 'p' && Number(bestMove.split('-')[1]) >= 56) {
                values[Number(bestMove.split('-')[1])] = 'q';
            }

            sqs[bestMove.split('-')[1]].style.background = '#aaf';
            sqs[bestMove.split('-')[0]].style.background = '#aaf';

            for (let x = 0; x < 64; x++) {
                sqs[x].innerHTML = fonts[values[x]];
                if (values[x] === 0) {
                    sqs[x].innerHTML = '';
                }
            }
            myTurn = true;
        } else {
            alert('You Win');
        }
    }
};
// chooseTurn();
