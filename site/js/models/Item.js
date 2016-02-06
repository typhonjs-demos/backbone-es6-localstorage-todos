'use strict';

import Backbone from 'backbone';

/**
 * Our basic todos Item model has `content`, `order`, and `done` attributes. New Item instances are created in
 * `App.js->createItem`.
 */
export default class Item extends Backbone.Model
{
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
