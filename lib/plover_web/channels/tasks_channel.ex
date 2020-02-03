defmodule PloverWeb.TasksChannel do
  use PloverWeb, :channel

  def join("tasks:lobby", payload, socket) do
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
    Tasks.create(payload)
    broadcast(socket, "tasks", current_state())
    {:noreply, socket}
  end

  defp current_state() do
    # %{tasks: Tasks.value()}
    Tasks.value()
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
