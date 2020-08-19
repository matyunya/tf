
class Examples {
  constructor({ data }) {
    this.data = data;
    this.canvases = [];
  }
  
  update({ data }) {
    return this.data;
  }
  
  async* output() {
    const canvases = [];
    const examples = this.data.nextTestBatch(50);
    const numExamples = examples.xs.shape[0];

    this.canvases = await Promise.all(
      Array.from(Array(50).keys())
        .map(async (_, i) => {
          const imageTensor = tf.tidy(() => {
            // Reshape the image to 28x28 px
            return examples.xs
              .slice([i, 0], [1, examples.xs.shape[1]])
              .reshape([28, 28, 1]);
          });

          const canvas = document.createElement('canvas');
          canvas.width = 28;
          canvas.height = 28;
          canvas.style = 'margin: 0 2px;';
          await tf.browser.toPixels(imageTensor, canvas);

          imageTensor.dispose();

          return canvas;
        })
    );
    
    yield this.canvases;
  }
}

export const render = (nodes) => ({
  nodes,
  __EllxMeta__: {
    component: class {
      constructor({ nodes }) {
        this.nodes = Array.isArray(nodes) ? nodes : [nodes];
      }
      update({ nodes }) {
        this.nodes = Array.isArray(nodes) ? nodes : [nodes];
      }
      render(n) {
        this.nodes.forEach(node => n.appendChild && n.appendChild(node));
      }
      dispose() {
        this.nodes.forEach(node => node.parentNode && node.parentNode.removeChild(node));
      }
    }
  }
})

export const getExamples = (data) => ({
  data,
  __EllxMeta__: {
    component: Examples
  }
});