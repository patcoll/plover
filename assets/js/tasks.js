import EventEmitter from 'eventemitter3';

export default class Tasks extends EventEmitter {
  /**
   * Channel object
   */
  channel = null;

  /**
   * What kind of data?
   */
  type = 'tasks';

  /**
   * Store the data here
   */
  data = {};

  constructor({ socket }) {
    super();

    if (socket.connectionState() === 'closed') {
      this.emit('connect');
      socket.connect();
    }

    this.channel = socket.channel(this.type);

    this.channel.on(`${this.type}:created`, task => {
      this._setTask(task);
      this.emit('created', task);
    });

    this.channel.on(`${this.type}:updated`, task => {
      this._setTask(task);
      this.emit('updated', task);
    });

    this.channel.on(`${this.type}:deleted`, task => {
      this._deleteTask(task);
      this.emit('deleted', task);
    });

    this.channel.on(`${this.type}:data`, tasks => {
      this._setTasks(tasks);
    });

    this.channel
      .join()
      .receive('ok', resp => {
        this.emit('join.ok', resp);
      })
      .receive('error', err => {
        this.emit('join.error', err);
      });

    this.getTasks();
  }

  createTask(data = {}) {
    return new Promise((resolve, reject) => {
      this.channel
        .push('createTask', data)
        .receive('ok', task => {
          resolve(task);
        })
        .receive('error', err => {
          reject(err);
        });
    });
  }

  updateTask(data = {}) {
    return new Promise((resolve, reject) => {
      this.channel
        .push('updateTask', data)
        .receive('ok', task => {
          resolve(task);
        })
        .receive('error', err => {
          reject(err);
        });
    });
  }

  deleteTask(data = {}) {
    return new Promise((resolve, reject) => {
      this.channel
        .push('deleteTask', data)
        .receive('ok', task => {
          resolve(task);
        })
        .receive('error', err => {
          reject(err);
        });
    });
  }

  getTasks() {
    return new Promise((resolve, reject) => {
      this.channel
        .push('getTasks')
        .receive('ok', tasks => {
          this._setTasks(tasks);
          resolve(tasks);
        })
        .receive('error', err => {
          reject(err);
        });
    });
  }

  _setTask(task) {
    this._setTasks({
      [task.id]: task
    });
  }

  _setTasks(newTasks) {
    this.data = {
      ...this.data,
      ...newTasks
    };

    this.emit('data', this.data);
  }

  _deleteTask(task) {
    const { [task.id]: _, ...result } = this.data;
    this.data = result;
  }
}
