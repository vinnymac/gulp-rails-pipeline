# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = '2'

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = 'precise64'
  config.vm.box_url = 'http://files.vagrantup.com/precise64.box'

  config.vm.host_name = 'lua.dev'
  config.vm.network 'private_network', ip: '10.10.10.12'

  config.vm.network 'forwarded_port', guest: 3000, host: 3000

  config.vm.synced_folder '.', '/opt/luawebapp', type: 'nfs'

  config.vm.provider :virtualbox do |vb|
    vb.memory = 2048
  end

  config.vm.provision :shell, inline: 'ulimit -n 4048'

  config.vm.provision :ansible do |ansible|
    ansible.playbook = 'deploy/vagrant-playbook.yml'
    ansible.inventory_path = 'deploy/vagrant-inventory.ini'
    ansible.extra_vars = { target: 'vagrant' }
    ansible.sudo = true
    ansible.host_key_checking = false
    ansible.verbose = 'vvvv'
    ansible.limit = 'all'
  end
end
