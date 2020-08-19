import rrresize from 'resize-image-data';

export function resize(imageData, scale = 0.25) {
  if (!imageData || !imageData.width || !imageData.height || !scale) return false;
	const d = rrresize(imageData, 28, 28);
  
  const c = document.createElement('canvas');
  c.width = c.height = 28;
  const ctx = c.getContext('2d');
  ctx.putImageData(d, 0, 0);
  
  return [d, c];
}

let results = [];

export async function predict(tf, model, imageData) {
  if (!imageData) return '...';

  const [r, canvas] = resize(imageData) || [];
  if (!r) return results;

  return tf.tidy(() => {
    let img = tf.browser.fromPixels(r, 1);
    img = img.reshape([1, 28, 28, 1]);
    img = tf.cast(img, 'float32');

    const output = model.predict(img);
    
    const result = Array.from(output.dataSync());
    
    const span = document.createElement('span');
		const winner = result.indexOf(Math.max(...result));
    span.innerText = winner;
    span.appendChild(canvas);
    span.style.margin = '0 4px';
    span.style.fontSize = '20px';
    span.style.display = 'inline-flex';
    span.style.alignItems = 'center';
    
    document.body.appendChild(span);

    return [result, winner];
  });
}