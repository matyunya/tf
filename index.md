# Tensorflow.js demo

## Introduction

This is a quick showcase for [TensorFlow.js](http://tensorflow.org/js/) using Ellx. We are going to create a prediction model based on the famous [MNIST dataset](http://yann.lecun.com/exdb/mnist/) of handwritten digits. In the end we will be able to test the model performance by writing some of those digits onto a canvas. Testing ML on a spreadsheet in the browser, who would've thought!

All data operations are defined in the [sheet](https://ellx.io/matyunya/tf/index.ellx).

First we need to load our test data. This takes a while since it has to download and analyze a ~10 mb image containing the dataset.

{
  shouldLoadData = button({ label: 'Load dataset' })
}

## Sample set

{ render(examples) }

## Training

Now you're ready to train your model! There's a hook attached that will emit model accuracy and loss upon finishing each training batch so you can easily see model performance over time.

{
  shouldTrainModel = button({
    label: 'Train model',
    disabled: !data,
  })
}

{
  batchPlot =
    plot({ data: accuracy, mapping: 'line' })
      / label('batch', 'accuracy (purple)')
      / color('purple') +
    plot({ data: loss, mapping: 'line' })
      / label(null, 'loss (red)')
      / color('red')
}

## Playground

Here's the canvas you can try painting digits on even during training. Code for the model itself comes from [Google codelab's tutorial](https://codelabs.developers.google.com/codelabs/tfjs-training-classfication/index.html#4) which shows good results against test data from the same dataset but not so much on real data. It does good job at discerning ones and zeroes but for the other digits it seems somewhat random depending on the data picked for training.


<div style="margin: 2rem">

{ image = canvas() }

</div>

{ results({ value: res }) }

