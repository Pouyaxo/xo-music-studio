class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;

  async add(request: () => Promise<any>) {
    this.queue.push(request);
    if (!this.processing) {
      await this.processQueue();
    }
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Request failed:', error);
        }
      }
    }
    this.processing = false;
  }
}

export const requestQueue = new RequestQueue(); 