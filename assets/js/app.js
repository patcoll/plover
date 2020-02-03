import 'react-app-polyfill/stable';

// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import '../css/app.css';

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import 'phoenix_html';

// Import local files
//
// Local files can be imported directly using relative paths, for example:
import socket from './socket';

import Tasks from './tasks';
import faker from 'faker';
import uuid from 'uuid';

const tasks = new Tasks({ socket });

console.log('tasks', tasks);

tasks.on('join.ok', resp => console.log('Joined successfully', resp));
// tasks.on('error', resp => console.log('Unable to join', resp));
// tasks.on('change:*', t => {
//   console.log('thing', t);
// });

tasks.on('change', task => console.log({ task }));

tasks.on('data', tasks => {
  console.log(`on('data')`);
  console.log('tasks changed');
  console.log('new length: ', Object.values(tasks).length);
  // console.log('tasks =', JSON.stringify(tasks, null, 2));
});

// tasks.getTasks();

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
