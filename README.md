# RockPaperScissorsBot

A TensorFlow-based bot to play roshambo with. 

To use it live go to [paul-pidou.name/RockPaperScissorsBot](https://www.paul-pidou.name/RockPaperScissorsBot/).
As the model is quite heavy it will take a moment to load.

## TensorFlow model

The model used to perform the image classification has been trained with TensorFlow and convert to run within the browser thanks to [TensorFlow.js](https://www.tensorflow.org/js). To have more information, you can check this [Kaggle kernel](https://www.kaggle.com/paulpidou/rockpaperscissors-tf-model).

## Use it locally

If you want to use the bot locally, follow these steps:
1. Download this repository
2. Add the [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb) extension to Google Chrome
3. Launch it and choose the directory where you downloaded the repository as the choosen folder
4. Modify the `URL` variable in the `js/custom.js` file to point to the URL of the Web Server e.g. http://127.0.0.1:8887
5. Go to the address of the Web Server in your browser
