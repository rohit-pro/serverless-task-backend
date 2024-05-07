const csvParser = require('csv-parser');


module.exports = {
    getParsed(stream) {
        const results = [];
        return new Promise((res, rej) => {
            stream.pipe(csvParser())
                .on('data', (data) => {
                    results.push(data);
                })
                .on('end', () => {
                    res(results)
                })
                .on('error', (error) => {
                    console.error('Error parsing CSV:', error);
                });
        })
    }
}