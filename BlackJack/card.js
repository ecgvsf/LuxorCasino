//var win = new Audio('./media/win.mp3');
var aflip = document.getElementById("flip");
var aslide = document.getElementById("slide");

var indexPlayer;
var indexDealer;

var handPlayer;
var handDealer;

var cardPlayer;
var cardDealer;

var gamefinish = false;
var blackjack = false;

var bet;
var wallet;

var RANKS, SUITS, COORDS, PIPS;

const 
PIP_WIDTH = 36,
PIP_HEIGHT = 45,
X_OFFSET = 100,
Y_OFFSET = 135;

function init() {
  gamefinish = false;
  blackjack = false;

  handDealer = 0;
  handPlayer = 0;
  cardPlayer = [];
  cardDealer = [];
  indexPlayer = 2;
  indexDealer = 2;

  document.getElementById('playerScore').innerHTML = handPlayer;
  document.getElementById('dealerScore').innerHTML = handDealer;

  RANKS = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'],
  SUITS = [
    { suit: 'spade', color: 'black' },
    { suit: 'heart', color: 'red' },
    { suit: 'club', color: 'black' },
    { suit: 'diamond', color: 'red' }
  ],
  COORDS = [
    [0, 0], [1, 0], [2, 0], [1, 2], [1, 3], [0, 4], [2, 4], [0, 6], [1, 6], [2, 6], [0, 8], [2, 8], [1, 9], [1, 10], [0, 12], [1, 12], [2, 12]
  ],
  PIPS = {
    'A': { scale: 3, locs: [8] },
    2: { scale: 2, locs: [1, 15] },
    3: { scale: 1, locs: [1, 8, 15] },
    4: { scale: 1, locs: [0, 2, 14, 16] },
    5: { scale: 1, locs: [0, 2, 8, 14, 16] },
    6: { scale: 1, locs: [0, 2, 7, 9, 14, 16] },
    7: { scale: 0.75, locs: [0, 2, 4, 7, 9, 14, 16] },
    8: { scale: 0.75, locs: [0, 2, 5, 6, 10, 11, 14, 16] },
    9: { scale: 0.75, locs: [0, 2, 5, 6, 8, 10, 11, 14, 16] },
    10: { scale: 0.75, locs: [0, 2, 3, 5, 6, 10, 11, 13, 14, 16] },
    'J': { scale: 2.50, locs: [1, 15], symbol: 'jack' },
    'Q': { scale: 2.50, locs: [1, 15], symbol: 'queen' },
    'K': { scale: 2.50, locs: [1, 15], symbol: 'king' }
  }
}

async function playFlip() {
  aflip.play();
}

async function playSlide() {
  aslide.play();
}



async function start() {
  
  document.getElementById('dealerScore').style.color = "white";
  document.getElementById('playerScore').style.color = "white";
  var number = parseFloat(document.getElementById('betAmount').value);
  if (number !== 0) {
    document.getElementById('playerScore').style.display = "block";
    document.getElementById('dealerScore').style.display = "block";
    bet = parseFloat(document.getElementById('betAmount').value);
    wallet = parseFloat(document.getElementById('wallet').innerHTML);

    if (bet <= wallet) {
      document.getElementById('bet').disabled = true;
      document.getElementById('hit').disabled = true;
      document.getElementById('stand').disabled = true;
      document.getElementById('double').disabled = true;
      document.getElementById('split').disabled = true;
      if (gamefinish){
        clear();
        await sleep(1300);
      }
      init();
      
      document.getElementById('wallet').innerHTML = (wallet - bet).toFixed(2);

      const cd1 = document.querySelector('.cd1');
      const cd2 = document.querySelector('.cd2');
      const cp1 = document.querySelector('.cp1');
      const cp2 = document.querySelector('.cp2');

      await slideDealer(cd1, 1);
      await sleep(300);
      await slideDealer(cd2, 2);
      await sleep(300);
      await slidePlayer(cp1, 1);
      await sleep(300);
      await slidePlayer(cp2, 2);


      document.getElementById('hit').disabled = false;
      document.getElementById('stand').disabled = false;
      document.getElementById('double').disabled = false;

    } else {
      alert("no money");
    }
  } else {
    alert("bet first!");
  }
}

