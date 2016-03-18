'use strict';

import $                from 'jquery';
import _                from 'underscore';
import Backbone         from 'backbone';
import eventbus         from 'mainEventbus';

import ItemView         from 'pathSite/js/views/ItemView.js';

import appState         from 'pathSite/js/models/appState.js';
import todoList         from 'pathSite/js/collections/todoList.js';

import manageTodosTmpl  from 'pathSite/templates/manage-todos.html!text';
import statsTmpl        from 'pathSite/templates/stats.html!text';

/**
 * The main view that lets a user manage their todos `Items`. When the various items are rendered they are tracked
 * in the `itemViews` map so that they can be cleaned up correctly.
 */
export default class ManageTodosView extends Backbone.View
{
   /**
    * Delegated events for creating new items and clearing completed ones.
    *
    * @returns {object}
    */
   get events()
   {
      return {
         'keypress #new-todo': 'createOnEnter',
         'click #clear-completed': 'clearCompleted',
         'click #toggle-all': 'toggleAllComplete',
         'click ul#filters a': (e) => { eventbus.trigger('app:select:filter', $(e.target).attr('id')); }
      };
   }

   /**
    * The template for the line of statistics at the bottom of the app.
    */
   get statsTemplate() { return _.template(statsTmpl); }

   /**
    * Extends the optional parameters with the element this view is associated with to `.content`.
    *
    * @param {object}   options - optional parameters
    */
   constructor(options = {})
   {
      super(_.extend({ el: '.content' }, options));

      /**
       * Stores all current `ItemViews` so that they may be properly cleaned up.
       *
       * @type {Array<ItemView>}
       */
      this.itemViews = new Map();
   }

   /**
    * At initialization we bind to the relevant events on the `Todos` collection, when items are added or changed.
    * Kick things off by loading any preexisting todos that might be saved to Parse.
    *
    * @param {object}   options - optional parameters
    */
   initialize(options)
   {
      // Binds the `this` context to all methods such that it is accessible via Backbone event callbacks.
      _.bindAll(this, 'addOne', 'addAll', 'addSome', 'createOnEnter', 'render', 'toggleAllComplete');

      // Main todos management template.
      this.$el.html(_.template(manageTodosTmpl)(options));

      /**
       * @type {object} Stores the input field.
       */
      this.input = this.$('#new-todo');

      /**
       * @type {object} Stores the toggle all checkbox.
       */
      this.allCheckbox = this.$('#toggle-all')[0];

      // Useful to get rid of the initial displayed spinner gif. This is called only once when the collection
      // initially is reset.
      this.listenToOnce(todoList, 'reset', () => { this.$('#todo-list').html(''); });

      // When `AppState` changes invoke `filter` to redraw this view.
      this.listenTo(appState, 'change', this.filter);

      // When `todoList` is reset / initially populated or if an Item done state changes invoke `filter` to
      // redraw this view.
      this.listenTo(todoList, 'change:done reset', this.filter);

      // Ensure that the statistics are re-rendered when an item is added or removed.
      this.listenTo(todoList, 'update', this.render);
   }

   /**
    * Add all items in the Todos collection at once.
    */
   addAll()
   {
      this.clearAll();

      todoList.each(this.addOne);

      this.render();
   }

   /**
    * Add a single item to the list by creating a view for it, and appending its element to the `<ul>`.
    *
    * @param {Item}  item - Item to add.
    */
   addOne(item)
   {
      const view = new ItemView({ model: item });

      this.itemViews.set(item, view);

      this.$('#todo-list').append(view.render().el);
   }

   /**
    * Only adds some todos, based on a filtering function that is passed into `addSome`.
    *
    * @param {function} filter - A function to filter the Items.
    */
   addSome(filter)
   {
      this.clearAll();

      todoList.chain().filter(filter).each(this.addOne);

      this.render();
   }

   /**
    * Iterates through the `itemViews` map invoking the `Backbone.View->remove` method for each `ItemView` tracked.
    * The map is then cleared.
    */
   clearAll()
   {
      this.itemViews.forEach((itemView) => { itemView.remove(); });
      this.itemViews.clear();
   }

   /**
    * Clear all done todos items, destroying their models.
    */
   clearCompleted()
   {
      _.each(todoList.done(), (item) =>
      {
         // This will trigger the remove method of ItemView.
         item.destroy();

         // Remove the ItemView from the tracking map.
         this.itemViews.delete(item);
      });
   }

   /**
    * If you hit return in the main input field, create new Item model. The creation of the item is handled over
    * the eventbus via triggering `app:create:item` which invokes `App.js->createItem`.
    *
    * @param {object}   e - event data
    */
   createOnEnter(e)
   {
      // Only respond to `enter` pressed.
      if (e.keyCode !== 13) { return; }

      // Create new item.
      eventbus.trigger('app:create:item', this.input.val());

      // Clear the input text field.
      this.input.val('');

      // Sets state and updates Backbone.history.navigate.
      eventbus.trigger('app:select:filter', 'all');
   }

   /**
    * Invoked when the TodoList collection is reset and when the app state changes.
    */
   filter()
   {
      const filterValue = appState.get('filter');

      switch (filterValue)
      {
         case 'all':
            this.addAll();
            break;

         case 'completed':
            this.addSome((item) => { return item.get('done'); });
            break;

         default:
            this.addSome((item) => { return !item.get('done'); });
            break;
      }
   }

   /**
    * Re-rendering the App just means refreshing the statistics -- the rest of the app doesn't change.
    */
   render()
   {
      const done = todoList.done().length;
      const remaining = todoList.remaining().length;

      // Render the statistics template
      this.$('#todo-stats').html(this.statsTemplate({ total: todoList.length, done, remaining }));

      // Automatically wires all events specified by `get events()`.
      this.delegateEvents();

      // Sets the checked state of the allCheckbox depending on remaining count.
      this.allCheckbox.checked = !remaining;

      // Update the filter state after the stats template is rendered.
      const filterValue = appState.get('filter');
      $('ul#filters a').removeClass('selected');
      $(`ul#filters a#${filterValue}`).addClass('selected');
   }

   /**
    * Toggles all todos items to completed / done then saves each item.
    */
   toggleAllComplete()
   {
      const done = this.allCheckbox.checked;
      todoList.each((item) => { item.save({ done }); });
   }
}
