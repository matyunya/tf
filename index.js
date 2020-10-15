export { loadData } from '/data.js';
import * as tf from "@tensorflow/tfjs";
export { predict, resize } from '/predict.js';
export { default as canvas } from '~matyunya/draw-canvas/index.js';
import Button from '/Button.svelte';
import ellxify from '~ellx-hub/lib/utils/svelte.js';
export { plot, label, color } from '~matyunya/plot/index.js';
export { getExamples, render } from '/examples.js';
import Results from "/Results.svelte";

export const results = ellxify(Results);
export const button = ellxify(Button);

export { tf };

export function getModel() {
  const model = tf.sequential();
  
  const IMAGE_WIDTH = 28;
  const IMAGE_HEIGHT = 28;
  const IMAGE_CHANNELS = 1;  
  
  // In the first layer of our convolutional neural network we have 
  // to specify the input shape. Then we specify some parameters for 
  // the convolution operation that takes place in this layer.
  model.add(tf.layers.conv2d({
    inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
    kernelSize: 5,
    filters: 8,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));

  // The MaxPooling layer acts as a sort of downsampling using max values
  // in a region instead of averaging.  
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
  
  // Repeat another conv2d + maxPooling stack. 
  // Note that we have more filters in the convolution.
  model.add(tf.layers.conv2d({
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
  
  // Now we flatten the output from the 2D filters into a 1D vector to prepare
  // it for input into our last layer. This is common practice when feeding
  // higher dimensional data to a final classification output layer.
  model.add(tf.layers.flatten());

  // Our last layer is a dense layer which has 10 output units, one for each
  // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9).
  const NUM_OUTPUT_CLASSES = 10;
  model.add(tf.layers.dense({
    units: NUM_OUTPUT_CLASSES,
    kernelInitializer: 'varianceScaling',
    activation: 'softmax'
  }));
  
  // Choose an optimizer, loss function and accuracy metric,
  // then compile and return the model
  const optimizer = tf.train.adam();
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

export const train = (data, model, shouldRun) => ({
  data,
  shouldRun,
  model,
  __EllxMeta__: {
    component: class {
      constructor({ data, model, shouldRun }) {
        this.batchLogs = [];
        this.epochLogs = [];
        
        if (!shouldRun) return;

        this.update({ data, model });
      }
      
      update({ data, model }) {
        tfTrain(
          model,
          data,
          (_, { loss, acc }) => {
            this.batchLogs.push([loss, acc]);
            this.emit && this.emit([...this.batchLogs]);
          }
        );
        
        return this.batchLogs;
      }
      
      async* output() {
        while (true) {
          yield this.value;
          this.value = await new Promise(resolve => this.emit = resolve);
        }
      }
    }
  }
});

async function tfTrain(model, data, onBatchEnd, onEpochEnd = () => {}) {
  const BATCH_SIZE = 512;
  const TRAIN_DATA_SIZE = 5500;
  const TEST_DATA_SIZE = 500;

  const [trainXs, trainYs] = tf.tidy(() => {
    const d = data.nextTrainBatch(TRAIN_DATA_SIZE);
    return [
      d.xs.reshape([TRAIN_DATA_SIZE, 28, 28, 1]),
      d.labels
    ];
  });

  const [testXs, testYs] = tf.tidy(() => {
    const d = data.nextTestBatch(TEST_DATA_SIZE);
    return [
      d.xs.reshape([TEST_DATA_SIZE, 28, 28, 1]),
      d.labels
    ];
  });

  return model.fit(trainXs, trainYs, {
    batchSize: BATCH_SIZE,
    validationData: [testXs, testYs],
    epochs: 10,
    shuffle: true,
    callbacks: {
      onBatchEnd,
      onEpochEnd,
    }
  });
}
