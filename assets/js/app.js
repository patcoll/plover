import React from 'react';
import 'react-app-polyfill/stable';
import '../css/app.css';
import 'phoenix_html';
import socket from './socket';
import Tasks from './tasks';
import faker from 'faker';
import uuid from 'uuid';

function App() {
  const tasks = new Tasks({ socket });

  console.log('tasks', tasks);

  tasks.on('join.ok', resp => console.log('Joined successfully', resp));
  tasks.on('join.error', resp => console.log('Unable to join', resp));

  tasks.on('created', task => {
    console.log(`on('created')`);
    console.log('task created');
    console.log('task =', JSON.stringify(task, null, 2));
  });

  tasks.on('updated', task => {
    console.log(`on('updated')`);
    console.log('task updated');
    console.log('task =', JSON.stringify(task, null, 2));
  });

  tasks.on('deleted', task => {
    console.log(`on('deleted')`);
    console.log('task deleted');
    console.log('task =', JSON.stringify(task, null, 2));
  });

  tasks.on('data', tasks => {
    console.log(`on('data')`);
    console.log('all tasks');
    console.log('new length: ', Object.values(tasks).length);
  });

  setInterval(
    () =>
      tasks.createTask({
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
    const keys = Object.keys(tasks.data);
    if (keys.length === 0) {
      return;
    }
    const randomId = keys[Math.floor(Math.random() * keys.length)];
    tasks.deleteTask(tasks.data[randomId]);
  }, 8000);

  setInterval(() => {
    const keys = Object.keys(tasks.data);
    if (keys.length === 0) {
      return;
    }
    const randomId = keys[Math.floor(Math.random() * keys.length)];
    const updatedTaskData = Object.assign({}, tasks.data[randomId], {
      latitude: faker.address.latitude(),
      longitude: faker.address.longitude()
    });
    tasks.updateTask(updatedTaskData);
  }, 2000);

  return <div className="App">Test</div>;
}

export default App;
