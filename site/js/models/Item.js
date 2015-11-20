'use strict';

import Backbone from 'backbone';

/**
 * Our basic todos Item model has `content`, `order`, and `done` attributes. When creating a new Item instance in
 * `App.js->createItem` the current Parse user is also associated with the item instance along with a
 * Parse.ACL (access control list) instance which ensures that the item is only accessible by that given user.
 */
export default class Item extends Backbone.Model
{
   /**
    * Returns the `className` which is the table stored in Parse.
    *
    * @returns {string}
    */
   get className() { return 'Item'; }

   /**
    * Default attributes for the item.
    *
    * @returns {object}
    */
   get defaults() { return { content: 'empty todo...', done: false }; }

   /**
    * Ensure that each item created has `content`.
    */
   initialize()
   {
      if (!this.get('content'))
      {
         this.set({ 'content': this.defaults.content });
      }
   }

   /**
    * Toggle the `done` state of this item.
    */
   toggle()
   {
      this.save({ done: !this.get('done') });
   }
}