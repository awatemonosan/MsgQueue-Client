msgqueue-client
=========

A message queue client for MsgQueue-Server

## Installation

  npm install msgqueue-client --save

## Usage

TODO: THIS SECTION

## Tests

  npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.1.0 Initial release
* 0.1.2 Added readme, small fixes
* 0.1.3 Fixed error relating to promises
* 0.1.4 Updated to use new version of pidgey
* 0.1.5 Add optional 2nd argument to .watch
* 0.1.7 Documented that .watch has been changed to .listen. Debug logs removed
* 0.1.9 Added Ping method for testing connectivity
* 0.1.9 Added 'connected' event that fires once msgQueue-server is available
* 0.1.10 Add MsgQueue.log. Set to true to enable debug outputs
* 0.1.11 Fix bug causing ping to not send
* 0.1.12 Update to use current version of pidgey
* 0.1.13 Add options as an optional second argument to constructor