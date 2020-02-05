import { useState, useEffect } from 'react';
import EventEmitter from 'eventemitter3';
import socket from './socket';
import faker from 'faker';
import uuid from 'uuid';

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

    // This grabs initial data, sets it, and emits data event.
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

const store = new Tasks({ socket });

function useTasks() {
  const [tasks, setTasks] = useState(store.data);

  useEffect(() => {
    const onData = newTasks => setTasks(newTasks);
    store.on('data', onData);

    // addDebugging({ store });
    setTimers({ store });

    return () => store.off('data', onData);
  }, []);

  // return { store, tasks, setTasks };
  return { store, tasks };
}

export { useTasks };

function addDebugging({ store }) {
  store.on('join.ok', resp => console.log('Joined successfully', resp));
  store.on('join.error', resp => console.log('Unable to join', resp));

  store.on('created', task => {
    console.log(`on('created')`);
    console.log('task created');
    console.log('task =', JSON.stringify(task, null, 2));
  });

  store.on('updated', task => {
    console.log(`on('updated')`);
    console.log('task updated');
    console.log('task =', JSON.stringify(task, null, 2));
  });

  store.on('deleted', task => {
    console.log(`on('deleted')`);
    console.log('task deleted');
    console.log('task =', JSON.stringify(task, null, 2));
  });

  store.on('data', tasks => {
    console.log(`on('data')`);
    console.log('all tasks');
    console.log('new length: ', Object.values(tasks).length);
  });
}

function setTimers({ store }) {
  setInterval(
    () =>
      store.createTask({
        id: uuid.v4(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        zipCode: faker.address.zipCode(),
        latitude: faker.address.latitude(),
        longitude: faker.address.longitude()
      }),
    8000
  );

  setInterval(() => {
    const keys = Object.keys(store.data);
    if (keys.length === 0) {
      return;
    }
    const randomId = keys[Math.floor(Math.random() * keys.length)];
    store.deleteTask(store.data[randomId]);
  }, 8000);

  setInterval(() => {
    const keys = Object.keys(store.data);
    if (keys.length === 0) {
      return;
    }
    const randomId = keys[Math.floor(Math.random() * keys.length)];
    const updatedTaskData = Object.assign({}, store.data[randomId], {
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude()
    });
    store.updateTask(updatedTaskData);
  }, 2000);
}
