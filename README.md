# node-concat-transform
Concatenate data in a stream using a transform

## Install
`npm install @voliware/node-concat-transform`

## What is it?
In Node streams you may get data in small chunks. This is rare from a file, unless set explicitly, but will happen in a throttled network system. Most often you cannot operate on pieces of data beause you do not have the entire chunk of data. `node-concat-transform` is a Node Transform that you can use with the `pipe()` method to concatenate (link or bundle) data into one bigger chunk. Then, you can operate on that larger chunk if needed, and continue sending it downstream. 

## Why do I need it?
If you are using a readable Node stream that receives chunks and you are not 100% sure you will receive all the data at once, you will probbably need to bundle it first. You can easily accomplish this with `node-concat-stream`.

## How do I use it?
Once you have a readable Node stream, such as a file stream, TCP stream, or any other type of `Readable` stream, you simply create a `ConcatTransform` and pass it into the `pipe()` method before you intend to do something with the stream data.

### Example
Suppose you have a readable stream receiving chunks of data that is only 1 character in length. You can create a `ConcatTransform` to bundle the chunks into one big peice of data that can then be operated on. This would be essential for example when zipping stream data.

```js
let readable = new Stream.Readable();
let concat_transform = new ConcatTransform();
let writable = new Stream.Writable();

// simulate a stream reading data 1 character/number at a time
for(let i = 0; i < data.length; i++){
    readable.read(data[i]);
}
// stream ends
readable.read(null);

// make use of the stream data
readable.pipe(concat_transform)
        .pipe(some_other_transform)
        .pipe(writable);
```

If you are receiving data that has a header, or a start delimiter and/or end delimiter, you can also set options for your `ConcatTransform` that will bundle the data based on these options. This is common in network based streams where an EOF set of characters, such as `/r/n`, indicate the end of a datagram, but you may actually get peices of the next or previous datagram in the same chunk. If your chunks have headers, than you will need to pass a custom function that parses the header and returns the total number of bytes expected in a fully formed chunk.

```js
let concat_transform = new ConcatTransform({
    // strings or Buffers are accepted
    delimiter: {
        start: "START",
        end: "END"
    }
    // to parse a header, write a custom function
    // that will return the expected full chunk length
    header: header_parsing_function
});
```
