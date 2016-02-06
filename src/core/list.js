/**
 * Created by mhern on 2/5/2016.
 */
import { Symbol } from "./globals.js";



class List {
  

    constructor(enumerable) {
        this._items = [];
        this._count = 0;

        if(arguments.length === 0) {
            return;
        }

        if(typeof enumerable === "number") {
            this._items.length = enumerable;
            return;
        }


        if(enumerable && !Array.isArray(enumerable) && enumerable[Symbol.iterator]) {
            var iterator = enumerable[Symbol.iterator]();
            var next,
                i = 0;


            while(!(next = iterator.next()).done) {
                this._items[i++] = next.value;
            }


            this._count = i;
            this._items.length = i + 10;
            return;
        }

        if(!Array.from)
            throw new Error("Array.from does not exist");

        this._items = Array.from(enumerable);
        this._count = this._items.length;
        this._items.length = this._count + 10;
    }

    get count(){
        return this._count;
    }

    has(item) {
        return this._items.includes(item);
    }

    indexOf(item) {
        return this._items.indexOf(item);
    }

    [Symbol.iterator]() {
        var next = 0,
            count = this._count,
            set = this._items;

        return {
            next: function() {
                if(next < count)
                    return {value: set[next++], done: false};

                return {done: true}
            }
        }
    }

    forEach(action) {
        var items = this._items,
            i = 0,
            l = this.count;

        for(; i < l; i++) {
            action(items[i], i, this);
        }
    }

    item(index, value) {
        if(index < 0 || index > this._count)
            throw new Error("index is out of range.");

        if(arguments.length === 1) {
            return this._items[index];
        }

        this._items[index] = value;
    }

    add(item) {

        this._items.push(item);
        this._count++;
    }

    remove(item) {
        var index = this.indexOf(item);
        if(index == -1)
            return false;

        return this.removeAt(index).length > 0;
    }

    removeAt(index) {
        var item = this.items.splice(index, 1);
        this._count -= item.length;
        return item;
    }

    clear() {
        this._items.length = 0;
        this._count = 0;
    }

    toArray() {
        var copy = [].concat(this._items);
        copy.length = this.count;

        return copy;
    }
}

export default List;