defmodule Tasks do
  use Agent

  def start_link() do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def value do
    Agent.get(__MODULE__, fn tasks ->
      tasks
    end)
  end

  def create(data) do
    Agent.update(__MODULE__, fn tasks ->
      id = Map.get(data, "id")
      tasks |> Map.put_new(id, data)
    end)
  end
end
