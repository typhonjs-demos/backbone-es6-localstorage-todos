'use strict';

import Backbone      from 'backbone';
import LocalStorage  from 'backbone-localstorage';

import Item          from 'pathSite/js/models/Item.js';

/**
 * Provides the Backbone.localStorage instance and stores data under `backbone:es6:localstorage:TodoList` in the
 * browser local storage.
 */
const s_LOCAL_STORAGE = new LocalStorage('backbone:es6:localstorage:TodoList');

/**
 * This module defines a `Backbone.Collection` which stores todos `Items` and provides utility methods to filter, sort,
 * and retrieve the next order number used to sort `Items`. Instead of exporting the class itself an instance of the
 * the class is exported. This allows the instance to be imported anywhere access to the collection is necessary.
 * Multiple views may access this instance, but in this demo only `ManageTodosView` displays data from the collection.
 *
 * Please note that the Parse.Query is generated in `App.js` during user login using the current user ID to retrieve
 * `Items` associated with the current user.
 */
class TodoList extends Backbone.Collection
{
   /**
    * Reference to this collection's local storage.
    *
    * @returns {*}
    */
   get localStorage() { return s_LOCAL_STORAGE; }

   /**
    * Reference to this collection's model.
    *
    * @returns {Item}
    */
   get model() { return Item; }

   /**
    * Todos are sorted by their original insertion order.
    *
    * @param {Item} item - item model.
    * @returns {number}
    */
   comparator(item)
   {
      return item.get('order');
   }

   /**
    * Filter down the list of all todos items that are finished.
    *
    * @returns {*}
    */
   done()
   {
      return this.filter((item) => { return item.get('done'); });
   }

   /**
    * We keep the todos Items in sequential order, despite being saved by unordered GUID in the database. This
    * generates the next order number for new items.
    *
    * @returns {number}
    */
   nextOrder()
   {
      if (!this.length) { return 1; }
      return this.last().get('order') + 1;
   }

   /**
    * Filter down the list to only todos items that are still not finished.
    *
    * @returns {*}
    */
   remaining()
   {
      return this.without(...this.done());
   }
}

/**
 * Exports an instance of TodoList.
 */
export default new TodoList();