function moveY(endTop, startTop, step, cc) {
  let idY = null;
  clearInterval(idY);
  if (endTop <= startTop){
    step = step*(-1);
    idY = setInterval(slideUp, 2);
  } else {
    idY = setInterval(slideDown, 2);
  }

  function slideDown() {
    if (startTop >= endTop) {
      clearInterval(idY);
    } else {
      startTop += step;
      cc.style.top = startTop + "vh";
    }
  }

  function slideUp() {
    if (startTop <= endTop) {
      clearInterval(idY);
    } else {
      startTop += step;
      cc.style.top = startTop + "vh";
    }
  }
}

function moveX(endRight, startRight, step, cc) {
  let idX = null;
  clearInterval(idX);
  if (endRight <= startRight){
    step = step*(-1);
    idX = setInterval(slideRight, 2);
  } else {
    idX = setInterval(slideLeft, 2);
  }

  function slideLeft() {
    if (startRight >= endRight) {
      clearInterval(idX);
    } else {
      startRight += step;
      cc.style.right = startRight + "vw";
    }
  }

  function slideRight() {
    if (startRight <= endRight) {
      clearInterval(idX);
    } else {
      startRight += step;
      cc.style.right = startRight + "vw";
    }
  }
}

async function slideDealer(cc, index) {
  let endRight = 65 - index * 2;
  let endTop = 15 + index * 2;
  let startRight = 25;
  let startTop = -15.5;

  let prop = (endRight - startRight) / (endTop - startTop);
  let step = 0.7;


  moveY(endTop, startTop, step, cc);
  moveX(endRight, startRight, (step * prop), cc);

  playSlide();
  await sleep(500);
  if (index !== 2) {
    flip(cc, "d");
  }



  for (let i = 1; i < index; i++) {
    let currentCard = document.querySelector('.cd' + i);
    startRight = parseFloat(currentCard.style.right);
    endRight = startRight + 1;
    moveX(endRight, startRight, step, currentCard);
  }
}

async function slidePlayer(cc, index) {
  let endRight = 65 - index * 2;
  let endTop = 55 + index * 2;
  let startRight = 25;
  let startTop = -15.5;

  let prop = (endRight - startRight) / (endTop - startTop);
  let step = 0.7;


  moveY(endTop, startTop, step, cc);
  moveX(endRight, startRight, (step * prop), cc);

  playSlide();
  await sleep(500);
  flip(cc, "p");


  for (let i = 1; i < index; i++) {
    let currentCard = document.querySelector('.cp' + i);
    startRight = parseFloat(currentCard.style.right);
    endRight = startRight + 1;
    moveX(endRight, startRight, step, currentCard);
  }

}

async function flip(cc, owner) {
  if ($(cc).hasClass('flipped')) {

    playFlip();

    let randSuit = SUITS[Math.floor(Math.random() * SUITS.length)];
    let randRank = RANKS[Math.floor(Math.random() * RANKS.length)];

    if (owner == "p") {
      cardPlayer.push(randRank);
      checkPlayer();
    } else {
      cardDealer.push(randRank);
      checkDealer();
    }
      

    $('.pip', cc).remove();
    $('.rank', cc).text(randRank);
    $('.rank', cc).toggleClass('underline', (randRank == 6 || randRank == 9));
    $('.front svg', cc).attr('class', randSuit.color);
    $('.suit', cc).attr('xlink:href', '#' + randSuit.suit);

    let width = PIP_WIDTH * PIPS[randRank].scale, height = PIP_HEIGHT * PIPS[randRank].scale,
      href = '#' + randSuit.suit;

    if (PIPS[randRank].symbol !== undefined) {
      href = '#' + PIPS[randRank].symbol;
    }

    for (let pip of PIPS[randRank].locs) {
      let x = (COORDS[pip][0] * 50) + X_OFFSET - (width / 2),
        y = (COORDS[pip][1] * 12.5) + Y_OFFSET - (height / 2),
        symbol = document.createElementNS('http://www.w3.org/2000/svg', 'use');

      symbol.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
      symbol.setAttribute('class', 'suit pip');
      symbol.setAttribute('x', x);
      symbol.setAttribute('y', y);
      symbol.setAttribute('width', width);
      symbol.setAttribute('height', height);
      if (pip > 9) {
        symbol.setAttribute('transform', 'rotate(180, ' + (x + (width / 2)) + ', ' + (y + (height / 2)) + ')');
      }
      $('.front svg', cc).append(symbol);
    }
  }
  $(cc).toggleClass('flipped'); 
}

