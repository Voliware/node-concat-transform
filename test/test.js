const {Readable, Writable} = require('stream');
const ConcatTransform = require('./../lib/concatTransform');

/**
 * Test function for basic tests
 * @param {ConcatTransform} concat_transform 
 * @param {String} readable_data
 * @param {String} expectation 
 * @returns {Promise} 
 */
function run(concat_transform, readable_data, expectation){
    let readable = new Readable({highWaterMark:1});
    readable._read = () => {};
    let data = Buffer.from([]);
    let writable = new Writable();
    writable._write = (chunk, enc, next) => { 
        data = Buffer.concat([data, chunk])
        next();
    }

    for(let i = 0; i < readable_data.length; i++){
        readable.push(readable_data[i]);
    }
    readable.push(null);

    return new Promise((resolve, reject) => {
        readable
            .pipe(concat_transform)
            .pipe(writable)
            .on('finish', () => {
                if(data.compare(Buffer.from(expectation)) === 0){
                    resolve();
                }
                else {
                    reject(new Error('Data does not match'));
                }
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

it('concatenates a stream', function(){
    let readable_data = "This data will be read at one character per chunk";
    let expectation = readable_data;
    let concat_transform = new ConcatTransform();
    return run(concat_transform, readable_data, expectation);
});