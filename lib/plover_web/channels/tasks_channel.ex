defmodule PloverWeb.TasksChannel do
  use PloverWeb, :channel

  def join("tasks:lobby", payload, socket) do
    # {:ok, tasks} = Tasks.start_link()
    socket |> IO.inspect(label: "join socket")

    if authorized?(payload) do
      send(self(), :after_join)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_info(:after_join, socket) do
    socket |> IO.inspect(label: "after_join socket")
    push(socket, "tasks", current_state())
    {:noreply, socket}
  end

  def handle_in("getTasks", payload, socket) do
    broadcast(socket, "tasks", current_state())
    {:noreply, socket}
  end

  def handle_in("createTask", payload, socket) do
    # tasks |> IO.inspect(label: "tasks")
    # payload |> IO.inspect(label: "payload")
    Tasks.create(payload)
    # Tasks.value() |> IO.inspect(label: "value")
    # Tasks.value() |> length |> IO.inspect(label: "value length")
    # {:noreply, Tasks.create(payload)}
    broadcast(socket, "tasks", current_state())
    {:noreply, socket}
    # {:reply, {:ok, current_state()}, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  # def handle_in("ping", payload, socket) do
  #   # {:reply, {:ok, payload}, socket}
  #   {:noreply, socket}
  # end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (tasks:lobby).
  # def handle_in("shout", payload, socket) do
  #   broadcast(socket, "shout", payload)
  #   {:noreply, socket}
  # end

  # defp create_task(payload) do
  #   Tasks.create(payload)
  # end

  defp current_state() do
    # %{tasks: Tasks.value()}
    Tasks.value()
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
