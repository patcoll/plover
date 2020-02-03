import isEqual from 'lodash-es/isEqual';
import EventEmitter from 'eventemitter3';

function Tasks({ socket }) {
  EventEmitter.call(this);

  this.tasks = {};

  if (socket.connectionState() === 'closed') {
    this.emit('connect');
    socket.connect();
  }

  this.channel = socket.channel('tasks:lobby', {});
  this.channel.on('tasks', tasks => {
    console.log(`on('tasks'), tasks =`, tasks);
    this.setTasks(tasks);
  });
  this.channel
    .join()
    .receive('ok', resp => {
      this.emit('join.ok', resp);
    })
    .receive('error', err => {
      this.emit('join.error', err);
    });
}

Tasks.prototype = Object.assign({}, EventEmitter.prototype, {
  createTask: function(data = {}) {
    if (Object.keys(data).length === 0) {
      return;
    }
    this.channel.push('createTask', data);
  },

  getTasks: function() {
    this.channel.push('getTasks');
  },

  setTasks: function(newTasks) {
    for (const id in newTasks) {
      if (!isEqual(this.tasks[id], newTasks[id])) {
        let didExist = !!this.tasks[id];
        this.tasks[id] = newTasks[id];
        if (didExist) {
          this.emit(`change`, this.tasks[id]);
          this.emit(`change:${id}`, this.tasks[id]);
        }
      }
    }

    this.emit('data', this.tasks);
  }
});

Tasks.prototype.constructor = Tasks;

export default Tasks;
