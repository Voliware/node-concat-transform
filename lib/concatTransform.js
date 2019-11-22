const {Transform} = require('stream');

/**
 * Concat Transform.
 * A transform that concatenates all data.
 * Once all data is concatenated, it flushes
 * the data sending it downstream.
 * @extends {Transform}
 * @example
 * let concat_transform = new ConcatTransform();
 * readable_stream.pipe(concat_transform)
 *                .pipe(writable_stream);
 */
class ConcatTransform extends Transform {

    /**
     * Constructor
     * @returns {ConcatTransform}
     */
    constructor(){
        super();
        this.data = Buffer.from([]);
        return this;
    }
    
    /**
     * Concatenate chunks into this.data.
     * @param {Buffer|String} chunk 
     * @param {String} encoding 
     * @param {Function} callback 
     */
    _transform(chunk, encoding, callback){
        let length = this.data.length + chunk.length;
        this.data = Buffer.concat([this.data, chunk], length);
        callback();
    }

    /**
     * Flush the data.
     * At this point, all chunks are concatenated.
     * @param {Function} callback 
     */
    _flush(callback){
        callback(null, this.data)
    }
}

module.exports = ConcatTransform;