# What's JSON? How's it used?

JSON stands for _JavaScript Object Notation_, and it's a format that computers can use to pass data between one-another.

There are a couple of advantages to JSON:

- It's human-readable
- It's simple
- It represents arbitrary shapes

Those are very good advantages.

There are a couple of disadvantages to JSON:

- It's very verbose and can take lots of space
- It cannot contain comments ;(

JSON can take a couple of shapes. For example, it can be a list of words like so:

```json
[
    "blue",
    "green",
    "orange"
    "purple",
    "red",
    "yellow"
]
```

They don't _need_ to be in alphabetical order, but it makes you a better person.

You can put numbers in there, too, and even mix words with numbers:

```json
[
    1,
    "one",
    2,
    "two"
]
```

Notice the square brackets. Any time we want to represent a list of things, we put them inside of square brackets.

### A collection of values inside a pair of square brackets is called an _array_.

In computer programming, we have a concept called a "key-value pair". This is a kind of data that labels a given key with a given value. Here's an example:

```json
{
  "color": "red"
}
```

Here, we have the _key_ `color` being labeled with the _value_ `red`. We say that the keys are _mapped_ to their values.

Notice the squigglies! In JSON, if we want to represent key-value pairs, we must be inside a set of squiggles.

### A collection of key-value pairs inside of a set of squiggles is called an _object_.

Something interesting about JSON is that we can put _objects_ inside of our _arrays_. Take a look:

```json
[
    { "color": "red" },
    { "color": "blue" }
]
```

We can describe this as an _array of objects_ -- we have objects in our array!

**BUT!** We can go the other way, too. _Arrays_ can be _values_ in our _objects_. Take a look:

```json
{
    "colors": [
        "red",
        "blue",
        "yellow"
    ],
    "numbers": [
        1,
        2,
        3
    ]
}
```

### We call a big bunch of JSON a _blob_.

We can mix and match like this in almost any way we want. Our JSON object can be made up of arrays and objects mixed with one-another, with lots of keys and values all over.

One last thing to mention are the special values `true` and `false`, which represent... well. True and False. We can use them as values in our _blob_ like this:

```json
{
    "red": {
        "color_type": "warm",
        "is_favorite": false
    },
    "blue": {
        "color_type": "cool",
        "is_favorite": true
    }
}
```
Based on our _blob_, we can say a few things:

- `red` is a `warm` color based on its `color_type`. It is _not_ our favorite color, because `is_favorite` is set to `false`.
- `blue` is a `cool` color based on its `color_type`, It _is_ our favorite color, because `is_favorite` is set to `true`.

You can open JSON files with any text editor. It might be hard to read without formatting! You can use online tools like [this one](https://jsonformatter.org/) to format your JSON, and make it easier to read. Just paste it in and press 'go'!