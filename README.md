# Plover

Plover is an experiment to integrate Phoenix channels, React, and the Flux
pattern to handle data. I'm using it to learn Phoenix.

Right now it uses a non-durable Agent cache to store data. The JS data layer
includes a bespoke `Tasks` data repository utility that integrates with the
Phoenix JS library to allow creation and synchronization of objects across many
clients.

The current plan is to come up with a demo with React and the D3.js data
visualization library.

## Phoenix-specific instructions

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix
