## Building react app as an library

The React app is **built as a library** so it can be embedded into a host
website. This is achieved by modifying the **Vite build configuration** to
output library format bundles.


### Implementation
- Then entry file exposes an `mountApp` function.
- The host site includes a [loader](./202509301306-loader.md) script which call the `mountApp`.
- The `mountApp` function mounts the app into the host DOM and apply the host
  provided configuration.

##### `mountApp` Parameters
- `container`: The ID of the DOM element where the app mounts.
- `config`: Configuration object passed from the host site.
 

### Backlinks:
- [Frontend Architecture](./202509301105-frontend-architecture.md)
