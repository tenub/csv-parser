const fs = require('fs');

class CSVParser {
  constructor(options) {
    this.options = options;
    this.data = [];
    this.row = [];
    this.value = '';
  }

  read(path) {
    this.handleReadData = this.handleReadData.bind(this);
    this.handleReadClose = this.handleReadClose.bind(this);

    this.stream = fs.createReadStream(path)
      .on('data', this.handleReadData)
      .on('error', this.handleReadError)
      .on('close', this.handleReadClose);
  }

  handleReadData(data) {
    const chunk = data.toString();

    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] == '"') {
        if (chunk[i + 1]) {
          this.value += chunk[i + 1];
          i += 1;
        }

        continue;
      }

      if (chunk[i] == ',') {
        this.row.push(this.value);
        this.value = '';

        continue;
      }

      if (chunk[i] == '\n') {
        this.data.push(this.row);
        this.row = [];
        this.value = '';

        continue;
      }

      this.value += chunk[i];
    }
  }

  handleReadError(error) {
    console.error(error);
    process.exit(1);
  }

  handleReadClose() {
    console.info(this.data);
  }
}

const testFile = 'test.csv';
const parser = new CSVParser(testFile);
parser.read(testFile);
