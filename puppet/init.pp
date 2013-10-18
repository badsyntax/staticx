import 'classes/*'

class init {

  exec { 'apt-update':
    command => '/usr/bin/apt-get update',
  }

  # Install system packages.
  include git
  include nodejs
  include ruby
  include sass

  # Setup the application.
  include setup
}

include init
