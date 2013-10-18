class setup {

  # Ensure all project-specific npm packages are installed.
  exec { 'install-project-npm':
    command   => '/usr/bin/npm install',
    cwd  => '/var/www',
    user => 'vagrant',
    require   => Package['nodejs']
  }

  # Ensure the application bin directory is added to environment PATH.
  exec { 'add-to-path':
    command => '/bin/echo "export PATH=\"\$PATH:/var/www/bin\" >> ~/.bashrc"',
    user => 'vagrant',
    require => Package['nodejs']
  }
}
