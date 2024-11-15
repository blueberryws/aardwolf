

There are several places where you will see a pattern like this:
```
...
    this.clickHandler => (e) this.handleClick(e);
...
```
The reason that this exists, rather than directly passing the function, or using a lambda is that we need to preserve both the `this` context AND a reference to the handler.

In (currently) all cases, we need a reference to the handler function so that we can REMOVE the handler when the UnsetDocumentEditable event is called. If we don't remove the handler, we can end up in situations where we have two identical handlers.

Another solution to this problem would be to use this syntax:
```
...
    this.clickHandler = this.handleClick.bind(this);
...
```
which would bind the `this` context on the function. Either is acceptable, I just thought the lambda is easier to read/understand.
