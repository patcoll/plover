defmodule Tasks do
  use Agent

  def start_link() do
    # tasks = :ets.new(:tasks, [:set, :public])
    # tasks |> IO.inspect(label: "(start_value) tasks")
    # Agent.start_link(fn -> tasks end, name: __MODULE__)
    Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def value do
    Agent.get(__MODULE__, fn tasks ->
      tasks
      # |> IO.inspect(label: "(value) tasks")

      # selector =
      #   :ets.fun2ms(fn {id} ->
      #     id
      #   end)
      # :ets.select(tasks, selector)
      # |> IO.inspect(label: "tasks?")
    end)
  end

  def create(data) do
    Agent.update(__MODULE__, fn tasks ->
      # tasks
      # |> IO.inspect(label: "(create) tasks")
      # data
      # |> IO.inspect(label: "create data")
      id = Map.get(data, "id")
      # |> IO.inspect(label: "id")

      # :ets.insert(tasks, {id})
      # [data | tasks]

      tasks
      |> Map.put_new(id, data)
    end)
  end
end
