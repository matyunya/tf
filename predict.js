import rrresize from 'resize-image-data';

let sums = new Set([199920]);

export function resize(imageData, scale = 0.25) {
  if (!imageData || !imageData.width || !imageData.height || !scale) return false;
	const d = rrresize(imageData, 28, 28);
  
	const sum = d.data.reduce((acc, cur) => acc + cur, 0);
  
  if (sums.has(sum)) return false;
  
  sums.add(sum);
  
  return d;
}

const results = [];

export async function predict(tf, model, imageData) {
  if (!imageData) return '...';

  const r = resize(imageData);
  if (!r) return results;

  return tf.tidy(() => {
    let img = tf.browser.fromPixels(r, 1);
    img = img.reshape([1, 28, 28, 1]);
    img = tf.cast(img, 'float32');

    const output = model.predict(img);    
    const result = Array.from(output.dataSync());
		const winner = result.indexOf(Math.max(...result));
    
    results.push({ winner, imageData: r });

    return [...results];
  });
}