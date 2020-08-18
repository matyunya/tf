export async function predict(tf, model, imageData) {
  const pred = await tf.tidy(() => {
    let img = tf.browser.fromPixels(imageData, 1);
    img = img.reshape([1, 28, 28, 1]);
    img = tf.cast(img, 'float32');

    const output = model.predict(img);

    return Array.from(output.dataSync());
  });
  
  return pred;
}