async function checkPlayer() {
  handPlayer = 0;
  cardPlayer.forEach(card => {
    console.log(card);
    if(card == "K" || card == "Q" || card == "J") {
      handPlayer += 10;
    }
    else if (card == "A") {
      if ((handPlayer + 11) > 21) {
        handPlayer += 1;
      } else {
        handPlayer += 11;
      }
    } else {
      handPlayer += card;
    }
    console.log(handPlayer);
  });
  document.getElementById('playerScore').innerHTML = handPlayer;


  if (handPlayer > 21) {
    lose();
  } 
  else if (handPlayer == 21) {
    blackjack = true;
    stand();
  }
}

function checkDealer() {
  handDealer = 0;
  cardDealer.forEach(card => {
    console.log(card);
    if(card == "K" || card == "Q" || card == "J") {
      handDealer += 10;
    }
    else if (card == "A") {
      if ((handDealer + 11) > 21) {
        handDealer += 1;
      } else {
        handDealer += 11;
      }
    } else {
      handDealer += card;
    }
    console.log(handDealer);
  });
  document.getElementById('dealerScore').innerHTML = handDealer;
  if(cardDealer.length>2 && handDealer <= 21) {
    console.log("stand hand dealer <= 21");
    stand();
  } else if (handDealer > 21)
    win();
}

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

async function hit(owner) {
  document.getElementById("double").disabled = true;
  var index;
  if (owner == 'p') {
    indexPlayer++;
    index = indexPlayer
  } else {
    indexDealer++;
    index = indexDealer
  }

  console.log(owner + index);

  document.body.appendChild(
    Object.assign(
      document.createElement('div'),
      { id: 'c' + owner + index }
    )
  )

  console.log("create div");

  const box = `
  <div class="card-container flipped c` + owner + index + `">
			<div class="card">
				<div class="front">
					<svg viewBox="0 0 300 420">
						<use xlink:href="#card-front" />
						<text class="rank" x="53" y="51" text-anchor="middle"></text>
						<text class="rank" x="247" y="365" text-anchor="middle"
							transform="rotate(180, 247, 367)"></text>
						<use class="suit" xlink:href="#" x="229" y="29" width="36" height="45" />
						<use class="suit" xlink:href="#" x="35" y="346" width="36" height="45"
							transform="rotate(180, 53, 368.5)" />
					</svg>
				</div>
				<div class="back">
					<svg viewBox="0 0 300 420">
						<use xlink:href="#card-back" />
					</svg>
				</div>
			</div>
		</div>`;
  document.getElementById('c' + owner + index).innerHTML = box;


  const elem = document.querySelector('.c' + owner + index);
  console.log(elem);

  if (owner == 'p') {
    slidePlayer(elem, index);
  } else {
    slideDealer(elem, index);
  }
}

async function stand() {
  console.log(handDealer);
  if ($('.cd2').hasClass('flipped')){
    flip(document.querySelector('.cd2'));
    await sleep(500);
  }
  if(handDealer == 21) {
    if(handPlayer == 21) {
      draw();
    } else {
      lose();
    }
  } else if (handDealer > 21) {
    win();
  } else if (handDealer > handPlayer) {
    lose();
  } else if (handDealer == handPlayer && handDealer >= 17) {
    draw();
  } else if (handDealer < handPlayer && handDealer >= 19) {
    win();
  } else if (handDealer <= handPlayer) {
    hit("d");
    await sleep(300)
  }
}

