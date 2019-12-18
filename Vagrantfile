Vagrant.configure("2") do |config|
  config.vm.box = "hbsmith/awslinux"

  # Postgres
  config.vm.network "forwarded_port", guest: 5432, host: 5432

  config.vm.provider "virtualbox" do |v|
    v.name = "web-stack"
    v.gui = false
    v.memory = "1024"
  end

  config.vm.provision "shell", path: "setup"
end
