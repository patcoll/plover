import React from 'react';
import 'react-app-polyfill/stable';
import '../css/app.css';
import 'phoenix_html';
import { useTasks } from './tasks';
import sortBy from 'lodash-es/sortBy';

export default function() {
  const { tasks } = useTasks();

  const values = tasks |> Object.values |> sortBy(?, ['lastName']);

  return (
    <div className="App">
      {values.map(task => (
        <div key={task.id} className="task">
          <div className="task__name">
            {task.firstName} {task.lastName}
          </div>
          <div className="task__address">
            {task.address} {task.lastName}
            <div className="task__address__location">
              {task.city}, {task.state} {task.zipCode}
            </div>
            <div className="task__address__location">
              {task.latitude}, {task.longitude}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