async function doubleCard() {
  bet = parseFloat(document.getElementById('betAmount').value);
  wallet = parseFloat(document.getElementById('wallet').innerHTML);

  if (bet > wallet) {
    alert("no money");
  } else {
    (document.getElementById('wallet').innerHTML) = (wallet - bet).toFixed(2);
    bet *= 2
  
  hit("p");
  await sleep(1000);
  if (!blackjack && !gamefinish)
    stand();
  }

  
}

function nextNum() {
  var number = parseFloat(document.getElementById('betAmount').value);
  number += 0.01
  document.getElementById('betAmount').value = number.toFixed(2)
}

function prevNum() {
  var number = parseFloat(document.getElementById('betAmount').value);
  if (number !== 0) {
    number -= 0.01
    document.getElementById('betAmount').value = number.toFixed(2)
  }
}

function double() {
  var number = parseFloat(document.getElementById('betAmount').value);
  var wallet = parseFloat(document.getElementById('wallet').innerHTML);

  if (number == wallet) {
    alert("no money");
  } else if ((number * 2) > wallet) {
    number = wallet
  } else {
    number *= 2
  }
  document.getElementById('betAmount').value = number.toFixed(2);
}

function halve() {
  var number = parseFloat(document.getElementById('betAmount').value);
  if (number == 0.01) {
    document.getElementById('betAmount').value = 0.00
  } else if (number !== 0) {
    number /= 2
    document.getElementById('betAmount').value = number.toFixed(2)
  }
}

async function clear() {
  for (let i = 1; i <= indexDealer; i++) {
    let currentCard = document.querySelector(".cd" + i);
    console.log();
    if(!$(".cd" + i).hasClass('flipped'))
      flip(currentCard);

    moveAway(currentCard, i);
  }

  for (let i = 1; i <= indexPlayer; i++) {
    let currentCard = document.querySelector(".cp" + i);
    console.log(currentCard);
    flip(currentCard);

    moveAway(currentCard, i);
  }

  init();
}

async function moveAway(currentCard, i){
    let startTop = parseFloat(currentCard.style.top);
    let startRight = parseFloat(currentCard.style.right);

    await sleep(100);

    moveY(-50, startTop, 2, currentCard);
    moveX(65, startRight, 2, currentCard);
    
    await sleep(1000);
    if(i >= 3) {
      currentCard.remove();
    }
    else{
      startTop = parseFloat(currentCard.style.top);
      startRight = parseFloat(currentCard.style.right);
      moveX(25, startRight, 2, currentCard);
    }
    
}

function finish(){
  document.getElementById('bet').disabled = false;
  document.getElementById('hit').disabled = true;
  document.getElementById('stand').disabled = true;
  document.getElementById('double').disabled = true;
  document.getElementById('split').disabled = true;
  gamefinish = true;
}

function lose() {
  finish();
  document.getElementById('dealerScore').style.color = "greenyellow";
  document.getElementById('playerScore').style.color = "red";
}

function draw() {
  finish();
  document.getElementById('dealerScore').style.color = "orange";
  document.getElementById('playerScore').style.color = "orange";
  wallet = parseFloat(document.getElementById('wallet').innerHTML);
  document.getElementById('wallet').innerHTML = String(wallet + (bet));
}

function win() {
  finish();
  document.getElementById('dealerScore').style.color = "red";
  document.getElementById('playerScore').style.color = "greenyellow";
  wallet = parseFloat(document.getElementById('wallet').innerHTML);
  if (blackjack) {
    wallet += bet * 3
  } else {
    wallet += bet * 2
  }
  document.getElementById('wallet').innerHTML = String(wallet.toFixed(2));
}