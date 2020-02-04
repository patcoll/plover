defmodule Tasks do
  use Agent

  def start_link() do
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def value do
    Agent.get(__MODULE__, & &1)
  end

  def update(object) do
    Agent.update(
      __MODULE__,
      &Map.put(&1, Map.get(object, "id"), object)
    )
  end

  def delete(object) do
    Agent.update(
      __MODULE__,
      &Map.delete(&1, Map.get(object, "id"))
    )
  end
end
