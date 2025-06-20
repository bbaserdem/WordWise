{
  description = "WordWise development shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js and package manager
            nodejs_20
            nodePackages.pnpm
            git

            # Python for LaTeX processing
            python3
            python3Packages.pip

            # Unix utilities
            coreutils # Basic file, shell and text manipulation utilities
            findutils # Find, locate, and xargs commands
            gnugrep # GNU grep, egrep and fgrep
            gnused # GNU stream editor
            ripgrep # Fast line-oriented search tool
            fd # Simple, fast and user-friendly alternative to find
            bat # Cat clone with syntax highlighting
            eza # Modern replacement for ls
            htop # Interactive process viewer
            jq # Lightweight JSON processor
            watch # Execute a program periodically
            curl # Command line tool for transferring data
            wget # Internet file retriever
            tree # Display directories as trees
            unzip # Unzip utility
            zip # Zip utility
          ];

          shellHook = ''
            # Make our node packages available to our shell
            export PATH="./node_modules/.bin:$PATH"
          '';
        };
      }
    );
}
