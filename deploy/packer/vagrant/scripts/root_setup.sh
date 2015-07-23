#!/bin/bash

set -e

# Add ansible apt repository
sudo apt-get install -y -q software-properties-common
sudo add-apt-repository -y ppa:ansible/ansible

# Updating and Upgrading dependencies
sudo apt-get update -y -qq
sudo apt-get upgrade -y -qq

# Install ansible
sudo apt-get install -y ansible

# Install necessary libraries for guest additions and Vagrant NFS Share
sudo apt-get -y -q install linux-headers-$(uname -r) build-essential dkms nfs-common

echo "vagrant ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/vagrant-nopass

sudo service sudo restart
