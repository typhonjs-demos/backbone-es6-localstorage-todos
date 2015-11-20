'use strict';

import _          from 'underscore';
import Backbone   from 'backbone';

import itemTmpl   from 'pathSite/templates/item.html!text';

/**
 * The `Backbone.View` for an item which encapsulates the ability to edit the content of the item. With a desktop
 * browser an `Item` can be edited with a double click or double tap when running on a mobile device. Zepto is the
 * jQuery equivalent library being used and the touch API is added so additional touch events, `doubleTap` are
 * available.
 */
export default class ItemView extends Backbone.View
{
   /**
    * Defines the tag that is created for an `Item`.
    *
    * @returns {string}
    */
   get tagName() { return 'li'; }

   /**
    * Delegated events for interacting with an `Item`.
    *
    * @returns {object}
    */
   get events()
   {
      return {
         'click .toggle': 'toggleDone',
         'doubleTap label.todo-content': 'edit',
         'dblclick label.todo-content': 'edit',
         'click .todo-destroy': 'clear',
         'keypress .edit': 'updateOnEnter',
         'blur .edit': 'closeEdit'
      };
   }

   /**
    * Cache the template function for a single item.
    *
    * @returns {*}
    */
   get template() { return _.template(itemTmpl); }

   /**
    * The ItemView listens for changes to its model, re-rendering. Since there's a one-to-one correspondence between an
    * Item and an ItemView. If the model is deleted then the `Backbone.View->remove` method is invoked.
    */
   initialize()
   {
      // Binds the `this` context to all methods such that it is accessible via Backbone event callbacks.
      _.bindAll(this, 'clear', 'closeEdit', 'remove', 'render');

      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
   }

   /**
    * Remove the item, destroy the model.
    */
   clear()
   {
      this.model.destroy();
   }

   /**
    * Close the `editing` mode, saving changes to the todo.
    */
   closeEdit()
   {
      this.model.save({ content: this.input.val() });
      this.$el.removeClass('editing');
   }

   /**
    * Switch this view into `editing` mode, displaying the input field.
    */
   edit()
   {
      this.$el.addClass('editing');
      this.input.focus();
   }

   /**
    * Re-render the contents of the Item.
    *
    * @returns {ItemView}
    */
   render()
   {
      this.$el.html(this.template(this.model.toJSON()));

      /**
       * @type {object} Stores the edit input.
       */
      this.input = this.$('.edit');

      return this;
   }

   /**
    * Toggle the `done` state of the model.
    */
   toggleDone()
   {
      this.model.toggle();
   }

   /**
    * If you hit `enter`, we're through editing the item.
    *
    * @param {object}   e - event data
    */
   updateOnEnter(e)
   {
      if (e.keyCode === 13) { this.closeEdit(); }
   }
}