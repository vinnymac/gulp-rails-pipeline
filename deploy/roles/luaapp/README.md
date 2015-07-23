Lua Web Application
============

This role installs the runtime dependencies required to run the Lua web
application. It creates init scripts for the message queue, and unicorn
web server.

Requirements
------------

This role requires Ansible 1.4 or higher, and only has been tested on 
Ubintu 12.04.

Role Variables
--------------

The variables that can be passed to this role and a brief description about
them are as follows:

      sidekiq_queue_name: "sidekiq1"      # Used to describe PID
      rails_root: "/vagrant"              # The rails application root
      rails_env: "development"            # Rails env
      sidekiq_threads: 2                  # -c 2
      sidekiq_process_index: 0            # -i 0
      sidekiq_queue_length: "default"     # -q default

Examples
--------


Dependencies
------------

None

License
-------

BSD

Author Information
------------------

Matt Urbanski
