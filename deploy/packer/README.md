# Generating AMIs and Vagrant Boxes

## Dependencies

To use the AMI generation script, you will need to add your AWS credentials to
`~/.lua/packer-variables.json` in the form:

    {
      "aws_access_key": "<AWS_ACCESS_KEY>",
      "aws_secret_key": "<AWS_SECRET_KEY>"
    }

Making sure to replace `<AWS_ACCESS_KEY>` and `<AWS_SECRET_KEY>` with
the actual values.

You'll also need private keys for the roles you plan to deploy to in
`~/.lua`, named `<ROLE>.pem` (and, for good measure, you should include
the companion public keys as `<ROLE>.pub`).


### OS X

1. Install Node.js with `brew install node`
2. Download and install [Packer](https://www.packer.io/downloads.html) or install
   with Homebrew by running `brew install packer`
3. Download and install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
4. Install the AWS CLI tools with either `pip install awscli` or `brew install awscli`
   and configure access credentials with `aws configure`


### Ubuntu

1. Install Node.js with `sudo apt-get install nodejs`
2. Download and install [Packer](https://www.packer.io/downloads.html)
3. Download and install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
4. Install the AWS CLI tools with `[sudo] pip install awscli`
   and configure access credentials with `aws configure`


## Creating a New AMI

    ./generate-ami.js <role[s]> <environment>

Where roles can be a comma-separated list of roles to build, or the
magic role `all` which will build all roles.

Unlike roles, only one environment may be specificed at a time.

This script will do the following:

1. Spin up an EC2 instance for each role
2. Provision the instances
3. Stop the instances and create AMIs
4. Terminate the instances


## Creating a New Vagrant Box

    ./generate-vagrant-box.js

This script will do the following:

1. Download an Ubuntu ISO
2. Spin up a new VM in VirtualBox and install Ubuntu
3. Copy the specified ansible roles into the box and apply them
4. Run some cleanup and compression scripts
5. Export the VM state as a .box file
6. Upload the .box file to S3
7. Save the .box file's version, URL, and checksum information to lua-vagrant.json
8. Delete the .box file
