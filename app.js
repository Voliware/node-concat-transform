const {Readable, Writable, Transform} = require('stream');

class MyTransform extends Transform {
    constructor(name){
        super();
        this.name = name;
        this.data = Buffer.from([]);
        return this;
    }

    _transform(chunk, encoding, callback){
        console.log(this.name);
        console.log(chunk.toString());
        this.data = Buffer.concat([this.data, chunk]);
        // callback();
        callback(null, chunk);
    }

    // _flush(cb){
    //     this.push("??")
    //     console.log(this.data.toString());
    //     cb(null, this.data);
    // }
}

let data = Buffer.from([]);
let writable = new Writable();
writable._write = (chunk, enc, next) => { 
    data = Buffer.concat([data, chunk])
    next();
}

let readable_data = "Some data!";
let readable = new Readable({highWaterMark:1});
readable._read = () => {};
readable.push(readable_data);
readable.push(readable_data);
readable.push(null);
readable
    .pipe(new MyTransform("a"))
    .pipe(new MyTransform("b"))
    .pipe(writable)
    .on('finish', () => {
        console.log('fin');
        console.log(data.toString());
    })
    .on('error', (error) => {
        console.log('err');
        console.error(error);
    });
    