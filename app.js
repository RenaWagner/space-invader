document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll(".grid div");
    const resultDisplay = document.querySelector('#result');
    const btn = document.querySelector('button');
    btn.disabled = false;

    let width = 15;
    let currentShooterIndex = 202;
    let currentInvaderIndex = 0;
    let alienInvadersTakenDown = [];
    let result = 0;
    let direction = 1;
    let invaderId;    

    const alienInvaders = 
    [0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39];

    for(let i = 0; i < alienInvaders.length; i++)
    {
        squares[alienInvaders[i]].classList.add('invader');
    }
    
    squares[currentShooterIndex].classList.add('shooter');

    function moveShooter(e)
    {
        squares[currentShooterIndex].classList.remove('shooter');
        switch(e.keyCode)
        {
            case 37:
                if(currentShooterIndex > 195)
                {
                    currentShooterIndex -= 1
                    break;
                }
            case 39:
                if(currentShooterIndex < 209)    
                {
                    currentShooterIndex += 1
                    break;
                }
        }
        squares[currentShooterIndex].classList.add('shooter');
    }
    

    function startGame() 
    {
        function moveInvaders()
        {
            const leftEdge = alienInvaders[0] % width === 0;
            const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1

            if((leftEdge && direction == -1) || (rightEdge && direction == 1))
                direction = width;
            else if (direction == width)
            {
                if (leftEdge)
                    direction = 1;
                else
                    direction = -1;
            }

            for (let i = 0; i < alienInvaders.length; i++)
            {
                squares[alienInvaders[i]].classList.remove('invader');
            }
            for (let i = 0; i < alienInvaders.length; i++)
            {
                alienInvaders[i] += direction;
            }
            for(let i = 0; i < alienInvaders.length; i++)
            {   
                if(!alienInvadersTakenDown.includes(i))
                {
                    squares[alienInvaders[i]].classList.add('invader');
                }
            }

            if(squares[currentShooterIndex].classList.contains('invader','shooter'))
            {
                squares[currentShooterIndex].classList.add('boom');
                clearInterval(invaderId);
                if(confirm(`Game is over! Your final score is ${result}!`))
                {
                    location.reload();
                }
            }

            for (let i = 0; i < alienInvaders.length; i++)
            {
                if (alienInvaders[i] > (squares.length - (width - 1))) //why bigger? smaller,no?
                {
                    clearInterval(invaderId);
                    if(confirm(`Game is over! Your final score is ${result}!`))
                    {
                        location.reload();
                    }
                }
            }

            if(alienInvadersTakenDown.length === alienInvaders.length)
            {
                clearInterval(invaderId);
                if(confirm(`You win! Your final score is ${result}!`))
                {
                    location.reload();
                }
            }
            
        }
        invaderId = setInterval(moveInvaders, 500);
        document.addEventListener('keydown', shoot);
        document.addEventListener('keydown', moveShooter);
    }

    btn.addEventListener('click', startGame);
    btn.addEventListener('click', () => {
        btn.disabled = true;
    })

    function shoot(e)
    {
        let laserId;
        let currentLaserIndex = currentShooterIndex;

        function moveLaser(){
            squares[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= width;
            squares[currentLaserIndex].classList.add('laser');

            if(squares[currentLaserIndex].classList.contains('invader'))
            {
                squares[currentLaserIndex].classList.remove('laser');
                squares[currentLaserIndex].classList.remove('invader');
                squares[currentLaserIndex].classList.add('boom');

                setTimeout(function()
                {
                    squares[currentLaserIndex].classList.remove('boom')
                }, 200)
                clearInterval(laserId); // what does it do?

                const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
                alienInvadersTakenDown.push(alienTakenDown);
                result++;
                resultDisplay.textContent = `Score: ${result}`;
            }
            
            if(currentLaserIndex < width)
            {
                clearInterval(laserId);
                setTimeout(function()
                {
                    squares[currentLaserIndex].classList.remove('laser');
                }, 100)
            }
        }
        switch(e.keyCode)
        {
            case 32:
                laserId = setInterval(moveLaser, 100);
                break;
        }
    }
    
})