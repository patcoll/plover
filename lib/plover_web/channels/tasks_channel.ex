defmodule PloverWeb.TasksChannel do
  use PloverWeb, :channel

  def join("tasks", payload, socket) do
    if authorized?(payload) do
      # send(self(), :after_join)
      {:ok, socket}
    else
      {:error, error("unauthorized")}
    end
  end

  # def handle_info(:after_join, socket) do
  #   broadcast(socket, "tasks:data", current_state())
  #   {:noreply, socket}
  # end

  def handle_in("getTasks", _payload, socket) do
    {:reply, {:ok, current_state()}, socket}
  end

  def handle_in("createTask", %{"id" => _} = payload, socket) do
    Tasks.update(payload)

    if is_equal(payload) do
      broadcast(socket, "tasks:created", payload)
      {:reply, {:ok, payload}, socket}
    else
      {:reply, {:error, error("Could not create task")}, socket}
    end
  end

  def handle_in("createTask", _payload, socket) do
    {:reply, {:error, error("Could not create task")}, socket}
  end

  def handle_in("updateTask", %{"id" => _} = payload, socket) do
    Tasks.update(payload)

    if is_equal(payload) do
      broadcast(socket, "tasks:updated", payload)
      {:reply, {:ok, payload}, socket}
    else
      {:reply, {:error, error("Could not update task")}, socket}
    end
  end

  def handle_in("updateTask", _payload, socket) do
    {:reply, {:error, error("Could not update task")}, socket}
  end

  def handle_in("deleteTask", %{"id" => _} = payload, socket) do
    Tasks.delete(payload)

    if does_not_exist(payload) do
      broadcast(socket, "tasks:deleted", payload)
      {:reply, {:ok, payload}, socket}
    else
      {:reply, {:error, error("Could not delete task")}, socket}
    end
  end

  def handle_in("deleteTask", _payload, socket) do
    {:reply, {:error, error("Could not delete task")}, socket}
  end

  defp is_equal(%{"id" => id} = payload) do
    Map.get(current_state(), id) == payload
  end

  defp does_not_exist(%{"id" => id}) do
    !Map.has_key?(current_state(), id)
  end

  defp current_state() do
    # %{tasks: Tasks.value()}
    Tasks.value()
  end

  defp error("" <> _ = reason) do
    %{reason: reason}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
