# Tensorflow.js demo

{ image = canvas() }

{ model = run() }

{ resized = resize(image) }

{ result = predict(tf, model, resized) }

{ winner = result.reduce((a,b,i) => a[0] < b ? [b,i] : a, [Number.MIN_VALUE,-1])[1] }




