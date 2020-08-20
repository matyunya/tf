
class Examples {
  constructor(props) {
    this.update(props);
  }
  
  update({ data }) {
    this.data = data;
    
    if (!this.data || !this.data.nextTestBatch) return;
    
    const examples = this.data.nextTestBatch(50);
    const numExamples = examples.xs.shape[0];

    Promise.all(
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
    ).then(canvases => this.emit && this.emit(canvases));
  }
  
  async* output() {
    while (true) {
      this.value = await new Promise(resolve => this.emit = resolve);
      yield this.value;
    }
  }
}

export const render = (nodes) => ({
  nodes,
  __EllxMeta__: {
    component: class {
      constructor(props) {
        this.update(props);
      }
      update({ nodes = [] }) {
        this.nodes = (Array.isArray(nodes) ? nodes : [nodes]).filter(n => Boolean(n) && n instanceof Node);
      }
      async *output() {
        yield "...";
      }
      render(n) {
        this.nodes.forEach(node => n && n.appendChild && n.appendChild(node));
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