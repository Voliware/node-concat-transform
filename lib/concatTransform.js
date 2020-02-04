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
 * @example
 * let concat_transform = new ConcatTransform({
 *     delimiter: {
 *         start: "<START>",
 *         end: "<END>"
 *     }
 * });
 * @example
 * let concat_transform = new ConcatTransform({
 *     header_parser: (chunk) => { // parse the chunk for header info }
 * })
 */
class ConcatTransform extends Transform {

    /**
     * Constructor
     * @param {Object} [options]
     * @param {Object} [options.delimiter]
     * @param {Buffer|String} [options.delimiter.start]
     * @param {Buffer|String} [options.delimiter.end]
     * @param {Function} [options.header_parser]
     * @returns {ConcatTransform}
     */
    constructor(options = {}){
        super();
        this.delimiter = {
            start: options.delimiter ? options.delimiter.start : null, 
            end: options.delimiter ? options.delimiter.end : null,
            start_found: false,
            end_found: false
        };
        this.header = {
            parser: options.header_parser || null,
            found: false,
            last: {
                size: 0
            }
        };
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
        if(this.header.parser && !this.header.found){
            let header = this.header.parser(chunk);
            if(header){
                
            }
        }
        else if(this.delimiter.start && !this.delimiter.start_found){
            let start_delimiter = this.findStartDelimiter(chunk);
        }

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