# Setup

Go through the top-level README instructions, as well as the setup
instructions in `deploy/packer/README.md`.

Then install the vagrant-aws plugin with:

    vagrant plugin install vagrant-aws

Switch to the `deploy/packer/ami-inspect` directory and edit
`Vagrantfile` making sure to specify an AMI.

Once all that's done, you can spin up an EC2 instance based on that AMI
with `vagrant up` and connect to it with `vagrant ssh`. When you're
done, `vagrant destroy` will terminate it.
