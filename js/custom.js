let model;
let playerScore = 0;
let botScore = 0;

const webcam = new Webcam(document.getElementById('wc'));
let isPredicting = false;

async function loadModel(){
    const MODEL_URL = 'http://127.0.0.1:8887/model/model.json';
    const model = await tf.loadLayersModel(MODEL_URL);
    //console.log(model.summary());
    return model
}


async function predict() {
  while (isPredicting) {
    const predictedClass = tf.tidy(() => {
      const img = webcam.capture();
      const predictions = model.predict(img);
      return predictions.as1D().argMax();
    });
    const classId = (await predictedClass.data())[0];
    var predictionText = "";
    switch(classId){
		case 0:
			predictionText = "I see Rock";
			break;
		case 1:
			predictionText = "I see Paper";
			break;
		case 2:
			predictionText = "I see Scissors";
			break;
	}
	document.getElementById("prediction").innerText = predictionText;
    
    predictedClass.dispose();
    await tf.nextFrame();
  }
}

function updateBotHand(nbOfUpdate) {
    const rps_imgs = ['paper_1', 'paper_2', 'paper_3', 'paper_4', 'paper_5', 'paper_6', 'paper_7',
                      'rock_1', 'rock_2', 'rock_3', 'rock_4', 'rock_5', 'rock_6', 'rock_7',
                      'scissors_1', 'scissors_2', 'scissors_3', 'scissors_4', 'scissors_5', 'scissors_6', 'scissors_7']
    
    setTimeout(function () {
        if(nbOfUpdate > 0) {
            const index = Math.floor(Math.random() * Math.floor(21))
            document.getElementById('bot_hand_img').setAttribute('src', 'images/'.concat(rps_imgs[index].concat('.png')))
            nbOfUpdate--;
            updateBotHand(nbOfUpdate);
        }
    }, 200);
}

function countDown(seconds) {
    setTimeout(function () {
        if(seconds > 0) {
            document.getElementById('countDown').innerText = seconds;
            seconds--;
            countDown(seconds);
        }
    }, 1000);
}

function getResult(player_hand, bot_hand) {
    switch(player_hand) {
        case 'rock':
            if(bot_hand === 'rock') {
                return "It's a tie"
            } else if(bot_hand == 'paper') {
                return 'You lose'
            } else {
                return 'You win'
            }
        case 'paper':
            if(bot_hand === 'paper') {
                return "It's a tie"
            } else if(bot_hand == 'scissors') {
                return 'You lose'
            } else {
                return 'You win'
            }
        case 'scissors':
            if(bot_hand === 'scissors') {
                return "It's a tie"
            } else if(bot_hand == 'rock') {
                return 'You lose'
            } else {
                return 'You win'
            }
        default:
            return 'Game failed'
    }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function play() {
    const classes = ['rock', 'paper', 'scissors']
    
    document.getElementById("bot_hand").innerText = "";
    document.getElementById('picture_img').style.display = 'none';
    document.getElementById('wc').style.display = 'block';
    
    isPredicting = true;
	predict();
    
    const seconds = 3
    updateBotHand(seconds * 5);
    countDown(seconds);
    
    await sleep(seconds * 1000);
    
    const img = webcam.capture();
    const photo = webcam.takepicture();
    
    isPredicting = false;
    predict();
    
    document.getElementById('picture_img').setAttribute('src', photo)
    document.getElementById('wc').style.display = 'none';
    document.getElementById('picture_img').style.display = 'block';
    
    const predictedClass = tf.tidy(() => {
      const predictions = model.predict(img);
      return predictions.as1D().argMax();
    });
    const classId = (await predictedClass.data())[0];
    
    await sleep(500);
    
    const bot_hand_src = document.getElementById('bot_hand_img').getAttribute('src')
    const bot_hand = bot_hand_src.substring(7, bot_hand_src.length - 6)
    
    document.getElementById("prediction").innerText = classes[classId].charAt(0).toUpperCase() + classes[classId].slice(1);;
    document.getElementById("bot_hand").innerText = bot_hand.charAt(0).toUpperCase() + bot_hand.slice(1);
    
    const result = getResult(classes[classId], bot_hand)
    document.getElementById('countDown').innerText = result;
    updateScore(result)
}

function updateScore(result) {
    if(result.includes('win')) {
        playerScore++;
        document.getElementById('player_score').innerText = playerScore;
    } else if(result.includes('lose')) {
        botScore++;
        document.getElementById('bot_score').innerText = botScore;
    }
}

async function init(){
	await webcam.setup();
	model = await loadModel();
	tf.tidy(() => model.predict(webcam.capture()));
    
    document.getElementById("play_button").removeAttribute('disabled')
    document.getElementById("play_button").innerHTML = "Play";
}

init();