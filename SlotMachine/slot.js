const items = [
  "🥝",
  '🍓',
  '🍍',
  '🍊',
  '🍌',
  '🍈',
  '🍋',
  '🍇',
  '🍑',
  '🍒',
  '🍉',
  '🍎',
  '🍏',
  '🍐',
];
const doors = document.querySelectorAll('.door');
var shuffleArr = [];
var result = [];

var spinning = false;

var bet;
var wallet;

init();

async function init(firstInit = true, groups = 1, duration = 1) {
  result = [];
  for (const door of doors) {
    if (firstInit) {
      door.dataset.spinned = '0';
    } else if (door.dataset.spinned === '1') {
      return;
    }

    const boxes = door.querySelector('.boxes');
    const boxesClone = boxes.cloneNode(false);
    var pool = ["❓"];

    if (!firstInit) {
      const arr = [];
      shuffleArr = [];
      for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
        arr.push(...items);
      }
      shuffleArr.push(...shuffle(arr));
      pool.push(...shuffleArr);

      boxesClone.addEventListener(
        'transitionstart',
        function () {
          door.dataset.spinned = '1';
          this.querySelectorAll('.box').forEach((box) => {
            box.style.filter = 'blur(1px)';
          });
        },
        { once: true }
      );

      boxesClone.addEventListener(
        'transitionend',
        function () {
          this.querySelectorAll('.box').forEach((box, index) => {
            box.style.filter = 'blur(0)';
            if (index > 0) this.removeChild(box);
          });
        },
        { once: true }
      );
    }

    for (let i = pool.length - 1; i >= 0; i--) {
      const box = document.createElement('div');
      box.classList.add('box');
      box.style.width = door.clientWidth + 'px';
      box.style.height = door.clientHeight + 'px';
      box.textContent = pool[i];
      boxesClone.appendChild(box);
    }
    boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
    boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
    door.replaceChild(boxesClone, boxes);

    result.push(shuffleArr[shuffleArr.length - 1]);
  }

  await sleep(2950);

  if (!firstInit) {
    console.log(result)
    var filtered = result.filter((v, i) => result.indexOf(v) !== i)
    console.log(filtered)

    if (filtered.length > 0) {
      notification("Win", bet * filtered.length, bet);
      document.getElementById('wallet').innerHTML = (wallet + bet * filtered.length).toFixed(2);
    } else {
      notification("Lose", bet * filtered.length, bet);
    }

    
    document.querySelector('.spin-button').classList.remove("opacity");
    spinning = false;
  }

}

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}


async function spin() {
  if (spinning == false) {

    bet = parseFloat(document.getElementById('betAmount').value);
    wallet = parseFloat(document.getElementById('wallet').innerHTML);

    spinning = true;
    init();
    init(false, 2, 2);

    document.getElementById('wallet').innerHTML = (wallet - bet).toFixed(2);

    //disable spin button
    document.querySelector('.spin-button').setAttribute("class", "spin-button opacity");

    for (const door of doors) {
      const boxes = door.querySelector('.boxes');
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = 'translateY(0)';
      await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }
  }

}

function shuffle([...arr]) {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
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
  document.getElementById('betAmount').value = number.toFixed(2)
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

function notification(result, winValue, betTotal){
  let container = document.querySelector('#app');
  let notification = document.createElement('div');
  notification.setAttribute('id', 'notification');
      let nSpan = document.createElement('div');
      nSpan.setAttribute('class', 'nSpan');
          let nsTxt = document.createElement('span');
          nsTxt.innerText = result;
          nSpan.append(nsTxt);
          let nsWin = document.createElement('div');
          nsWin.setAttribute('class', 'nsWin');
              let nsWinBlock = document.createElement('div');
              nsWinBlock.setAttribute('class', 'nsWinBlock border_right');
              nsWinBlock.innerText = 'Bet: ' + betTotal;
              nSpan.append(nsWinBlock);
              nsWin.append(nsWinBlock);
              nsWinBlock = document.createElement('div');
              nsWinBlock.setAttribute('class', 'nsWinBlock border_left');
              nsWinBlock.innerText = 'Win: ' + winValue;
              nSpan.append(nsWinBlock);
              nsWin.append(nsWinBlock);
          nSpan.append(nsWin);
      notification.append(nSpan);
  container.prepend(notification);
  setTimeout(function(){
      notification.style.cssText = 'opacity:0';
  }, 1000);
  setTimeout(function(){
      notification.remove();
  }, 2000);
}