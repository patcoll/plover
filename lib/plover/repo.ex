defmodule Plover.Repo do
  use Ecto.Repo,
    otp_app: :plover,
    adapter: Ecto.Adapters.Postgres
end
